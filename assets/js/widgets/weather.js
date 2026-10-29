/* Widget WTHR-02 — météo Open-Meteo, géolocalisation avec repli sur Rennes */
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
    this.position(function(pos){
      self.load(pos);
    });
  },
  position: function(cb){
    var cfg = YCOS_CONFIG.geo;
    var u = YCOS_CONFIG.user;
    var self = this;
    var cached = YStore.get('geo-position', null);
    var fresh = cached && (Date.now() - cached.at) < cfg.maxAgeHours * 3600000;
    if (cached && (!cfg.enabled || !navigator.geolocation || fresh)){
      this.announce(cached.lat, cached.lon, cached.local === true);
      cb({ lat: cached.lat, lon: cached.lon });
      return;
    }
    if (cfg.enabled && navigator.geolocation){
      var wait = function(){
        self.el.innerHTML = '<div class="temp">..</div>' +
          '<div class="wline">ACQUISITION DE LA POSITION...</div>';
      };
      wait();
      navigator.geolocation.getCurrentPosition(function(p){
        var pos = { lat: p.coords.latitude, lon: p.coords.longitude,
                    local: true, at: Date.now() };
        YStore.set('geo-position', pos);
        self.announce(pos.lat, pos.lon, true);
        cb({ lat: pos.lat, lon: pos.lon });
      }, function(){
        YStore.set('geo-position',
          { lat: u.lat, lon: u.lon, local: false, at: Date.now() });
        self.announce(u.lat, u.lon, false);
        cb({ lat: u.lat, lon: u.lon });
      }, { timeout: 8000 });
    } else {
      this.announce(u.lat, u.lon, false);
      cb({ lat: u.lat, lon: u.lon });
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
    this.el.innerHTML = '<div class="temp">..</div>' +
      '<div class="wline">INTERROGATION OPEN-METEO...</div>';
    var url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + pos.lat + '&longitude=' + pos.lon +
      '&current=temperature_2m,apparent_temperature,precipitation,' +
      'wind_speed_10m,wind_direction_10m' +
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
        self.el.innerHTML = '<div class="temp">--</div>' +
          '<div class="wline">MÉTÉO INDISPONIBLE<br>Vérifier la connexion.</div>';
      });
  },
  paint: function(j){
    var c = j.current || {};
    var d = j.daily || {};
    var temp = (c.temperature_2m !== undefined) ? Math.round(c.temperature_2m) : '--';
    var feel = (c.apparent_temperature !== undefined) ? Math.round(c.apparent_temperature) : '--';
    var wind = (c.wind_speed_10m !== undefined) ? Math.round(c.wind_speed_10m) : '--';
    var dir = this.cardinal(c.wind_direction_10m);
    var rain = (d.precipitation_probability_max && d.precipitation_probability_max[0] !== undefined)
      ? d.precipitation_probability_max[0] : '--';
    var max = (d.temperature_2m_max && d.temperature_2m_max[0] !== undefined)
      ? Math.round(d.temperature_2m_max[0]) : '--';
    var min = (d.temperature_2m_min && d.temperature_2m_min[0] !== undefined)
      ? Math.round(d.temperature_2m_min[0]) : '--';
    this.el.innerHTML =
      '<div class="temp">' + temp + '&deg;</div>' +
      '<div class="wline">RESSSENTI ' + feel + '&deg;<br>' +
      'VENT ' + dir + ' ' + wind + ' KM/H<br>' +
      'PLUIE ' + rain + ' %<br>' +
      'MAX ' + max + '&deg; / MIN ' + min + '&deg;</div>';
  },
  cardinal: function(deg){
    if (deg === undefined || deg === null){ return '--'; }
    var dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return dirs[Math.round(deg / 22.5) % 16];
  }
});
