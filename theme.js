/* Mockup-only theme picker. Not part of the final site. */
(function () {
  var KEY = 'sd-theme';
  var FIELDS = [
    ['--red', 'Accent (header, tags)'],
    ['--ink', 'Dark bars (ticker, box titles, footer)'],
    ['--bg', 'Page background'],
    ['--card', 'Card background'],
    ['--text', 'Text'],
    ['--paper', 'Article paper'],
    ['--paper-ink', 'Article text']
  ];
  var FONTS = {
    'Clean (system)': ['system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'],
    'Condensed headlines': ['system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', '"Arial Narrow","Roboto Condensed","Segoe UI",sans-serif'],
    'Serif headlines': ['system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', 'Georgia,"Times New Roman",serif'],
    'Classic (all serif)': ['Georgia,"Times New Roman",serif', 'Georgia,"Times New Roman",serif']
  };
  var PRESETS = {
    'Your pick (orange & navy)': {'--red': '#f83c0d', '--ink': '#363696', '--bg': '#f3f3f5', '--card': '#ffffff', '--text': '#16161a'},
    'Your pick (gold)': {'--red': '#c3c610', '--ink': '#0d0d10', '--bg': '#f3f3f5', '--card': '#ffffff', '--text': '#16161a'},
    'Broadcast Red': {'--red': '#c8102e', '--red-dk': '#9a0c23', '--ink': '#0d0d10', '--bg': '#f3f3f5', '--card': '#ffffff', '--text': '#16161a'},
    'Navy & Gold': {'--red': '#0b2a5b', '--red-dk': '#c99700', '--ink': '#0a1426', '--bg': '#f2f4f8', '--card': '#ffffff', '--text': '#141821'},
    'Forest & Cream': {'--red': '#1f5a3a', '--red-dk': '#16422a', '--ink': '#13201a', '--bg': '#f5f1e6', '--card': '#fffdf7', '--text': '#1b1d1a'},
    'Purple & Gold': {'--red': '#4b2a86', '--red-dk': '#d4a017', '--ink': '#1a1230', '--bg': '#f4f2f8', '--card': '#ffffff', '--text': '#18151f'},
    'Orange & Charcoal': {'--red': '#e35205', '--red-dk': '#b44103', '--ink': '#202326', '--bg': '#f4f4f3', '--card': '#ffffff', '--text': '#191a1c'},
    'Night Game (dark)': {'--red': '#e0243f', '--red-dk': '#a3172c', '--ink': '#050507', '--bg': '#15161b', '--card': '#1f2027', '--text': '#ecedf1', '--paper': '#1c1b18', '--paper-ink': '#ece6d8'}
  };
  var root = document.documentElement;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  function save(t) { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} }
  function current() {
    var cs = getComputedStyle(root), t = {};
    FIELDS.forEach(function (f) { t[f[0]] = cs.getPropertyValue(f[0]).trim(); });
    t.font = root.dataset.font || 'Clean (system)';
    return t;
  }
  function apply(t) {
    FIELDS.forEach(function (f) { if (t[f[0]]) root.style.setProperty(f[0], t[f[0]]); });
    var dark = t['--bg'] && lum(t['--bg']) < 0.35;
    var a = t['--red'];
    if (a) {
      var lightAccent = lum(a) > 0.55;
      root.style.setProperty('--on-accent', lightAccent ? '#0d0d10' : '#ffffff');
      root.style.setProperty('--accent-text', dark ? a : lightAccent ? darken(a, 0.45) : lum(a) > 0.35 ? darken(a, 0.18) : a);
    }
    if (t['--ink'] && /^#[0-9a-f]{6}$/i.test(t['--ink'])) root.style.setProperty('--ink-2', darken(t['--ink'], 0.28));
    root.style.setProperty('--line', dark ? '#30313a' : '#e6e6ea');
    root.style.setProperty('--muted', dark ? '#a7a9b4' : '#5d5d68');
    var fp = FONTS[t.font] || FONTS['Clean (system)'];
    root.style.setProperty('--font', fp[0]); root.style.setProperty('--hfont', fp[1]);
    root.dataset.font = t.font || 'Clean (system)';
  }
  function darken(hex, k) {
    var n = parseInt(hex.replace('#', ''), 16), r = (n >> 16) * (1 - k), g = (n >> 8 & 255) * (1 - k), b = (n & 255) * (1 - k);
    return '#' + [r, g, b].map(function (x) { return ('0' + Math.round(x).toString(16)).slice(-2); }).join('');
  }
  function lum(hex) {
    var s = hex.trim(); if (/^#?[0-9a-f]{3}$/i.test(s)) s = s.replace(/^#?(.)(.)(.)$/, '#$1$1$2$2$3$3');
    var m = /^#?([0-9a-f]{6})$/i.exec(s); if (!m) return 1;
    var n = parseInt(m[1], 16); return (0.299 * (n >> 16) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
  }
  var saved = load(); if (saved) apply(saved);

  var css = document.createElement('style');
  css.textContent =
    '#tp-btn{position:fixed;right:16px;bottom:16px;z-index:999;background:#111;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:700 13px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer}' +
    '#tp{position:fixed;right:16px;bottom:70px;z-index:999;width:300px;max-width:calc(100vw - 32px);max-height:calc(100vh - 100px);overflow:auto;background:#fff;color:#111;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);padding:14px;font:13px system-ui;display:none}' +
    '#tp.open{display:block}#tp h4{font:800 12px system-ui;letter-spacing:.08em;margin:10px 0 6px;color:#555}' +
    '#tp .presets{display:flex;flex-wrap:wrap;gap:6px}#tp .presets button{border:1px solid #ccc;background:#f6f6f6;border-radius:999px;padding:5px 10px;font:12px system-ui;cursor:pointer}' +
    '#tp label{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0}#tp input[type=color]{width:44px;height:28px;border:1px solid #ccc;border-radius:4px;padding:0;background:none}' +
    '#tp select{width:100%;padding:6px;font:13px system-ui}#tp textarea{width:100%;height:84px;font:11px monospace;margin-top:6px}' +
    '#tp .row{display:flex;gap:6px;margin-top:8px}#tp .row button{flex:1;border:0;border-radius:6px;padding:8px;font:700 12px system-ui;cursor:pointer;background:#111;color:#fff}#tp .row button.alt{background:#e6e6ea;color:#111}';
  document.head.appendChild(css);

  var btn = document.createElement('button'); btn.id = 'tp-btn'; btn.textContent = '🎨 Colors';
  var p = document.createElement('div'); p.id = 'tp';
  var html = '<h4>PRESETS</h4><div class="presets">';
  Object.keys(PRESETS).forEach(function (k) { html += '<button data-p="' + k + '">' + k + '</button>'; });
  html += '</div><h4>COLORS</h4>';
  FIELDS.forEach(function (f) { html += '<label>' + f[1] + '<input type="color" data-v="' + f[0] + '"></label>'; });
  html += '<h4>FONTS</h4><select id="tp-font">';
  Object.keys(FONTS).forEach(function (k) { html += '<option>' + k + '</option>'; });
  html += '</select><h4>YOUR SETTINGS (send these to Claude)</h4><textarea id="tp-out" readonly></textarea>' +
    '<div class="row"><button id="tp-copy">Copy</button><button class="alt" id="tp-reset">Reset</button></div>';
  p.innerHTML = html;
  document.body.appendChild(p); document.body.appendChild(btn);

  function refresh() {
    var t = current();
    p.querySelectorAll('input[data-v]').forEach(function (i) { var v = t[i.dataset.v]; if (/^#[0-9a-f]{6}$/i.test(v)) i.value = v; });
    p.querySelector('#tp-font').value = t.font;
    p.querySelector('#tp-out').value = JSON.stringify(t);
  }
  function set(t) { apply(t); save(current()); refresh(); }
  btn.onclick = function () { p.classList.toggle('open'); refresh(); };
  p.querySelectorAll('.presets button').forEach(function (b) {
    b.onclick = function () {
      var t = Object.assign({'--paper': '#f7f3ea', '--paper-ink': '#1b1a17'}, PRESETS[b.dataset.p]);
      t.font = root.dataset.font; set(t);
    };
  });
  p.querySelectorAll('input[data-v]').forEach(function (i) {
    i.oninput = function () { var t = current(); t[i.dataset.v] = i.value; set(t); };
  });
  p.querySelector('#tp-font').onchange = function (e) { var t = current(); t.font = e.target.value; set(t); };
  p.querySelector('#tp-copy').onclick = function () {
    var ta = p.querySelector('#tp-out'); ta.select();
    try { navigator.clipboard.writeText(ta.value); } catch (e) { try { document.execCommand('copy'); } catch (e2) {} }
    this.textContent = 'Copied ✓'; var b = this; setTimeout(function () { b.textContent = 'Copy'; }, 1500);
  };
  p.querySelector('#tp-reset').onclick = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    root.removeAttribute('style'); root.dataset.font = 'Clean (system)'; refresh();
  };
})();
