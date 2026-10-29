/* Widget EVT-06 — échéances à venir, compte à rebours en jours */
YCOS.register('events', {
  render: function(el){
    var self = this;
    if (YStore.get('events', null) === null){
      YStore.set('events', [
        { label: 'Fin de stage', date: '2026-12-18' },
        { label: 'Nouvel an', date: '2027-01-01' }
      ]);
    }
    el.innerHTML = '<div class="evt-list"></div>' +
      '<form class="task-form">' +
        '<input type="text" id="evt-label" maxlength="40" placeholder="Échéance">' +
        '<input type="date" id="evt-date">' +
        '<button type="submit">+</button>' +
      '</form>';
    this.listEl = el.querySelector('.evt-list');
    var form = el.querySelector('.task-form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var label = form.querySelector('#evt-label').value.trim();
      var date = form.querySelector('#evt-date').value;
      if (!label || !date){ return; }
      var events = YStore.get('events', []);
      events.push({ label: label, date: date });
      events.sort(function(a, b){ return a.date < b.date ? -1 : 1; });
      YStore.set('events', events);
      form.querySelector('#evt-label').value = '';
      form.querySelector('#evt-date').value = '';
      self.paint();
    });
    this.paint();
  },
  paint: function(){
    var self = this;
    var events = YStore.get('events', []);
    var html = '';
    events.forEach(function(ev, i){
      html += '<div class="evt" data-i="' + i + '">' +
        '<span>' + YCOS.esc(ev.label) + '</span>' +
        '<span class="days">' + self.daysTo(ev.date) + '</span>' +
        '<span class="edel" data-del="' + i + '">x</span></div>';
    });
    this.listEl.innerHTML = html ||
      '<div class="evt"><span>Aucune échéance enregistrée.</span></div>';
    this.listEl.querySelectorAll('.edel').forEach(function(d){
      d.addEventListener('click', function(){
        var i = parseInt(d.getAttribute('data-del'), 10);
        var events = YStore.get('events', []);
        events.splice(i, 1);
        YStore.set('events', events);
        self.paint();
      });
    });
  },
  daysTo: function(dateStr){
    var d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())){ return '—'; }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var n = Math.round((d - today) / 86400000);
    if (n > 0){ return 'J-' + n; }
    if (n === 0){ return 'JOUR J'; }
    return 'J+' + (-n);
  }
});
