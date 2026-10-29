/* YStore — stockage local prefixe, silencieux en cas d'echec */
var YStore = {
  prefix: 'ycos.',
  get: function(key, fallback){
    try{
      var raw = localStorage.getItem(this.prefix + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    }catch(e){ return fallback; }
  },
  set: function(key, value){
    try{ localStorage.setItem(this.prefix + key, JSON.stringify(value)); }
    catch(e){}
  },
  remove: function(key){
    try{ localStorage.removeItem(this.prefix + key); }
    catch(e){}
  }
};
