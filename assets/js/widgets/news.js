/* Widget INTL-03 — dépêches réelles Hacker News (API Firebase officielle),
   échantillon de secours si le flux échoue */
YCOS.register('news', {
  render: function(el){
    var self = this;
    this.el = el;
    var cfg = YCOS_CONFIG.news;
    if (!cfg.enabled){
      this.paint(this.sample(), true);
      return;
    }
    var cache = YStore.get('news-cache', null);
    var ttl = cfg.cacheMinutes * 60000;
    if (cache && (Date.now() - cache.at) < ttl){
      this.paint(cache.items, false);
      return;
    }
    el.innerHTML = '<div class="wline">CHARGEMENT DES DÉPÊCHES — HACKER NEWS...</div>';
    var base = 'https://hacker-news.firebaseio.com/v0/';
    fetch(base + 'topstories.json')
      .then(function(r){ return r.json(); })
      .then(function(ids){
        var top = ids.slice(0, cfg.count);
        return Promise.all(top.map(function(id){
          return fetch(base + 'item/' + id + '.json')
            .then(function(r){ return r.json(); });
        }));
      })
      .then(function(items){
        var clean = [];
        items.forEach(function(it){
          if (it && it.title){
            clean.push({
              title: it.title,
              url: it.url || ('https://news.ycombinator.com/item?id=' + it.id),
              score: it.score || 0,
              src: self.domain(it.url || '')
            });
          }
        });
        YStore.set('news-cache', { at: Date.now(), items: clean });
        self.paint(clean, false);
      })
      .catch(function(){
        self.paint(self.sample(), true);
      });
  },
  domain: function(url){
    try{
      var h = new URL(url).hostname.replace(/^www\./, '');
      return h.toUpperCase().slice(0, 18);
    }catch(e){
      return 'HN';
    }
  },
  sample: function(){
    return [
      { title: "Faille critique corrigée dans les passerelles VPN d'entreprise", url: "https://www.cert.ssi.gouv.fr/", score: 0, src: "CERT-FR" },
      { title: "Le NIS2 entre en phase de contrôle dans cinq États membres", url: "", score: 0, src: "RÉGULATION" },
      { title: "Chaîne d'attaque identifiée sur des routeurs domestiques", url: "", score: 0, src: "RECHERCHE" },
      { title: "Rançongiciel remédié en 72 heures : le retour d'expérience", url: "", score: 0, src: "IR" }
    ];
  },
  paint: function(items, isSample){
    var html = '';
    items.slice(0, YCOS_CONFIG.news.count).forEach(function(n){
      var title = YCOS.esc(n.title);
      if (n.url){
        title = '<a href="' + YCOS.esc(n.url) +
          '" target="_blank" rel="noopener noreferrer">' + title + '</a>';
      }
      html += '<div class="dep">' + title +
        '<span class="src">' + YCOS.esc(n.src) +
        (n.score ? ' — ' + n.score + ' PTS' : '') + '</span></div>';
    });
    var now = new Date();
    var hh = ('0' + now.getHours()).slice(-2);
    var mm = ('0' + now.getMinutes()).slice(-2);
    html += '<div class="wline" style="margin-top:10px">' +
      (isSample
        ? 'FLUX HN INDISPONIBLE — ÉCHANTILLON DE SECOURS'
        : 'FLUX HACKER NEWS — MAJ ' + hh + ':' + mm) + '</div>';
    this.el.innerHTML = html;
  }
});
