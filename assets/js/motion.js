/* ATELIER motion — physical, interruptible interactions for AI4Good.
   Built on Apple's fluid-interface principles: respond instantly, track 1:1,
   hand off to a spring on release, stay interruptible. Vanilla JS, no deps.
   Progressive enhancement — without JS everything is visible & usable. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---- tiny critically-damped spring (interruptible, velocity-aware) ---- */
  function Spring(value, opts) {
    opts = opts || {};
    this.k = opts.stiffness || 170;      // response
    this.d = opts.damping   || 26;       // ~critical for this k
    this.v = 0;
    this.x = value || 0;
    this.target = value || 0;
    this.onUpdate = opts.onUpdate || function () {};
    this.running = false;
    this.last = 0;
  }
  Spring.prototype.set = function (t) { this.target = t; if (!this.running) this._start(); };
  Spring.prototype.jump = function (x) { this.x = this.target = x; this.v = 0; this.onUpdate(this.x); };
  Spring.prototype._start = function () {
    this.running = true; this.last = performance.now();
    var self = this;
    raf(function loop(now) {
      var dt = Math.min((now - self.last) / 1000, 0.032); self.last = now;
      // semi-implicit Euler
      var f = -self.k * (self.x - self.target) - self.d * self.v;
      self.v += f * dt; self.x += self.v * dt;
      self.onUpdate(self.x);
      if (Math.abs(self.v) < 0.02 && Math.abs(self.x - self.target) < 0.02) {
        self.x = self.target; self.v = 0; self.onUpdate(self.x); self.running = false; return;
      }
      raf(loop);
    });
  };

  /* ---- scroll-progress + glass header scroll-edge ---- */
  var bar = document.querySelector('.scroll-progress');
  var header = document.querySelector('.site-header');
  function onScroll() {
    var h = document.documentElement;
    var y = h.scrollTop || document.body.scrollTop;
    if (bar && !reduce) {
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0).toFixed(2) + '%';
    }
    if (header) header.classList.toggle('is-scrolled', y > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- scroll reveals with a spring settle (not a canned CSS curve) ---- */
  if (!reduce) {
    var sel = ['.hero > *', '.section-title', '.intro', '.post-grid > .card',
      '.post-header', '.post-lede', '.content > h2', '.content > figure',
      '.post-footer', '.page-head'];
    var els = [].slice.call(document.querySelectorAll(sel.join(',')));
    els.forEach(function (el) { el.classList.add('reveal'); });

    var reveal = function (el, delay) {
      var s = new Spring(0, {
        stiffness: 150, damping: 20,
        onUpdate: function (p) {
          el.style.opacity = p;
          el.style.transform = 'translateY(' + ((1 - p) * 20).toFixed(2) + 'px)';
        }
      });
      setTimeout(function () { el.classList.add('is-in'); s.set(1); }, delay);
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var group = e.target.parentNode &&
            e.target.parentNode.classList.contains('post-grid');
          var idx = group ? [].indexOf.call(e.target.parentNode.children, e.target) : 0;
          reveal(e.target, Math.min(idx, 8) * 55);
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('is-in'); el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }

  /* ---- card: 1:1 pointer tilt while hovering, spring back on leave ---- */
  if (fine && !reduce) {
    [].forEach.call(document.querySelectorAll('.post-grid > .card'), function (card) {
      var glare = document.createElement('span');
      glare.className = 'card-glare'; glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
      var MAX = 5, hovering = false;
      var rx = new Spring(0, { stiffness: 220, damping: 22, onUpdate: apply });
      var ry = new Spring(0, { stiffness: 220, damping: 22, onUpdate: apply });
      var lift = new Spring(0, { stiffness: 220, damping: 24, onUpdate: apply });
      function apply() {
        card.style.transform =
          'perspective(1200px) rotateX(' + rx.x.toFixed(3) + 'deg) rotateY(' + ry.x.toFixed(3) +
          'deg) translateZ(0) translateY(' + (lift.x * -6).toFixed(2) + 'px)';
      }
      card.addEventListener('pointerenter', function () { hovering = true; lift.set(1); });
      card.addEventListener('pointermove', function (e) {
        if (!hovering) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;
        // direct 1:1 tracking (no spring lag while the finger is down/over)
        ry.jump((px - 0.5) * 2 * MAX);
        rx.jump((0.5 - py) * 2 * MAX);
        glare.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        glare.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        hovering = false; rx.set(0); ry.set(0); lift.set(0);   // spring home
      });
    });
  }

  /* ---- magnetic buttons: follow the pointer a touch, spring home ---- */
  if (fine && !reduce) {
    [].forEach.call(document.querySelectorAll('.btn'), function (btn) {
      var PULL = 6;
      var tx = new Spring(0, { stiffness: 300, damping: 20, onUpdate: apply });
      var ty = new Spring(0, { stiffness: 300, damping: 20, onUpdate: apply });
      function apply() { btn.style.transform = 'translate(' + tx.x.toFixed(2) + 'px,' + ty.x.toFixed(2) + 'px)'; }
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        tx.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * PULL);
        ty.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * PULL);
      });
      btn.addEventListener('pointerleave', function () { tx.set(0); ty.set(0); });
    });
  }
})();
