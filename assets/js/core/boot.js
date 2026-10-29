/* YCOS — noyau : registre des widgets et sequence de demarrage */
var YCOS = {
  widgets: {},
  esc: function(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {
        '&': '&' + 'amp;',
        '<': '&' + 'lt;',
        '>': '&' + 'gt;',
        '"': '&' + 'quot;',
        "'": '&' + '#39;'
      }[c];
    });
  },
  register: function(id, module){
    this.widgets[id] = module;
  },
  init: function(){
    var nodes = document.querySelectorAll('.win');
    nodes.forEach(function(w){
      var id = w.getAttribute('data-widget');
      var mod = YCOS.widgets[id];
      if (mod && typeof mod.render === 'function'){
        mod.render(w.querySelector('.content'));
      }
    });
    if (typeof YWindows !== 'undefined'){
      YWindows.init();
    }
  }
};
document.addEventListener('DOMContentLoaded', function(){
  YCOS.init();
});
