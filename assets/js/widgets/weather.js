/* Widget WTHR-02 — météo Open-Meteo, géolocalisation diagnostiquée,
   description du ciel et recommandation du jour */
YCOS.register('weather', {
  render: function(el){
    var self = this;
    this.el = el;
    this.labelEl = document.getElementById('weather-label');
    this.locEl = document.getElementById('status-loc');
    if (!YCOS_CONFIG.weather.enabled){
      el.innerHTML = '<div class="temp">--</div>' +
        '<div class="wline">MODULE DÉSACTIVÉ</div>';
      return;
    }
    el.innerHTML =
      '<div class="wbody"></div>' +
      '<div class="focus-actions">' +
        '<button class="fbtn" id="w-geo">POSITION</button>' +
        '<button class="fbtn" id="w-refresh">MAJ</button>' +
      '</div>' +
      '<p class="meta" id="w-status"></p>';
    this.bodyEl = el.querySelector('.wbody');
    this.statusEl = el.querySelector('#w-status');
    el.querySelector('#w-geo').addEventListener('click', function(){
      YStore.remove('geo-position');
      self.position(function(pos){ self.load(pos); }, true);
    });
    el.querySelector('#w-refresh').addEventListener('click', function(){
      YStore.remove('weather-cache');
      if (self.pos){ self.load(self.pos); }
    });
    this.position(function(pos){
      self.load(pos);
    });
  },
  position: function(cb, force){
    var cfg = YCOS_CONFIG.geo;
    var u = YCOS_CONFIG.user;
    var self = this;
    var cached = YStore.get('geo-position', null);
    var fresh = cached && (Date.now() - cached.at) < cfg.maxAgeHours * 3600000;
    if (cached && !force && (!cfg.enabled || fresh)){
      this.pos = { lat: cached.lat, lon: cached.lon };
      this.announce(cached.lat, cached.lon, cached.local === true);
      cb(this.pos);
      return;
    }
    if (window.isSecureContext === false){
      this.pos = { lat: u.lat, lon: u.lon };
      this.announce(u.lat, u.lon, false);
      this.status('CONTEXTE NON SÉCURISÉ — GÉO INDISPONIBLE, REJET RENNES', false);
      cb(this.pos);
      return;
    }
    if (cfg.enabled && navigator.geolocation){
      this.bodyEl.innerHTML = '<div class="temp">..</div>' +
        '<div class="wline">ACQUISITION DE LA POSITION...</div>';
      navigator.geolocation.getCurrentPosition(function(p){
        var pos = { lat: p.coords.latitude, lon: p.coords.longitude,
                    local: true, at: Date.now() };
        YStore.set('geo-position', pos);
        self.pos = { lat: pos.lat, lon: pos.lon };
        self.announce(pos.lat, pos.lon, true);
        cb(self.pos);
      }, function(err){
        YStore.set('geo-position',
          { lat: u.lat, lon: u.lon, local: false, at: Date.now() });
        self.pos = { lat: u.lat, lon: u.lon };
        self.announce(u.lat, u.lon, false);
        var cause = 'AUTORISATION REFUSÉE';
        if (err && err.code === 2){ cause = 'POSITION INDISPONIBLE'; }
        if (err && err.code === 3){ cause = 'DÉLAI DÉPASSÉ'; }
        self.status(cause + ' — REJET RENNES. LA GÉO EXIGE HTTPS (GITHUB PAGES) OU LOCALHOST.', true);
        cb(self.pos);
      }, { timeout: 8000 });
    } else {
      this.pos = { lat: u.lat, lon: u.lon };
      this.announce(u.lat, u.lon, false);
      cb(this.pos);
    }
  },
  announce: function(lat, lon, local){
    var la = Math.abs(lat).toFixed(2) + (lat >= 0 ? 'N' : 'S');
    var lo = Math.abs(lon).toFixed(2) + (lon >= 0 ? 'E' : 'W');
    if (this.labelEl){
      this.labelEl.textContent = local ? 'position locale' : 'Rennes';
    }
    if (this.locEl){
      this.locEl.innerHTML = 'SYS <span class="ok">OK</span> — ' +
        la + ' / ' + lo;
    }
  },
  load: function(pos){
    var self = this;
    var cache = YStore.get('weather-cache', null);
    var ttl = YCOS_CONFIG.weather.cacheMinutes * 60000;
    if (cache && (Date.now() - cache.at) < ttl &&
        cache.lat === pos.lat && cache.lon === pos.lon){
      this.paint(cache.data);
      return;
    }
    this.bodyEl.innerHTML = '<div class="temp">..</div>' +
      '<div class="wline">INTERROGATION OPEN-METEO...</div>';
    var url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + pos.lat + '&longitude=' + pos.lon +
      '&current=temperature_2m,apparent_temperature,precipitation,' +
      'wind_speed_10m,wind_direction_10m,weather_code' +
      '&daily=temperature_2m_max,temperature_2m_min,' +
      'precipitation_probability_max' +
      '&timezone=Europe%2FParis&forecast_days=1';
    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(j){
        YStore.set('weather-cache',
          { at: Date.now(), data: j, lat: pos.lat, lon: pos.lon });
        self.paint(j);
      })
      .catch(function(){
        self.bodyEl.innerHTML = '<div class="temp">--</div>' +
          '<div class="wline">MÉTÉO INDISPONIBLE<br>Vérifier la connexion.</div>';
      });
  },
  paint: function(j){
    var c = j.current || {};
    var d = j.daily || {};
    var temp = (c.temperature_2m !== undefined) ? Math.round(c.temperature_2m) : null;
    var feel = (c.apparent_temperature !== undefined) ? Math.round(c.apparent_temperature) : '--';
    var wind = (c.wind_speed_10m !== undefined) ? Math.round(c.wind_speed_10m) : null;
    var dir = this.cardinal(c.wind_direction_10m);
    var rain = (d.precipitation_probability_max && d.precipitation_probability_max[0] !== undefined)
      ? d.precipitation_probability_max[0] : null;
    var max = (d.temperature_2m_max && d.temperature_2m_max[0] !== undefined)
      ? Math.round(d.temperature_2m_max[0]) : '--';
    var min = (d.temperature_2m_min && d.temperature_2m_min[0] !== undefined)
      ? Math.round(d.temperature_2m_min[0]) : '--';
    this.bodyEl.innerHTML =
      '<div class="temp">' + (temp === null ? '--' : temp) + '&deg;</div>' +
      '<div class="wline">' + this.describe(c.weather_code) + '<br>' +
      'RESSSENTI ' + feel + '&deg;<br>' +
      'VENT ' + dir + ' ' + (wind === null ? '--' : wind) + ' KM/H<br>' +
      'PLUIE ' + (rain === null ? '--' : rain) + ' %<br>' +
      'MAX ' + max + '&deg; / MIN ' + min + '&deg;</div>' +
      '<div class="wline advice">' + this.advise(temp, rain, wind) + '</div>';
    var now = new Date();
    var hh = ('0' + now.getHours()).slice(-2);
    var mm = ('0' + now.getMinutes()).slice(-2);
    this.status('MAJ ' + hh + ':' + mm, false);
  },
  describe: function(code){
    if (code === 0){ return 'CIEL DÉGAGÉ'; }
    if (code === 1){ return 'GÉNÉRALEMENT DÉGAGÉ'; }
    if (code === 2){ return 'PARTIELLEMENT NUAGEUX'; }
    if (code === 3){ return 'CIEL COUVERT'; }
    if (code === 45 || code === 48){ return 'BROUILLARD'; }
    if (code >= 51 && code <= 57){ return 'BRUINE'; }
    if (code >= 61 && code <= 67){ return 'PLUIE'; }
    if (code >= 71 && code <= 77){ return 'NEIGE'; }
    if (code >= 80 && code <= 82){ return 'AVERSES'; }
    if (code === 85 || code === 86){ return 'AVERSES DE NEIGE'; }
    if (code >= 95){ return 'ORAGE'; }
    return '—';
  },
  advise: function(temp, rain, wind){
    if (rain !== null && rain >= 50){ return 'PARAPLUIE RECOMMANDÉ'; }
    if (temp !== null && temp <= 5){ return 'MANTEAU REQUIS'; }
    if (wind !== null && wind >= 50){ return 'VENT FORT — ATTENTION'; }
    if (temp !== null && temp >= 25){ return 'HYDRATATION RECOMMANDÉE'; }
    return 'CONDITIONS NOMINALES';
  },
  status: function(text, alert){
    if (!this.statusEl){ return; }
    this.statusEl.textContent = text;
    this.statusEl.style.color = alert ? '#D4553F' : '';
  },
  cardinal: function(deg){
    if (deg === undefined || deg === null){ return '--'; }
    var dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return dirs[Math.round(deg / 22.5) % 16];
  }
});
