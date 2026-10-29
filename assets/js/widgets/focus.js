/* Widget FOC-04 — minuteur de concentration 25/5, cycles comptés par jour */
YCOS.register('focus', {
  render: function(el){
    var self = this;
    this.el = el;
    this.state = {
      mode: 'FOCUS',
      remaining: YCOS_CONFIG.focus.minutes * 60,
      running: false
    };
    var dayKey = 'focus-' + new Date().toISOString().slice(0, 10);
    this.cycles = YStore.get(dayKey, 0);
    el.innerHTML =
      '<div class="ftimer">' + this.fmt(this.state.remaining) + '</div>' +
      '<div class="wline" id="focus-mode">FOCUS — ' + YCOS_CONFIG.focus.minutes + ' MIN</div>' +
      '<div class="focus-actions">' +
        '<button class="fbtn" id="focus-start">DÉMARRER</button>' +
        '<button class="fbtn" id="focus-reset">RÉINIT</button>' +
      '</div>' +
      '<p class="meta" id="focus-count"></p>';
    this.timerEl = el.querySelector('.ftimer');
    this.modeEl = el.querySelector('#focus-mode');
    this.countEl = el.querySelector('#focus-count');
    this.startBtn = el.querySelector('#focus-start');
    this.paintCount();
    this.startBtn.addEventListener('click', function(){
      if (self.state.running){
        self.pause();
      } else {
        self.start();
      }
    });
    el.querySelector('#focus-reset').addEventListener('click', function(){
      self.pause();
      self.state.mode = 'FOCUS';
      self.state.remaining = YCOS_CONFIG.focus.minutes * 60;
      self.paint();
    });
    this.paint();
  },
  start: function(){
    var self = this;
    this.state.running = true;
    this.startBtn.textContent = 'PAUSE';
    this.timer = setInterval(function(){ self.tick(); }, 1000);
  },
  pause: function(){
    this.state.running = false;
    this.startBtn.textContent = 'DÉMARRER';
    clearInterval(this.timer);
  },
  tick: function(){
    this.state.remaining--;
    if (this.state.remaining <= 0){
      this.switchMode();
    }
    this.paint();
  },
  switchMode: function(){
    var cfg = YCOS_CONFIG.focus;
    if (this.state.mode === 'FOCUS'){
      this.cycles++;
      var dayKey = 'focus-' + new Date().toISOString().slice(0, 10);
      YStore.set(dayKey, this.cycles);
      this.paintCount();
      this.state.mode = 'PAUSE';
      this.state.remaining = cfg.breakMinutes * 60;
    } else {
      this.state.mode = 'FOCUS';
      this.state.remaining = cfg.minutes * 60;
    }
  },
  fmt: function(sec){
    var m = ('0' + Math.floor(sec / 60)).slice(-2);
    var s = ('0' + (sec % 60)).slice(-2);
    return m + ':' + s;
  },
  paint: function(){
    this.timerEl.textContent = this.fmt(this.state.remaining);
    this.modeEl.textContent = this.state.mode + ' — ' +
      (this.state.mode === 'FOCUS'
        ? YCOS_CONFIG.focus.minutes : YCOS_CONFIG.focus.breakMinutes) + ' MIN';
  },
  paintCount: function(){
    this.countEl.textContent = 'CYCLES TERMINÉS AUJOURD\'HUI : ' + this.cycles;
    var st = document.getElementById('status-focus');
    if (st){ st.innerHTML = 'FOC <b>' + this.cycles + '</b>'; }
  }
});
