/* NEBULA scene — a data-driven 3D parallax of the apps' own media.
   Reads window.AI4GOOD_MEDIA (emitted from site.posts) and scatters each
   app's hero screenshot — or gameplay video (post.bg_video) — as a plane
   floating at depth over the cosmic backdrop. Scroll flies the camera
   through the field; the pointer adds a subtle parallax. Every future post
   with an `image:` auto-appears. Vanilla + Three.js (global build), no bundler.
   Respects prefers-reduced-motion (renders a single static frame). */
(function () {
  'use strict';

  var canvas = document.getElementById('bg-scene');
  if (!canvas || typeof THREE === 'undefined') return;

  var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mqReduce && mqReduce.matches;
  var mqTransp = window.matchMedia && window.matchMedia('(prefers-reduced-transparency: reduce)');
  if (mqTransp && mqTransp.matches) { canvas.style.display = 'none'; return; }

  /* de-dupe media by image, keep large app screenshots, cap the field */
  var raw = window.AI4GOOD_MEDIA || [];
  var seen = {}, media = [];
  for (var i = 0; i < raw.length; i++) {
    var m = raw[i];
    if (!m || !m.img || seen[m.img]) continue;
    seen[m.img] = 1; media.push(m);
  }
  if (media.length === 0) return;
  media = media.slice(0, 16);

  var W = window.innerWidth, H = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090e, 0.055);

  var camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100);
  camera.position.set(0, 0, 7);

  var loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  var planes = [];
  var SPACING = 6.2;                                  // vertical gap between rows
  var fieldSpan = (media.length - 1) * SPACING;       // total scrollable depth of the field

  media.forEach(function (m, idx) {
    var side = idx % 2 === 0 ? -1 : 1;                // alternate sides, keep centre readable
    var group = new THREE.Group();
    // horizontal offset pushes planes away from the central reading column
    group.position.x = side * (2.4 + Math.random() * 2.6);
    group.position.y = -idx * SPACING + (Math.random() - 0.5) * 2.2;
    group.position.z = -2.5 - Math.random() * 6.5;    // varied depth
    group.rotation.z = (Math.random() - 0.5) * 0.14;
    group.rotation.y = -side * (0.12 + Math.random() * 0.16);

    var geo = new THREE.PlaneGeometry(1, 1);
    var mat = new THREE.MeshBasicMaterial({
      color: 0x8fa4cc, transparent: true, opacity: 0.0, depthWrite: false
    });
    var mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    scene.add(group);

    var rec = {
      group: group, mesh: mesh, mat: mat,
      baseY: group.position.y, baseX: group.position.x,
      phase: Math.random() * Math.PI * 2,
      floatAmp: 0.18 + Math.random() * 0.22,
      spin: (Math.random() - 0.5) * 0.06,
      targetOpacity: 0.0
    };
    planes.push(rec);

    var apply = function (tex) {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      var iw = (tex.image && (tex.image.videoWidth || tex.image.width)) || 16;
      var ih = (tex.image && (tex.image.videoHeight || tex.image.height)) || 10;
      var aspect = iw / ih || 1.6;
      var w = 3.4, h = w / aspect;
      mesh.scale.set(w, h, 1);
      mat.map = tex; mat.color.set(0xffffff);
      mat.needsUpdate = true;
      rec.targetOpacity = 0.82;
      if (reduce) mat.opacity = rec.targetOpacity;   // no fade-in under reduced motion
    };

    if (m.video) {
      var vid = document.createElement('video');
      vid.src = m.video; vid.loop = true; vid.muted = true; vid.playsInline = true;
      vid.setAttribute('playsinline', ''); vid.crossOrigin = 'anonymous';
      vid.addEventListener('loadeddata', function () {
        var vtex = new THREE.VideoTexture(vid); apply(vtex);
        if (!reduce) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
      });
      vid.load();
    } else {
      loader.load(m.img, apply, undefined, function () {/* skip failed image */});
    }
  });

  /* ---- scroll + pointer parallax targets ---- */
  var scrollProg = 0, targetScroll = 0;
  var pointerX = 0, pointerY = 0, targetPX = 0, targetPY = 0;

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    targetScroll = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!reduce) {
    window.addEventListener('pointermove', function (e) {
      targetPX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running && !reduce) raf(loop);
  });

  var raf = window.requestAnimationFrame.bind(window);
  var start = performance.now();

  function render(t) {
    // ease scroll + pointer toward targets
    scrollProg += (targetScroll - scrollProg) * 0.08;
    pointerX += (targetPX - pointerX) * 0.05;
    pointerY += (targetPY - pointerY) * 0.05;

    // fly the camera down through the field as the page scrolls
    camera.position.y = -scrollProg * fieldSpan;
    camera.position.x = pointerX * 0.9;
    camera.rotation.x = -pointerY * 0.04;
    camera.rotation.y = pointerX * 0.04;

    for (var i = 0; i < planes.length; i++) {
      var p = planes[i];
      if (!reduce) {
        p.group.position.y = p.baseY + Math.sin(t * 0.0004 + p.phase) * p.floatAmp;
        p.group.position.x = p.baseX + Math.cos(t * 0.0003 + p.phase) * 0.18;
        p.group.rotation.z += p.spin * 0.0016;
      }
      // fade planes in as their textures arrive
      if (p.mat.opacity < p.targetOpacity) {
        p.mat.opacity = Math.min(p.targetOpacity, p.mat.opacity + 0.02);
      }
    }
    renderer.render(scene, camera);
  }

  function loop(now) {
    if (!running) return;
    render(now - start);
    raf(loop);
  }

  if (reduce) {
    // static: settle scroll/pointer to targets, render a handful of frames as textures load
    scrollProg = targetScroll;
    var frames = 0;
    (function warm() {
      render(0);
      if (frames++ < 60) setTimeout(warm, 60);
    })();
  } else {
    raf(loop);
  }
})();
