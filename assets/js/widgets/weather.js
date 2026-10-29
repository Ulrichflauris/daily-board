/* Widget WTHR-02 — météo Open-Meteo, sans clé, avec cache local */
YCOS.register('weather', {
  render: function(el){
    var self = this;
    this.el = el;
    if (!YCOS_CONFIG.weather.enabled){
      el.innerHTML = '<div class="temp">--</div>' +
        '<div class="wline">MODULE DÉSACTIVÉ</div>';
      return;
    }
    var cache = YStore.get('weather-cache', null);
    var ttl = YCOS_CONFIG.weather.cacheMinutes * 60000;
    if (cache && (Date.now() - cache.at) < ttl){
      this.paint(cache.data);
      return;
    }
    el.innerHTML = '<div class="temp">..</div>' +
      '<div class="wline">INTERROGATION OPEN-METEO...</div>';
    var u = YCOS_CONFIG.user;
    var url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=' + u.lat + '&longitude=' + u.lon +
      '&current=temperature_2m,apparent_temperature,precipitation,' +
      'wind_speed_10m,wind_direction_10m' +
      '&daily=temperature_2m_max,temperature_2m_min,' +
      'precipitation_probability_max' +
      '&timezone=Europe%2FParis&forecast_days=1';
    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(j){
        YStore.set('weather-cache', { at: Date.now(), data: j });
        self.paint(j);
      })
      .catch(function(){
        el.innerHTML = '<div class="temp">--</div>' +
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
