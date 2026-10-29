/* Widget LNK-05 — accès rapides, stockés et modifiables localement */
YCOS.register('links', {
  render: function(el){
    var self = this;
    if (YStore.get('links', null) === null){
      YStore.set('links', [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'CERT-FR', url: 'https://www.cert.ssi.gouv.fr/' },
        { label: 'Hacker News', url: 'https://news.ycombinator.com/' },
        { label: 'Mail', url: 'https://mail.google.com/' },
        { label: 'Notion', url: 'https://www.notion.so/' },
        { label: 'Météo', url: 'https://open-meteo.com/' }
      ]);
    }
    el.innerHTML = '<div class="link-grid"></div>' +
      '<form class="task-form">' +
        '<input type="text" id="link-label" maxlength="30" placeholder="Nom">' +
        '<input type="text" id="link-url" maxlength="200" placeholder="https://...">' +
        '<button type="submit">+</button>' +
      '</form>';
    this.gridEl = el.querySelector('.link-grid');
    var form = el.querySelector('.task-form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var label = form.querySelector('#link-label').value.trim();
      var url = form.querySelector('#link-url').value.trim();
      if (!label || !url){ return; }
      if (!/^https?:\/\//i.test(url)){ url = 'https://' + url; }
      var links = YStore.get('links', []);
      links.push({ label: label, url: url });
      YStore.set('links', links);
      form.querySelector('#link-label').value = '';
      form.querySelector('#link-url').value = '';
      self.paint();
    });
    this.paint();
  },
  paint: function(){
    var self = this;
    var links = YStore.get('links', []);
    var html = '';
    links.forEach(function(l, i){
      html += '<span class="link-item"><a href="' + YCOS.esc(l.url) +
        '" target="_blank" rel="noopener noreferrer">' + YCOS.esc(l.label) +
        '</a><span class="link-del" data-del="' + i + '">x</span></span>';
    });
    this.gridEl.innerHTML = html;
    this.gridEl.querySelectorAll('.link-del').forEach(function(d){
      d.addEventListener('click', function(){
        var i = parseInt(d.getAttribute('data-del'), 10);
        var links = YStore.get('links', []);
        links.splice(i, 1);
        YStore.set('links', links);
        self.paint();
      });
    });
  }
});
