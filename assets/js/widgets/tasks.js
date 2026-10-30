/* Widget TSK-01 — pense-bête local, suivi d'ancienneté (Supabase au Sprint 3) */
YCOS.register('tasks', {
  render: function(el){
    var self = this;
    if (YStore.get('tasks', null) === null){
      YStore.set('tasks', [
        { id: 1, text: "Valider l'inventaire serveurs du site", done: false, created: Date.now() - 5 * 86400000 },
        { id: 2, text: "Corriger le rapport d'audit, section AD", done: false, created: Date.now() },
        { id: 3, text: "Relire la note de synthèse NIS2", done: true, created: Date.now() - 86400000 }
      ]);
    }
    el.innerHTML =
      '<ul class="tasks-list"></ul>' +
      '<form class="task-form">' +
        '<input type="text" maxlength="120" placeholder="Nouvelle tâche — Entrée pour valider">' +
        '<button type="submit">+</button>' +
      '</form>';
    this.listEl = el.querySelector('.tasks-list');
    var form = el.querySelector('.task-form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('input');
      var value = input.value.trim();
      if (!value){ return; }
      var tasks = YStore.get('tasks', []);
      tasks.push({ id: Date.now(), text: value, done: false, created: Date.now() });
      YStore.set('tasks', tasks);
      input.value = '';
      self.paint();
    });
    this.paint();
  },
  paint: function(){
    var self = this;
    var tasks = YStore.get('tasks', []);
    var stale = YCOS_CONFIG.tasks.staleDays;
    var html = '';
    tasks.forEach(function(t, i){
      var age = '';
      if (t.created && !t.done){
        var days = Math.floor((Date.now() - t.created) / 86400000);
        if (days >= stale){
          age = '<span class="warn">' + days + 'J</span>';
        }
      }
      html += '<li data-i="' + i + '"' + (t.done ? ' class="done"' : '') + '>' +
        '<span class="box">' + (t.done ? '[x]' : '[&nbsp;&nbsp;]') + '</span>' +
        '<span class="text">' + YCOS.esc(t.text) + '</span>' + age +
        '<span class="del" data-del="' + i + '">x</span></li>';
    });
    this.listEl.innerHTML = html ||
      '<li class="done"><span class="box">[&nbsp;&nbsp;]</span>Rien à faire. Profitez.</li>';
    var active = tasks.filter(function(t){ return !t.done; }).length;
    var old = tasks.filter(function(t){
      return !t.done && t.created &&
        Math.floor((Date.now() - t.created) / 86400000) >= stale;
    }).length;
    var status = document.getElementById('status-tasks');
    if (status){
      status.innerHTML = 'TSK <b>' + active + '</b> ACTIVES' +
        (old ? ' / <b>' + old + '</b> ANCIENNES' : '');
    }
    this.listEl.querySelectorAll('li').forEach(function(li){
      li.addEventListener('click', function(e){
        var i = parseInt(li.getAttribute('data-i'), 10);
        if (isNaN(i)){ return; }
        var tasks = YStore.get('tasks', []);
        if (e.target.classList.contains('del')){
          tasks.splice(i, 1);
        } else {
          tasks[i].done = !tasks[i].done;
        }
        YStore.set('tasks', tasks);
        self.paint();
      });
    });
  }
});
