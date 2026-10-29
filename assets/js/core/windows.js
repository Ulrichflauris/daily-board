/* YWindows — activation, deplacement, persistance des positions */
var YWindows = {
  init: function(){
    var self = this;
    if (!YCOS_CONFIG.windows.persist){ return; }
    var wins = document.querySelectorAll('.win');
    var positions = YStore.get('win-positions', {});
    wins.forEach(function(w){
      var id = w.getAttribute('data-widget') || 'win';
      var saved = positions[id];
      if (saved){ w.style.left = saved.x + 'px'; w.style.top = saved.y + 'px'; }
      w.addEventListener('mousedown', function(){
        wins.forEach(function(o){ o.classList.remove('active'); });
        w.classList.add('active');
      });
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
  },
  save: function(w, id){
    var positions = YStore.get('win-positions', {});
    positions[id] = { x: w.offsetLeft, y: w.offsetTop };
    YStore.set('win-positions', positions);
  }
};
