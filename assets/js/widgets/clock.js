/* Widget CLK-00 — horloge temps reel, date, compteur de jour */
YCOS.register('clock', {
  render: function(el){
    var hour = new Date().getHours();
    var greet = (hour >= 18 || hour < 5) ? 'BONSOIR' : 'BONJOUR';
    el.innerHTML =
      '<p class="greet">' + greet + ' ' + YCOS.esc(YCOS_CONFIG.user.name) +
      '<span class="cursor"></span></p>' +
      '<div class="time">--:--</div>' +
      '<div class="date"></div>' +
      '<p class="meta"></p>';
    this.timeEl = el.querySelector('.time');
    this.dateEl = el.querySelector('.date');
    this.metaEl = el.querySelector('.meta');
    this.menubarEl = document.getElementById('menubar-clock');
    this.sessionEl = document.getElementById('status-session');
    var self = this;
    this.tick();
    setInterval(function(){ self.tick(); }, 1000);
  },
  tick: function(){
    var now = new Date();
    var hh = ('0' + now.getHours()).slice(-2);
    var mm = ('0' + now.getMinutes()).slice(-2);
    var ss = ('0' + now.getSeconds()).slice(-2);
    var jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
    var mois = ['janvier','février','mars','avril','mai','juin',
                'juillet','août','septembre','octobre','novembre','décembre'];
    var j = jours[now.getDay()];
    j = j.charAt(0).toUpperCase() + j.slice(1);
    this.timeEl.textContent = hh + ':' + mm;
    this.dateEl.textContent = j + ' ' + now.getDate() + ' ' + mois[now.getMonth()];
    var start = new Date(now.getFullYear(), 0, 1);
    var day = Math.floor((now - start) / 86400000) + 1;
    var y = now.getFullYear();
    var total = ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
    this.metaEl.textContent = 'JOUR ' + day + ' / ' + total +
      ' — SYSTÈME OPÉRATIONNEL';
    if (this.menubarEl){
      this.menubarEl.textContent = j.slice(0,3).toLowerCase() + '. ' +
        now.getDate() + ' ' + mois[now.getMonth()].slice(0,3) + '. — ' +
        hh + ':' + mm + ':' + ss;
    }
    if (this.sessionEl){
      this.sessionEl.textContent = 'SESSION ' + hh + ':' + mm + ' CET';
    }
  }
});
