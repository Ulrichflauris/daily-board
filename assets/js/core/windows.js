/* YWindows — activation, deplacement, fermeture, menu, persistance */
var YWindows = {
  init: function(){
    var self = this;
    var wins = document.querySelectorAll('.win');
    var positions = YStore.get('win-positions', {});
    var hidden = YStore.get('win-hidden', []);
    wins.forEach(function(w){
      var id = w.getAttribute('data-widget') || 'win';
      if (hidden.indexOf(id) !== -1){ w.style.display = 'none'; }
      var saved = positions[id];
      if (saved){ w.style.left = saved.x + 'px'; w.style.top = saved.y + 'px'; }
      w.addEventListener('mousedown', function(){
        wins.forEach(function(o){ o.classList.remove('active'); });
        w.classList.add('active');
      });
      var closeBtn = w.querySelector('.dots span:last-child');
      if (closeBtn){
        closeBtn.addEventListener('click', function(e){
          e.stopPropagation();
          self.hide(id);
        });
      }
      w.querySelector('.title').addEventListener('mousedown', function(e){
        var sx = e.clientX - w.offsetLeft;
        var sy = e.clientY - w.offsetTop;
        function move(ev){
          w.style.left = (ev.clientX - sx) + 'px';
          w.style.top = (ev.clientY - sy) + 'px';
        }
        function up(){
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
          self.save(w, id);
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
        e.preventDefault();
      });
    });
    this.wireMenu();
    this.buildMenu();
  },
  hide: function(id){
    var w = document.querySelector('.win[data-widget="' + id + '"]');
    if (w){ w.style.display = 'none'; }
    var hidden = YStore.get('win-hidden', []);
    if (hidden.indexOf(id) === -1){ hidden.push(id); }
    YStore.set('win-hidden', hidden);
    this.buildMenu();
  },
  show: function(id){
    var w = document.querySelector('.win[data-widget="' + id + '"]');
    if (w){ w.style.display = ''; }
    var hidden = YStore.get('win-hidden', []);
    var i = hidden.indexOf(id);
    if (i !== -1){ hidden.splice(i, 1); }
    YStore.set('win-hidden', hidden);
    this.buildMenu();
  },
  wireMenu: function(){
    var self = this;
    var toggle = document.getElementById('menu-windows-toggle');
    var drop = document.getElementById('window-menu');
    if (!toggle || !drop){ return; }
    toggle.addEventListener('click', function(e){
      drop.style.display = (drop.style.display === 'block') ? 'none' : 'block';
      e.stopPropagation();
    });
    document.addEventListener('click', function(){
      drop.style.display = 'none';
    });
  },
  buildMenu: function(){
    var drop = document.getElementById('window-menu');
    if (!drop){ return; }
    var hidden = YStore.get('win-hidden', []);
    var html = '';
    document.querySelectorAll('.win').forEach(function(w){
      var id = w.getAttribute('data-widget');
      var name = w.getAttribute('data-name') || id;
      var on = hidden.indexOf(id) === -1;
      html += '<div class="menu-item" data-id="' + id + '">' +
        '<span class="box">[' + (on ? 'x' : '&nbsp;&nbsp;') + ']</span>' +
        name + '</div>';
    });
    drop.innerHTML = html;
    var self = this;
    drop.querySelectorAll('.menu-item').forEach(function(item){
      item.addEventListener('click', function(){
        var id = item.getAttribute('data-id');
        if (YStore.get('win-hidden', []).indexOf(id) === -1){
          self.hide(id);
        } else {
          self.show(id);
        }
      });
    });
  },
  save: function(w, id){
    var positions = YStore.get('win-positions', {});
    positions[id] = { x: w.offsetLeft, y: w.offsetTop };
    YStore.set('win-positions', positions);
  }
};
