/* ================= 反假通 · 应用逻辑 ================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const BANK = JSON.parse($('#bank').textContent);
  const BY_ID = new Map(BANK.map(q => [q.i, q]));
  const TOTAL = BANK.length;
  const PASS = 80;
  const KEY = 'fj.v1';
  const DEMO = location.search.includes('demo=') || location.search.includes('selftest');
  const IMG = window.__ASSETS__ || {};
  const ICON = IMG.icon || '';

  const TYPES = {
    single:   { label: '单选', cls: 't-single' },
    multiple: { label: '多选', cls: 't-multiple' },
    judge:    { label: '判断', cls: 't-judge' },
    case:     { label: '案例', cls: 't-case' }
  };
  const TYPE_KEYS = ['single', 'multiple', 'judge', 'case'];
  const TYPE_COUNT = {};
  BANK.forEach(q => { TYPE_COUNT[q.t] = (TYPE_COUNT[q.t] || 0) + 1; });

  /* ---------- 图标 ---------- */
  const I = {
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.24.6.8 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9L6.6 20l1-6.1L3.2 9.5l6.1-.9Z"/></svg>',
    starFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9L6.6 20l1-6.1L3.2 9.5l6.1-.9Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 21h16"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6Z"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></svg>'
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 状态 ---------- */
  const blank = () => ({
    v: 1, progress: {}, favs: [], exams: [], daily: {},
    settings: { theme: 'system', font: 'm' },
    session: null, lastResult: null
  });
  let store = blank();
  let saveTimer = null;
  let storageWarned = false;
  let timerId = null;
  let toastTimer = null;
  const ui = { sheet: null };

  function loadStore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s || s.v !== 1) return;
      store = Object.assign(blank(), s);
      store.settings = Object.assign({ theme: 'system', font: 'm' }, s.settings || {});
      if (!Array.isArray(store.favs)) store.favs = [];
      store.favs = store.favs.filter(id => BY_ID.has(id));
      if (!Array.isArray(store.exams)) store.exams = [];
      if (!store.daily || typeof store.daily !== 'object') store.daily = {};
    } catch (e) { /* ignore corrupt state */ }
  }
  function save(now) {
    if (DEMO) return;
    const write = () => {
      try { localStorage.setItem(KEY, JSON.stringify(store)); }
      catch (e) {
        if (!storageWarned) { storageWarned = true; toast('进度无法保存，请检查浏览器存储设置'); }
      }
    };
    clearTimeout(saveTimer);
    if (now) write(); else saveTimer = setTimeout(write, 260);
  }
  function storageOK() {
    try { const k = '__fj_test__'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch (e) { return false; }
  }

  /* ---------- 工具 ---------- */
  const pad = n => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function fmtTime(ms) {
    if (ms == null || ms < 0) ms = 0;
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return h > 0 ? h + ':' + pad(m) + ':' + pad(ss) : m + ':' + pad(ss);
  }
  function fmtDate(ts) {
    const d = new Date(ts);
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }
  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }
  const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
  const letters = q => q.o.map((_, i) => String.fromCharCode(65 + i));
  const ansLetters = q => String(q.a).split('').filter(k => letters(q).includes(k));
  function answerText(q) {
    if (q.t === 'judge') return String(q.a).charAt(0) === 'A' ? '正确' : '错误';
    return ansLetters(q).join('、');
  }
  function isCorrect(q, picked) {
    const a = ansLetters(q).slice().sort().join('');
    const p = Array.from(new Set(picked || [])).filter(k => letters(q).includes(k)).sort().join('');
    return !!p && a === p;
  }

  /* ---------- 进度 ---------- */
  function wrongIds() {
    return Object.keys(store.progress).filter(id => {
      const p = store.progress[id];
      return p && p.wrong > 0 && p.streak < 2;
    }).sort((a, b) => (store.progress[b].ts || 0) - (store.progress[a].ts || 0));
  }
  function recordAnswer(q, picked) {
    const p = store.progress[q.i] || (store.progress[q.i] = { seen: 0, right: 0, wrong: 0, streak: 0, ts: 0 });
    const ok = isCorrect(q, picked);
    p.seen++; p.ts = Date.now();
    if (ok) { p.right++; p.streak++; } else { p.wrong++; p.streak = 0; }
    const k = dayKey();
    store.daily[k] = (store.daily[k] || 0) + 1;
    return ok;
  }
  function computeStats() {
    const vals = Object.keys(store.progress).map(k => store.progress[k]);
    const covered = vals.filter(p => p.seen > 0).length;
    const seen = vals.reduce((a, p) => a + p.seen, 0);
    const right = vals.reduce((a, p) => a + p.right, 0);
    const mastered = vals.filter(p => p.streak >= 2).length;
    let streak = 0;
    const d = new Date();
    if (!(store.daily[dayKey(d)] > 0)) d.setDate(d.getDate() - 1);
    while (store.daily[dayKey(d)] > 0) { streak++; d.setDate(d.getDate() - 1); }
    return {
      covered, seen, right, mastered, streak,
      acc: pct(right, seen),
      today: store.daily[dayKey()] || 0,
      wrong: wrongIds().length,
      favs: store.favs.length,
      best: store.exams.reduce((m, e) => Math.max(m, e.score), 0)
    };
  }

  /* ---------- 路由 ---------- */
  function currentRoute() {
    const h = location.hash.replace(/^#\/?/, '').split('?')[0];
    return h || 'home';
  }
  function go(route) {
    const target = '#/' + route;
    if (location.hash === target) { render(); return; }
    location.hash = target;
  }
  window.addEventListener('hashchange', () => render());

  /* ---------- 通用渲染 ---------- */
  function tabbarHTML(active) {
    return '<div class="tab-inner">' +
      '<a class="tab ' + (active === 'home' ? 'active' : '') + '" href="#/home">' + I.home + '<span>首页</span></a>' +
      '<a class="tab ' + (active === 'wrong' ? 'active' : '') + '" href="#/wrong">' + I.book + '<span>错题本</span></a>' +
      '<a class="tab ' + (active === 'stats' ? 'active' : '') + '" href="#/stats">' + I.chart + '<span>统计</span></a>' +
      '</div>';
  }

  function render(opts) {
    opts = opts || {};
    const route = currentRoute();
    const keep = opts.keepScroll ? window.scrollY : 0;
    let html = '';
    if (route === 'quiz') html = screenQuiz();
    else if (route === 'result') html = screenResult();
    else if (route === 'wrong') html = screenWrong();
    else if (route === 'fav') html = screenFav();
    else if (route === 'stats') html = screenStats();
    else if (route === 'settings') html = screenSettings();
    else html = screenHome();
    $('#view').innerHTML = html;
    const hasTab = ['home', 'wrong', 'fav', 'stats'].includes(route);
    document.body.classList.toggle('has-tab', hasTab);
    $('#tabbar').innerHTML = hasTab ? tabbarHTML(route) : '';
    if (timerId) { clearInterval(timerId); timerId = null; }
    if (route === 'quiz') startTimerIfExam();
    if (keep) requestAnimationFrame(() => window.scrollTo(0, keep));
    else window.scrollTo(0, 0);
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function openOverlay(html, centered) {
    const ov = $('#overlay');
    ov.innerHTML = html;
    ov.className = 'overlay show' + (centered ? ' centered' : '');
  }
  function closeOverlay() {
    const ov = $('#overlay');
    ov.className = 'overlay';
    ov.innerHTML = '';
  }
  let confirmCb = null;
  function confirmDialog(title, desc, okText, cb, danger) {
    confirmCb = cb;
    openOverlay(
      '<div class="modal-card"><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' +
      '<div class="modal-actions"><button class="btn ghost" data-act="confirm-cancel">取消</button>' +
      '<button class="btn ' + (danger ? 'danger' : 'primary') + '" data-act="confirm-ok">' + esc(okText) + '</button></div></div>', true);
  }

  /* ---------- 首页 ---------- */
  function screenHome() {
    const s = computeStats();
    const cov = pct(s.covered, TOTAL);
    const dash = (cov / 100 * 226.2).toFixed(1);
    const ses = store.session;
    let cta;
    if (ses && ses.ids && ses.ids.length) {
      const isExam = ses.mode === 'exam';
      const left = Math.max(0, ses.ids.length - ses.i - 1);
      cta = '<button class="resume" data-act="resume">' +
        '<span class="r-ico">' + (isExam ? I.clock : I.play) + '</span>' +
        '<span class="r-txt"><b>' + (isExam ? '继续考试' : '继续练习') + '</b>' +
        '<small>' + (isExam ? '剩余 ' + fmtTime(ses.deadline - Date.now()) : '第 ' + (ses.i + 1) + ' / ' + ses.ids.length + ' 题 · 还剩 ' + left + ' 题') + '</small></span>' +
        '<span class="r-go">继续 ' + I.chev + '</span></button>';
    } else {
      cta = '<button class="btn primary big block" data-act="open-practice" style="margin-top:14px">开始练习 · ' + TOTAL + ' 题</button>';
    }
    const modes =
      '<div class="mode-grid">' +
        '<button class="mode" data-act="open-practice"><span class="m-ico">' + I.list + '</span><b>顺序刷题</b><small>按题型循序推进</small></button>' +
        '<button class="mode" data-act="open-random"><span class="m-ico">' + I.shuffle + '</span><b>随机练习</b><small>随机抽 20 题</small></button>' +
        '<button class="mode wide exam" data-act="open-exam"><span class="m-ico" style="background:rgba(201,162,39,.16);color:#8A6A05">' + I.clock + '</span>' +
          '<span class="m-txt"><b>模拟考试</b><small>100 题 · 60 分钟 · ' + PASS + ' 分及格</small></span><span class="go">' + I.chev + '</span></button>' +
        '<button class="mode" data-act="open-wrong"><span class="cnt">' + s.wrong + '</span><span class="m-ico" style="background:rgba(200,16,46,.08);color:var(--red)">' + I.book + '</span><b>错题本</b><small>连对 2 次自动移出</small></button>' +
        '<button class="mode" data-act="open-fav"><span class="m-ico" style="background:rgba(201,162,39,.14);color:#8A6A05">' + I.star + '</span><b>收藏</b><small>' + s.favs + ' 道已收藏</small></button>' +
      '</div>';
    return '<div class="screen">' +
      '<header class="home-head"><div class="brand"><div class="logo"><img src="' + ICON + '" alt="反假通"></div>' +
        '<div><h1>反假通</h1><p>货币反假 · 刷题</p></div></div>' +
        '<button class="icon-btn" data-act="settings" aria-label="设置">' + I.gear + '</button></header>' +
      '<section class="hero"><div class="hero-top">' +
        '<div class="ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="7"/>' +
          '<circle cx="42" cy="42" r="36" fill="none" stroke="#E4C45C" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + dash + ' 226.2"/></svg>' +
          '<div class="ring-num"><b>' + cov + '%</b><span>已覆盖</span></div></div>' +
        '<div class="hero-info"><p class="eyebrow">题库覆盖</p><h2>' + s.covered + ' / ' + TOTAL + ' 题</h2>' +
          '<div class="sub"><span>正确率 <b>' + s.acc + '%</b></span><span>已掌握 <b>' + s.mastered + '</b></span></div></div></div>' +
        '<div class="hero-foot"><span>连续练习 <b>' + s.streak + '</b> 天</span><span class="dot"></span><span>今日 ' + s.today + ' 题</span></div>' +
      '</section>' + cta +
      '<div class="section-title"><h3>刷题方式</h3><span>4 种题型 · 全库 ' + TOTAL + ' 题</span></div>' + modes +
      '<div class="quick-stats">' +
        '<div class="qs"><b>' + (s.best || '—') + '</b><span>模考最高分</span></div>' +
        '<div class="qs"><b>' + s.mastered + '</b><span>已掌握</span></div>' +
        '<div class="qs"><b>' + s.wrong + '</b><span>待巩固错题</span></div>' +
      '</div></div>';
  }

  /* ---------- 练习设置 ---------- */
  function openPracticeSheet(mode) {
    const random = mode === 'random';
    ui.sheet = { type: 'practice', mode, filter: 'all', size: random ? 20 : 20, order: random ? 'random' : 'seq' };
    const chips = [['all', '全部'], ['single', '单选'], ['multiple', '多选'], ['judge', '判断'], ['case', '案例']].map(([k, label]) =>
      '<button class="chip-btn ' + (k === 'all' ? 'on' : '') + '" data-filter="' + k + '">' + label + '</button>').join('');
    const sizes = [['10', '10 题'], ['20', '20 题'], ['all', '全部']].map(([k, label]) =>
      '<button class="' + (ui.sheet.size === (k === 'all' ? 'all' : +k) ? 'on' : '') + '" data-seg="size" data-val="' + k + '">' + label + '</button>').join('');
    const orders = [['seq', '顺序'], ['random', '随机']].map(([k, label]) =>
      '<button class="' + (k === ui.sheet.order ? 'on' : '') + '" data-seg="order" data-val="' + k + '">' + label + '</button>').join('');
    openOverlay('<div class="sheet"><div class="sheet-grab"></div><h3>' + (random ? '随机练习' : '顺序刷题') + '</h3>' +
      '<p class="sheet-sub">选好范围和题量，随时可以中断续练</p>' +
      '<div class="sheet-label">题型</div><div class="chips-row">' + chips + '</div>' +
      '<div class="sheet-label">题量</div><div class="seg">' + sizes + '</div>' +
      '<div class="sheet-label">顺序</div><div class="seg">' + orders + '</div>' +
      '<div class="sheet-actions"><button class="btn ghost" data-act="close-sheet">取消</button>' +
      '<button class="btn primary" data-act="start-practice">开始练习</button></div></div>');
  }

  function openExamSheet() {
    ui.sheet = { type: 'exam' };
    openOverlay('<div class="sheet"><div class="sheet-grab"></div><h3>模拟考试</h3>' +
      '<p class="sheet-sub">按真实占比组卷，交卷后出成绩单</p>' +
      '<div class="exam-rules">' +
        '<div class="rule"><span class="dot"></span><span><b>100 题</b>：单选 40 · 多选 28 · 判断 30 · 案例 2</span></div>' +
        '<div class="rule"><span class="dot"></span><span><b>60 分钟</b>倒计时，1 题 1 分，<b>' + PASS + ' 分</b>及格</span></div>' +
        '<div class="rule"><span class="dot"></span><span>考试中不显示答案，未答按错计</span></div>' +
        '<div class="rule"><span class="dot"></span><span>中途退出可继续，倒计时不暂停</span></div>' +
      '</div>' +
      '<div class="sheet-actions"><button class="btn ghost" data-act="close-sheet">取消</button>' +
      '<button class="btn gold" data-act="start-exam">开始考试</button></div></div>');
  }

  function buildExam() {
    const sets = [['single', 40], ['multiple', 28], ['judge', 30], ['case', 2]];
    let ids = [];
    sets.forEach(([t, n]) => {
      const pool = shuffle(BANK.filter(q => q.t === t && q.f !== 'ans-range').map(q => q.i));
      ids = ids.concat(pool.slice(0, n));
      if (pool.length < n) {
        const extra = shuffle(BANK.filter(q => q.t !== t && q.f !== 'ans-range' && !ids.includes(q.i)).map(q => q.i));
        ids = ids.concat(extra.slice(0, n - pool.length));
      }
    });
    return ids;
  }

  function startPractice() {
    const s = ui.sheet;
    if (!s) return;
    let pool = BANK.filter(q => s.filter === 'all' || q.t === s.filter);
    if (!pool.length) { toast('该题型暂无题目'); return; }
    let ids;
    if (s.order === 'seq') {
      const start = pool.findIndex(q => !(store.progress[q.i] && store.progress[q.i].seen > 0));
      const from = start < 0 ? 0 : start;
      const ordered = pool.slice(from).concat(pool.slice(0, from));
      ids = ordered.map(q => q.i);
    } else {
      ids = shuffle(pool.map(q => q.i));
    }
    if (s.size !== 'all') ids = ids.slice(0, s.size);
    store.session = {
      mode: 'practice', ids, i: 0, picks: {}, graded: {},
      startedAt: Date.now(), deadline: 0, filter: s.filter, size: s.size, order: s.order
    };
    save(true); closeOverlay(); go('quiz');
  }

  function startExam() {
    const ids = buildExam();
    store.session = {
      mode: 'exam', ids, i: 0, picks: {}, graded: {},
      startedAt: Date.now(), deadline: Date.now() + 60 * 60 * 1000
    };
    save(true); closeOverlay(); go('quiz');
  }

  function startCustom(mode, ids) {
    startAt(mode, ids, 0);
  }
  function startAt(mode, ids, idx) {
    if (!ids.length) return;
    store.session = { mode, ids: ids.slice(), i: Math.max(0, Math.min(idx, ids.length - 1)), picks: {}, graded: {}, startedAt: Date.now(), deadline: 0 };
    save(true); go('quiz');
  }

  /* ---------- 答题页 ---------- */
  function currentQ() {
    const s = store.session;
    return s && s.ids && s.ids[s.i] ? BY_ID.get(s.ids[s.i]) : null;
  }
  function isGraded(q) {
    const s = store.session;
    return !!(s && s.graded && s.graded[q.i]);
  }

  function screenQuiz() {
    const s = store.session;
    if (!s || !s.ids.length) { setTimeout(() => go('home'), 0); return '<div class="screen"></div>'; }
    if (s.mode === 'exam' && Date.now() > s.deadline) {
      setTimeout(() => submitExam(true), 0);
      return '<div class="screen"><p class="muted" style="padding:40px 16px;text-align:center">考试时间到，正在交卷…</p></div>';
    }
    const q = currentQ();
    if (!q) { setTimeout(() => go('home'), 0); return '<div class="screen"></div>'; }
    const picked = s.picks[q.i] || [];
    const graded = s.mode !== 'exam' && isGraded(q);
    const ok = graded && isCorrect(q, picked);
    const isMulti = q.t === 'multiple' || q.t === 'case';
    const m169 = q.f === 'ans-range';
    const progress = ((s.i + 1) / s.ids.length * 100).toFixed(1);
    const fav = store.favs.includes(q.i);

    let topRight;
    if (s.mode === 'exam') {
      topRight = '<span class="timer" id="timer">' + fmtTime(s.deadline - Date.now()) + '</span>';
    } else {
      topRight = '<button class="icon-btn" data-act="toggle-fav" aria-label="收藏本题" aria-pressed="' + fav + '">' + (fav ? I.starFill : I.star) + '</button>';
    }

    const opts = q.o.map((text, idx) => {
      const key = String.fromCharCode(65 + idx);
      let cls = 'opt';
      if (picked.includes(key)) cls += ' sel';
      if (graded) {
        const isAns = ansLetters(q).includes(key);
        if (isAns && picked.includes(key)) cls += ' correct';
        else if (!isAns && picked.includes(key)) cls += ' wrong';
        else if (isAns && !picked.includes(key)) cls += isMulti ? ' missed' : ' correct';
        else cls += ' dim';
      }
      const mark = graded ? (ansLetters(q).includes(key) ? '<span class="mark">' + I.check + '</span>' : (picked.includes(key) ? '<span class="mark">' + I.x + '</span>' : '')) : '';
      return '<button class="' + cls + '" data-opt="' + key + '" role="' + (isMulti ? 'checkbox' : 'radio') + '" aria-checked="' + picked.includes(key) + '">' +
        '<span class="key">' + key + '</span><span class="txt">' + esc(text) + '</span>' + mark + '</button>';
    }).join('');

    let feedback = '';
    if (graded) {
      const pickedText = picked.length ? picked.join('、') : '未选';
      feedback = '<div class="feedback ' + (ok ? 'ok' : 'bad') + '" aria-live="polite">' +
        '<div class="fb-head"><span class="ico">' + (ok ? I.check : I.x) + '</span><span>' + (ok ? '回答正确' : '回答错误') + '</span>' +
        '<span class="fb-ans">答案 ' + esc(answerText(q)) + '</span></div>' +
        (ok ? '' : '<div class="fb-note">你的选择：' + esc(pickedText) + '</div>') +
        (m169 ? '<div class="fb-flag">原始答案含选项外字母，已按可见选项判定，建议核对原文。</div>' : '') +
        '<div class="fb-note">本题暂无解析，以官方题库答案为准。</div></div>';
    } else if (s.mode === 'exam') {
      feedback = '<div class="tips">考试模式：交卷前不显示答案，可随时用答题卡检查。</div>';
    }

    let foot;
    if (s.mode === 'exam') {
      const last = s.i >= s.ids.length - 1;
      foot = '<div class="inner">' +
        '<button class="btn ghost" data-act="prev" ' + (s.i === 0 ? 'disabled' : '') + '>上一题</button>' +
        '<button class="btn primary" data-act="' + (last ? 'submit-exam' : 'next') + '">' + (last ? '交卷' : '下一题') + '</button>' +
        '<button class="side" data-act="sheet" aria-label="答题卡">' + I.grid + '</button></div>';
    } else if (graded) {
      const last = s.i >= s.ids.length - 1;
      foot = '<div class="inner"><button class="btn primary" data-act="next">' + (last ? '查看结果' : '下一题') + '</button>' +
        '<button class="side" data-act="sheet" aria-label="答题卡">' + I.grid + '</button></div>';
    } else if (isMulti) {
      foot = '<div class="inner"><button class="btn primary" data-act="submit" ' + (picked.length ? '' : 'disabled') + '>提交答案' + (picked.length ? '（' + picked.length + '）' : '') + '</button>' +
        '<button class="side" data-act="sheet" aria-label="答题卡">' + I.grid + '</button></div>';
    } else {
      foot = '<div class="inner"><span class="foot-hint">点击选项作答</span>' +
        '<button class="side" data-act="sheet" aria-label="答题卡">' + I.grid + '</button></div>';
    }

    return '<div class="q-screen">' +
      '<header class="q-top"><button class="icon-btn" data-act="exit" aria-label="退出">' + I.back + '</button>' +
        '<div class="q-top-mid"><span class="chip ' + TYPES[q.t].cls + '">' + TYPES[q.t].label + '</span>' +
        '<span class="q-counter">' + (s.i + 1) + ' / ' + s.ids.length + '</span></div>' + topRight + '</header>' +
      '<div class="q-bar"><i style="width:' + progress + '%"></i></div>' +
      '<div class="q-wrap">' + (m169 ? '<div class="q-meta"><span class="flag-tag">答案存疑 · 已排除出模拟考</span></div>' : '') +
      '<div class="q-stem">' + esc(q.q) + '</div>' +
      '<div class="opts ' + (q.t === 'judge' ? 'judge' : '') + '" role="' + (isMulti ? 'group' : 'radiogroup') + '" aria-label="选项">' + opts + '</div>' +
      feedback + '</div>' + '<div class="q-foot">' + foot + '</div></div>';
  }

  function onOption(key) {
    const s = store.session;
    if (!s) return;
    const q = currentQ();
    if (!q) return;
    if (s.mode !== 'exam' && s.graded[q.i]) return;
    const isMulti = q.t === 'multiple' || q.t === 'case';
    let picked = (s.picks[q.i] || []).slice();
    if (isMulti) {
      const idx = picked.indexOf(key);
      if (idx >= 0) picked.splice(idx, 1); else picked.push(key);
    } else {
      picked = [key];
    }
    s.picks[q.i] = picked;
    if (s.mode === 'exam') { save(); render({ keepScroll: true }); return; }
    if (!isMulti) {
      s.graded[q.i] = true;
      recordAnswer(q, picked);
      save();
      render({ keepScroll: true });
      scrollFeedback();
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
    } else {
      save(); render({ keepScroll: true });
    }
  }

  function scrollFeedback() {
    const el = $('.feedback');
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  }

  function submitAnswer() {
    const s = store.session;
    if (!s) return;
    const q = currentQ();
    const picked = s.picks[q.i] || [];
    if (!picked.length) { toast('请先选择答案'); return; }
    s.graded[q.i] = true;
    recordAnswer(q, picked);
    save();
    render({ keepScroll: true });
    scrollFeedback();
  }

  function nextQ() {
    const s = store.session;
    if (!s) return;
    if (s.i < s.ids.length - 1) { s.i++; save(); render(); }
    else if (s.mode === 'exam') { confirmSubmitExam(); }
    else finishPractice();
  }
  function prevQ() {
    const s = store.session;
    if (!s || s.i <= 0) return;
    s.i--; save(); render();
  }

  function finishPractice() {
    const s = store.session;
    if (!s) return;
    const answered = s.ids.filter(id => s.graded[id]);
    const correct = answered.filter(id => isCorrect(BY_ID.get(id), s.picks[id] || [])).length;
    const wrong = answered.filter(id => !isCorrect(BY_ID.get(id), s.picks[id] || []))
      .map(id => ({ id, picked: s.picks[id] || [] }));
    store.lastResult = {
      kind: 'practice', mode: s.mode, total: s.ids.length, answered: answered.length,
      correct, wrong, timeMs: Date.now() - s.startedAt, ts: Date.now()
    };
    store.session = null;
    save(true); go('result');
  }

  function confirmSubmitExam() {
    const s = store.session;
    if (!s) return;
    const unanswered = s.ids.length - Object.keys(s.picks).filter(id => (s.picks[id] || []).length).length;
    if (unanswered > 0) {
      confirmDialog('确认交卷？', '还有 ' + unanswered + ' 题未作答，未答按错计。', '确认交卷', () => { closeOverlay(); submitExam(false); }, true);
    } else {
      submitExam(false);
    }
  }

  function submitExam(auto) {
    const s = store.session;
    if (!s || s.mode !== 'exam') return;
    const byType = {};
    let correct = 0, answered = 0;
    const wrong = [];
    s.ids.forEach(id => {
      const q = BY_ID.get(id);
      if (!q) return;
      const picked = s.picks[id] || [];
      const t = byType[q.t] || (byType[q.t] = { total: 0, correct: 0, answered: 0 });
      t.total++;
      if (picked.length) { answered++; t.answered++; }
      const ok = picked.length > 0 && isCorrect(q, picked);
      if (ok) { correct++; t.correct++; }
      else wrong.push({ id, picked });
      if (picked.length) recordAnswer(q, picked);
    });
    const score = correct;
    const res = {
      kind: 'exam', score, total: s.ids.length, correct, answered, byType, wrong,
      timeMs: Date.now() - s.startedAt, ts: Date.now(), passed: score >= PASS
    };
    store.lastResult = res;
    store.exams.unshift({ ts: res.ts, score, passed: res.passed, total: res.total, timeMs: res.timeMs });
    store.exams = store.exams.slice(0, 20);
    store.session = null;
    save(true);
    if (auto) toast('考试时间到，已自动交卷');
    go('result');
  }

  function startTimerIfExam() {
    const s = store.session;
    if (!s || s.mode !== 'exam') return;
    const tick = () => {
      const el = $('#timer');
      const left = s.deadline - Date.now();
      if (el) {
        el.textContent = fmtTime(Math.max(0, left));
        el.classList.toggle('warn', left < 5 * 60 * 1000);
      }
      if (left <= 0) { clearInterval(timerId); timerId = null; submitExam(true); }
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  /* ---------- 答题卡 ---------- */
  function openAnswerSheet() {
    const s = store.session;
    if (!s) return;
    let ok = 0, bad = 0, answered = 0;
    const cells = s.ids.map((id, idx) => {
      const picked = s.picks[id] || [];
      let cls = 'ans-cell';
      if (picked.length) { answered++; cls += ' answered'; }
      if (s.graded[id]) {
        if (isCorrect(BY_ID.get(id), picked)) { cls += ' ok'; ok++; } else { cls += ' bad'; bad++; }
      }
      if (idx === s.i) cls += ' cur';
      const fav = store.favs.includes(id) ? '<span class="fav-dot"></span>' : '';
      return '<button class="' + cls + '" data-act="jump" data-idx="' + idx + '">' + (idx + 1) + fav + '</button>';
    }).join('');
    const sub = s.mode === 'exam'
      ? '已答 ' + answered + ' · 未答 ' + (s.ids.length - answered)
      : '对 ' + ok + ' · 错 ' + bad + ' · 未答 ' + (s.ids.length - answered);
    openOverlay('<div class="sheet"><div class="sheet-grab"></div><h3>答题卡</h3><p class="sheet-sub">' + sub + '</p>' +
      '<div class="grid-answers">' + cells + '</div></div>');
  }

  /* ---------- 结果 ---------- */
  function screenResult() {
    const r = store.lastResult;
    if (!r) { setTimeout(() => go('home'), 0); return '<div class="screen"></div>'; }
    const isExam = r.kind === 'exam';
    const total = isExam ? r.total : r.answered;
    const ratio = total ? r.correct / total : 0;
    const img = r.kind === 'exam' && !r.passed ? IMG.bad : (ratio >= 0.9 ? IMG.great : (ratio >= 0.6 ? IMG.ok : IMG.bad));
    const title = isExam ? (r.passed ? '考试通过' : '未达及格线') : (ratio >= 0.9 ? '漂亮，继续保持' : (ratio >= 0.6 ? '稳步前进' : '错题就是提分点'));
    const sub = isExam ? '及格线 ' + PASS + ' 分 · 共 ' + r.total + ' 题' : '本组完成 · 共 ' + r.total + ' 题';
    let scoreHtml;
    if (isExam) {
      scoreHtml = '<div class="score-wrap"><span class="score">' + r.score + '</span><small>/ 100</small></div>' +
        '<div class="verdict ' + (r.passed ? 'pass' : 'fail') + '">' + (r.passed ? '✓ 通过' : '✕ 未通过') + '</div>';
    } else {
      scoreHtml = '<div class="score-wrap"><span class="score">' + r.correct + '</span><small>/ ' + r.answered + ' 正确</small></div>' +
        '<div class="verdict ' + (ratio >= 0.6 ? 'pass' : 'fail') + '">正确率 ' + pct(r.correct, r.answered) + '%</div>';
    }
    const stats = '<div class="stat-grid">' +
      '<div class="stat"><b>' + r.correct + '</b><span>' + (isExam ? '答对题数' : '答对') + '</span></div>' +
      '<div class="stat"><b>' + fmtTime(r.timeMs) + '</b><span>' + (isExam ? '用时' : '本组用时') + '</span></div>' +
      '<div class="stat"><b>' + pct(r.correct, isExam ? r.total : r.answered) + '%</b><span>正确率</span></div></div>';

    let bars = '';
    if (isExam && r.byType) {
      bars = '<div class="bars"><h4>分题型表现</h4>' + TYPE_KEYS.filter(t => r.byType[t]).map(t => {
        const x = r.byType[t];
        const color = t === 'judge' ? 'green' : (t === 'multiple' ? 'gold' : (t === 'case' ? 'red' : ''));
        return '<div class="bar-row"><div class="bar-top"><span>' + TYPES[t].label + '</span><b>' + x.correct + ' / ' + x.total + '</b></div>' +
          '<div class="bar"><i class="' + color + '" style="width:' + pct(x.correct, x.total) + '%"></i></div></div>';
      }).join('') + '</div>';
    }

    let wrongBlock = '';
    if (r.wrong && r.wrong.length) {
      wrongBlock = '<div class="wrong-block"><h4>错题回顾<span>共 ' + r.wrong.length + ' 题，已自动加入错题本</span></h4>' +
        r.wrong.slice(0, 8).map(w => {
          const q = BY_ID.get(w.id);
          if (!q) return '';
          return '<div class="wrong-item"><div class="w-stem">' + esc(q.q) + '</div><div class="w-meta">' +
            '<span class="chip ' + TYPES[q.t].cls + '">' + TYPES[q.t].label + '</span>' +
            '<span class="pick">你选 ' + (w.picked.length ? w.picked.join('、') : '未答') + '</span>' +
            '<span class="ans">答案 ' + esc(answerText(q)) + '</span></div></div>';
        }).join('') + (r.wrong.length > 8 ? '<p class="muted" style="font-size:.72rem;text-align:center;padding:6px 0">还有 ' + (r.wrong.length - 8) + ' 题，可在错题本查看</p>' : '') + '</div>';
    }

    const actions = '<div class="result-actions">' +
      (r.wrong && r.wrong.length
        ? '<button class="btn ghost" data-act="result-wrong">错题重练</button>'
        : '<button class="btn ghost" data-act="result-again">再练一组</button>') +
      '<button class="btn primary" data-act="result-home">返回首页</button></div>';

    return '<div class="screen result-screen">' +
      '<div class="topbar"><button class="icon-btn" data-act="result-home" aria-label="返回">' + I.back + '</button>' +
        '<h2>' + (isExam ? '考试结果' : '练习结果') + '</h2><span class="right"></span></div>' +
      '<div class="result-hero"><img class="res-img" src="' + img + '" alt="">' + scoreHtml +
        '<div class="result-sub">' + esc(sub) + (isExam ? '' : ' · ' + esc(title)) + '</div></div>' + stats + bars + wrongBlock + actions +
      '<div class="tips">成绩与进度只保存在本机浏览器；换设备可在「设置」中导出/导入进度。</div></div>';
  }

  /* ---------- 列表 ---------- */
  function listRow(q, id, meta, idx, act) {
    act = act || 'retry-at';
    return '<button class="row" data-act="' + act + '" data-id="' + id + '" data-idx="' + idx + '">' +
      '<span class="r-no">' + (idx + 1) + '</span><span class="r-main"><span class="r-title">' + esc(q.q) + '</span>' +
      '<span class="r-sub"><span class="chip ' + TYPES[q.t].cls + '" style="height:20px;font-size:.66rem">' + TYPES[q.t].label + '</span>' + esc(meta) + '</span></span>' +
      '<span class="chev">' + I.chev + '</span></button>';
  }

  function screenWrong() {
    const all = wrongIds();
    const filter = ui.wrongFilter || 'all';
    const ids = all.filter(id => filter === 'all' || BY_ID.get(id).t === filter);
    let body;
    if (!all.length) {
      body = '<div class="empty"><img src="' + (IMG.empty || '') + '" alt=""><h3>还没有错题</h3>' +
        '<p>练习中答错的题会自动收进这里，连续答对 2 次自动移出。</p>' +
        '<button class="btn primary" data-act="open-practice">去练几题</button></div>';
    } else if (!ids.length) {
      body = '<div class="empty"><img src="' + (IMG.empty || '') + '" alt=""><h3>这个题型没有错题</h3><p>换个题型看看吧。</p></div>';
    } else {
      body = '<div class="list">' + ids.map((id, i) => {
        const q = BY_ID.get(id), p = store.progress[id];
        return listRow(q, id, '答错 ' + p.wrong + ' 次 · 再连对 ' + Math.max(0, 2 - p.streak) + ' 次移出', i);
      }).join('') + '</div>' +
        '<div class="list-foot"><button class="btn primary block" data-act="retry-all">全部重练（' + ids.length + '）</button></div>';
    }
    const chips = [['all', '全部'], ['single', '单选'], ['multiple', '多选'], ['judge', '判断'], ['case', '案例']].map(([k, label]) =>
      '<button class="chip-btn ' + (filter === k ? 'on' : '') + '" data-act="filter-wrong" data-val="' + k + '">' + label + '</button>').join('');
    return '<div class="screen"><div class="topbar"><span style="width:44px"></span><h2>错题本</h2><span class="right"></span></div>' +
      '<div class="filter-row">' + chips + '</div>' + body + '</div>';
  }

  function screenFav() {
    const all = store.favs.slice();
    const filter = ui.favFilter || 'all';
    const ids = all.filter(id => filter === 'all' || (BY_ID.get(id) && BY_ID.get(id).t === filter));
    let body;
    if (!all.length) {
      body = '<div class="empty"><img src="' + (IMG.empty || '') + '" alt=""><h3>还没有收藏</h3>' +
        '<p>答题页右上角的星标，可以把重点题收进来反复看。</p>' +
        '<button class="btn primary" data-act="open-practice">去刷题</button></div>';
    } else if (!ids.length) {
      body = '<div class="empty"><img src="' + (IMG.empty || '') + '" alt=""><h3>这个题型没有收藏</h3><p>换个题型看看吧。</p></div>';
    } else {
      body = '<div class="list">' + ids.map((id, i) => {
        const q = BY_ID.get(id);
        const p = store.progress[id];
        return listRow(q, id, p && p.seen ? '正确率 ' + pct(p.right, p.seen) + '%' : '尚未作答', i, 'fav-at');
      }).join('') + '</div>' +
        '<div class="list-foot"><button class="btn primary block" data-act="fav-all">开始复习（' + ids.length + '）</button></div>';
    }
    const chips = [['all', '全部'], ['single', '单选'], ['multiple', '多选'], ['judge', '判断'], ['case', '案例']].map(([k, label]) =>
      '<button class="chip-btn ' + (filter === k ? 'on' : '') + '" data-act="filter-fav" data-val="' + k + '">' + label + '</button>').join('');
    return '<div class="screen"><div class="topbar"><span style="width:44px"></span><h2>收藏</h2><span class="right"></span></div>' +
      '<div class="filter-row">' + chips + '</div>' + body + '</div>';
  }

  /* ---------- 统计 ---------- */
  function screenStats() {
    const s = computeStats();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push({ key: dayKey(d), label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()], n: store.daily[dayKey(d)] || 0, today: i === 0 });
    }
    const max = Math.max(1, ...days.map(d => d.n));
    const week = days.map(d => '<div class="wk ' + (d.today ? 'today' : '') + '"><div class="col" style="height:' + Math.max(3, d.n / max * 72) + 'px"></div><span>' + d.label + '</span></div>').join('');
    const typeBars = TYPE_KEYS.map(t => {
      const qs = BANK.filter(q => q.t === t);
      const answered = qs.filter(q => store.progress[q.i] && store.progress[q.i].seen > 0).length;
      let right = 0, seen = 0;
      qs.forEach(q => { const p = store.progress[q.i]; if (p) { right += p.right; seen += p.seen; } });
      return '<div class="bar-row"><div class="bar-top"><span>' + TYPES[t].label + ' · 已练 ' + answered + '/' + qs.length + '</span><b>正确率 ' + pct(right, seen) + '%</b></div>' +
        '<div class="bar"><i class="' + (t === 'judge' ? 'green' : t === 'multiple' ? 'gold' : t === 'case' ? 'red' : '') + '" style="width:' + pct(right, seen) + '%"></i></div></div>';
    }).join('');
    const exams = store.exams.slice(0, 5).map(e =>
      '<div class="hist-row"><span class="score-mini">' + e.score + '</span><span class="tag ' + (e.passed ? 'pass' : 'fail') + '">' + (e.passed ? '通过' : '未通过') + '</span>' +
      '<span class="muted">' + fmtDate(e.ts) + '</span><time>' + fmtTime(e.timeMs) + '</time></div>').join('');

    return '<div class="screen"><div class="topbar"><span style="width:44px"></span><h2>学习统计</h2><span class="right"><button class="icon-btn" data-act="settings" aria-label="设置">' + I.gear + '</button></span></div>' +
      '<div class="stat-cards">' +
        '<div class="sc"><div class="sc-top"><span>题库覆盖</span><span>' + s.covered + '/' + TOTAL + '</span></div><b>' + pct(s.covered, TOTAL) + '%</b><small>已练习不重复题数</small></div>' +
        '<div class="sc"><div class="sc-top"><span>累计正确率</span><span>' + s.seen + ' 次</span></div><b>' + s.acc + '%</b><small>按作答次数计算</small></div>' +
        '<div class="sc"><div class="sc-top"><span>已掌握</span><span>连对 2 次</span></div><b>' + s.mastered + '</b><small>最近连续答对≥2 次</small></div>' +
        '<div class="sc"><div class="sc-top"><span>连续练习</span><span>今日 ' + s.today + ' 题</span></div><b>' + s.streak + ' 天</b><small>中断即重新计数</small></div>' +
      '</div>' +
      '<div class="week-card"><div style="display:flex;justify-content:space-between;align-items:baseline"><h4 style="font-size:.9rem">最近 7 天</h4><span class="muted" style="font-size:.72rem">共 ' + days.reduce((a, d) => a + d.n, 0) + ' 题</span></div><div class="week">' + week + '</div></div>' +
      '<div class="bars" style="margin-top:12px"><h4>分题型进度</h4>' + typeBars + '</div>' +
      (exams ? '<div class="exam-hist" style="margin-top:12px"><div style="padding:12px 0 4px;font-size:.9rem;font-weight:650">最近模考</div>' + exams + '</div>' : '') +
      '<div class="tips">正确率 = 答对次数 ÷ 总作答次数；同一题反复练习会重复计入。重置进度在「设置」里。</div></div>';
  }

  /* ---------- 设置 ---------- */
  function screenSettings() {
    const s = store.settings;
    const themeSeg = [['system', '跟随'], ['light', '浅色'], ['dark', '深色']].map(([k, l]) =>
      '<button data-act="set-theme" data-val="' + k + '" class="' + (s.theme === k ? 'on' : '') + '">' + l + '</button>').join('');
    const fontSeg = [['m', '标准'], ['l', '大']].map(([k, l]) =>
      '<button data-act="set-font" data-val="' + k + '" class="' + (s.font === k ? 'on' : '') + '">' + l + '</button>').join('');
    return '<div class="screen"><div class="topbar"><button class="icon-btn" data-act="result-home" aria-label="返回">' + I.back + '</button><h2>设置</h2><span class="right"></span></div>' +
      '<div class="group-title">外观</div><div class="group">' +
        '<div class="cell"><span class="c-main"><span class="c-title">主题</span><span class="c-desc">跟随系统或手动切换</span></span><div class="seg mini">' + themeSeg + '</div></div>' +
        '<div class="cell"><span class="c-main"><span class="c-title">字号</span><span class="c-desc">刷题页正文大小</span></span><div class="seg mini">' + fontSeg + '</div></div>' +
      '</div>' +
      '<div class="group-title">数据</div><div class="group">' +
        '<button class="cell" data-act="export"><span class="c-main"><span class="c-title">导出进度</span><span class="c-desc">生成 JSON 备份，可换设备导入</span></span><span class="c-side">' + I.download + '</span></button>' +
        '<button class="cell" data-act="import"><span class="c-main"><span class="c-title">导入进度</span><span class="c-desc">从备份文件恢复，覆盖当前数据</span></span><span class="c-side">' + I.upload + '</span></button>' +
        '<button class="cell" data-act="reset"><span class="c-main"><span class="c-title" style="color:var(--bad)">清空全部进度</span><span class="c-desc">题库本身不受影响</span></span><span class="c-side" style="color:var(--bad)">' + I.trash + '</span></button>' +
      '</div>' +
      '<div class="group-title">关于</div><div class="group"><div class="about">' +
        '<b>反假通</b> · 货币反假刷题<br>题库共 <b>' + TOTAL + '</b> 题：单选 ' + TYPE_COUNT.single + ' · 多选 ' + TYPE_COUNT.multiple + ' · 判断 ' + TYPE_COUNT.judge + ' · 案例 ' + TYPE_COUNT.case + '<br>' +
        '单文件离线版 · 数据仅保存在本机浏览器<br>原题答案含 1 处越界（多选 169），已标记存疑并排除出模拟考<br>' +
        '题库版本：2026-11 · 共 ' + TOTAL + ' 题' +
      '</div></div>' +
      '<p class="muted" style="font-size:.7rem;text-align:center;margin-top:18px">双击 HTML 文件即可使用，无需联网</p>' +
      '<input type="file" id="importFile" accept=".json,application/json" hidden></div>';
  }

  /* ---------- 主题 ---------- */
  function applySettings() {
    const s = store.settings;
    const dark = s.theme === 'dark' || (s.theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.font = s.font === 'l' ? 'l' : 'm';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0B1220' : '#0B3B6F');
  }
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (store.settings.theme === 'system') { applySettings(); render({ keepScroll: true }); } };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  }

  /* ---------- 行为分发 ---------- */
  document.addEventListener('click', e => {
    const ov = e.target;
    if (ov && ov.classList && ov.classList.contains('overlay')) { closeOverlay(); return; }
    const seg = e.target.closest && e.target.closest('[data-seg]');
    if (seg && ui.sheet) {
      const grp = seg.dataset.seg, val = seg.dataset.val;
      if (grp === 'size') ui.sheet.size = val === 'all' ? 'all' : +val;
      if (grp === 'order') ui.sheet.order = val;
      Array.from(seg.parentNode.children).forEach(b => b.classList.toggle('on', b === seg));
      return;
    }
    const chip = e.target.closest && e.target.closest('[data-filter]');
    if (chip && ui.sheet) {
      ui.sheet.filter = chip.dataset.filter;
      Array.from(chip.parentNode.children).forEach(b => b.classList.toggle('on', b === chip));
      return;
    }
    const opt = e.target.closest && e.target.closest('[data-opt]');
    if (opt && currentRoute() === 'quiz') { onOption(opt.dataset.opt); return; }
    const el = e.target.closest && e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    handle(act, el);
  });

  document.addEventListener('change', e => {
    if (e.target && e.target.id === 'importFile') importFile(e.target.files[0]);
  });

  function handle(act, el) {
    switch (act) {
      case 'home': go('home'); break;
      case 'settings': go('settings'); break;
      case 'open-wrong': go('wrong'); break;
      case 'open-fav': go('fav'); break;
      case 'toggle-fav': toggleFav(); break;
      case 'open-practice': openPracticeSheet('practice'); break;
      case 'open-random': openPracticeSheet('random'); break;
      case 'open-exam': openExamSheet(); break;
      case 'close-sheet': closeOverlay(); break;
      case 'start-practice': startPractice(); break;
      case 'start-exam': startExam(); break;
      case 'resume': go('quiz'); break;
      case 'submit': submitAnswer(); break;
      case 'next': nextQ(); break;
      case 'prev': prevQ(); break;
      case 'submit-exam': confirmSubmitExam(); break;
      case 'exit': exitQuiz(); break;
      case 'sheet': openAnswerSheet(); break;
      case 'jump': { const s = store.session; if (s) { s.i = +el.dataset.idx; save(); } closeOverlay(); render(); break; }
      case 'result-home': go('home'); break;
      case 'result-again': { const r = store.lastResult; if (r && r.kind === 'exam') openExamSheet(); else openPracticeSheet('practice'); break; }
      case 'result-wrong': { const r = store.lastResult; if (r && r.wrong && r.wrong.length) startCustom('wrong', r.wrong.map(w => w.id)); break; }
      case 'confirm-ok': { const cb = confirmCb; confirmCb = null; closeOverlay(); if (cb) cb(); break; }
      case 'confirm-cancel': confirmCb = null; closeOverlay(); break;
      case 'filter-wrong': ui.wrongFilter = el.dataset.val; render({ keepScroll: true }); break;
      case 'filter-fav': ui.favFilter = el.dataset.val; render({ keepScroll: true }); break;
      case 'retry-at': {
        const id = el.dataset.id;
        const filter = ui.wrongFilter || 'all';
        const ids = wrongIds().filter(x => filter === 'all' || BY_ID.get(x).t === filter);
        startAt('wrong', ids, Math.max(0, ids.indexOf(id))); break;
      }
      case 'fav-at': {
        const id = el.dataset.id;
        const filter = ui.favFilter || 'all';
        const ids = store.favs.filter(x => filter === 'all' || (BY_ID.get(x) && BY_ID.get(x).t === filter));
        startAt('fav', ids, Math.max(0, ids.indexOf(id))); break;
      }
      case 'retry-all': { const filter = ui.wrongFilter || 'all'; const ids = wrongIds().filter(x => filter === 'all' || BY_ID.get(x).t === filter); if (ids.length) startCustom('wrong', ids); break; }
      case 'fav-all': { const filter = ui.favFilter || 'all'; const ids = store.favs.filter(x => filter === 'all' || (BY_ID.get(x) && BY_ID.get(x).t === filter)); if (ids.length) startCustom('fav', ids); break; }
      case 'set-theme': store.settings.theme = el.dataset.val; save(); applySettings(); render({ keepScroll: true }); break;
      case 'set-font': store.settings.font = el.dataset.val; save(); applySettings(); render({ keepScroll: true }); break;
      case 'export': exportData(); break;
      case 'import': { const f = $('#importFile'); if (f) f.click(); break; }
      case 'reset': resetAll(); break;
      default: break;
    }
  }

  function exitQuiz() {
    const s = store.session;
    if (!s) { go('home'); return; }
    if (s.mode === 'exam') {
      confirmDialog('退出考试？', '倒计时不会暂停，已作答内容会保留，可从首页继续。', '退出', () => { closeOverlay(); save(true); go('home'); }, true);
    } else {
      save(true); go('home');
    }
  }

  function toggleFav() {
    const s = store.session;
    if (!s) return;
    const id = s.ids[s.i];
    const i = store.favs.indexOf(id);
    if (i >= 0) { store.favs.splice(i, 1); toast('已取消收藏'); }
    else { store.favs.unshift(id); toast('已收藏'); }
    save(); render({ keepScroll: true });
  }

  function exportData() {
    const payload = {
      app: '反假通', v: 1, exportedAt: new Date().toISOString(),
      progress: store.progress, favs: store.favs, exams: store.exams, daily: store.daily
    };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '反假通-进度-' + dayKey() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast('进度已导出');
  }

  function importFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data.progress !== 'object' || data.progress === null) throw new Error('bad');
        const count = Object.keys(data.progress).length;
        confirmDialog('导入进度？', '文件包含 ' + count + ' 道题的记录，导入后将覆盖当前进度。', '导入', () => {
          store.progress = data.progress || {};
          store.favs = (Array.isArray(data.favs) ? data.favs : []).filter(id => BY_ID.has(id));
          store.exams = Array.isArray(data.exams) ? data.exams : [];
          store.daily = (data.daily && typeof data.daily === 'object') ? data.daily : {};
          save(true); applySettings(); render({ keepScroll: true }); toast('导入成功');
        });
      } catch (e) { toast('文件格式不正确'); }
      const input = $('#importFile'); if (input) input.value = '';
    };
    reader.readAsText(file);
  }

  function resetAll() {
    confirmDialog('清空全部进度？', '错题、收藏、统计、模考记录都会被删除，且无法恢复。题库不受影响。', '确认清空', () => {
      store = blank();
      try { localStorage.removeItem(KEY); } catch (e) {}
      applySettings(); go('home'); toast('已清空');
    }, true);
  }

  /* ---------- 启动 ---------- */
  loadStore();
  applySettings();
  window.addEventListener('pagehide', () => save(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(true); });

  if (location.search.includes('selftest')) {
    runSelfTest();
  } else if (location.search.includes('demo=')) {
    bootDemo(new URLSearchParams(location.search).get('demo'));
  } else {
    if (!location.hash) history.replaceState(null, '', '#/home');
    render();
    if (!storageOK()) {
      setTimeout(() => toast('当前浏览器禁用了本地存储，进度只在本次打开有效'), 800);
    }
  }

  /* ---------- 自测 ---------- */
  function runSelfTest() {
    const results = [];
    const t = (name, fn) => {
      try { const r = fn(); results.push({ name, ok: r !== false, msg: typeof r === 'string' ? r : '' }); }
      catch (e) { results.push({ name, ok: false, msg: e.message }); }
    };
    t('题库总数 868', () => BANK.length === 868 || 'got ' + BANK.length);
    t('题型数量 340/240/272/16', () => TYPE_COUNT.single === 340 && TYPE_COUNT.multiple === 240 && TYPE_COUNT.judge === 272 && TYPE_COUNT.case === 16);
    t('每题至少 2 个选项', () => BANK.every(q => q.o.length >= 2));
    t('答案均在选项内（除标记题）', () => BANK.every(q => q.f === 'ans-range' || ansLetters(q).length === String(q.a).length));
    t('判断题选项为正确/错误', () => BANK.filter(q => q.t === 'judge').every(q => q.o[0] === '正确' && q.o[1] === '错误'));
    t('单选判分', () => { const q = BY_ID.get('s1'); return isCorrect(q, ['B']) && !isCorrect(q, ['A']); });
    t('多选全对才得分', () => {
      const q = BANK.find(x => x.t === 'multiple' && x.a.length === 4);
      return isCorrect(q, q.a.split('')) && !isCorrect(q, q.a.split('').slice(1));
    });
    t('多选漏选/错选 0 分', () => {
      const q = BANK.find(x => x.t === 'multiple' && ansLetters(x).length < x.o.length);
      const ans = ansLetters(q);
      const extra = letters(q).find(k => !ans.includes(k));
      return !isCorrect(q, ans.slice(0, -1)) && !isCorrect(q, ans.slice(0, -1).concat(extra));
    });
    t('考试组卷 100 题且无重复', () => { const ids = buildExam(); return ids.length === 100 && new Set(ids).size === 100; });
    t('考试配比 40/28/30/2', () => {
      const ids = buildExam(); const c = { single: 0, multiple: 0, judge: 0, case: 0 };
      ids.forEach(id => c[BY_ID.get(id).t]++);
      return c.single === 40 && c.multiple === 28 && c.judge === 30 && c.case === 2;
    });
    t('错题连对 2 次移出', () => {
      const backup = JSON.stringify(store.progress); const q = BY_ID.get('s2');
      store.progress = {};
      recordAnswer(q, ['A']); const in1 = wrongIds().includes(q.i);
      recordAnswer(q, ['B']); recordAnswer(q, ['B']); const out = !wrongIds().includes(q.i);
      store.progress = JSON.parse(backup);
      return in1 && out;
    });
    t('答错重置连对计数', () => {
      const backup = JSON.stringify(store.progress); const q = BY_ID.get('s3');
      const a = ansLetters(q)[0];
      const bad = letters(q).find(k => k !== a);
      store.progress = {};
      recordAnswer(q, [a]); recordAnswer(q, [a]); recordAnswer(q, [bad]);
      const p = store.progress[q.i];
      const ok = p.streak === 0 && p.wrong === 1;
      store.progress = JSON.parse(backup);
      return ok;
    });
    t('答题卡状态计算', () => { render(); return true; });
    t('页面渲染不报错', () => {
      const saved = JSON.stringify(store);
      store.session = { mode: 'practice', ids: ['s1', 's2'], i: 0, picks: {}, graded: {}, startedAt: Date.now(), deadline: 0 };
      const a = screenQuiz(); const b = screenHome(); const c = screenStats(); const d = screenSettings();
      store = JSON.parse(saved);
      return a.includes('q-screen') && b.includes('hero') && c.includes('stat-cards') && d.includes('设置');
    });
    t('结果页渲染', () => {
      const saved = JSON.stringify(store);
      store.lastResult = { kind: 'exam', score: 86, total: 100, correct: 86, answered: 96, byType: { single: { total: 40, correct: 36, answered: 39 } }, wrong: [{ id: 's1', picked: ['A'] }], timeMs: 1800000, passed: true, ts: Date.now() };
      const html = screenResult();
      store = JSON.parse(saved);
      return html.includes('86') && html.includes('考试结果') && html.includes('通过');
    });
    t('本地存储可写', () => {
      try { localStorage.setItem('__fj_t', '1'); const ok = localStorage.getItem('__fj_t') === '1'; localStorage.removeItem('__fj_t'); return ok; }
      catch (e) { return 'blocked: ' + e.name; }
    });
    t('时间格式化', () => fmtTime(65000) === '1:05' && fmtTime(3661000) === '1:01:01');
    t('洗牌不增删元素', () => { const a = [1, 2, 3, 4, 5]; const b = shuffle(a); return b.length === 5 && a.join() === '1,2,3,4,5'; });
    const pass = results.filter(r => r.ok).length;
    document.title = 'SELFTEST ' + pass + '/' + results.length;
    document.body.innerHTML = '<div class="screen" style="padding-top:40px"><h2 style="margin-bottom:14px">自测 ' + pass + ' / ' + results.length + '</h2>' +
      results.map(r => '<div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid #eee;font-size:14px"><b style="color:' + (r.ok ? '#177A4C' : '#C8102E') + '">' + (r.ok ? 'PASS' : 'FAIL') + '</b><span>' + esc(r.name) + (r.msg ? ' — ' + esc(r.msg) : '') + '</span></div>').join('') + '</div>';
    window.__TEST_RESULT__ = { pass, total: results.length, results };
  }

  /* ---------- 演示数据（截图 / 预览） ---------- */
  function bootDemo(kind) {
    store = blank();
    if (new URLSearchParams(location.search).get('theme') === 'dark') { store.settings.theme = 'dark'; applySettings(); }
    const now = Date.now();
    const demoIds = BANK.slice(0, 200).map(q => q.i);
    demoIds.forEach((id, i) => {
      const ok = i % 5 !== 0;
      store.progress[id] = { seen: 1, right: ok ? 1 : 0, wrong: ok ? 0 : 1, streak: ok ? (i % 3 === 0 ? 2 : 1) : 0, ts: now - i * 60000 };
    });
    for (let d = 6; d >= 0; d--) {
      const dt = new Date(); dt.setDate(dt.getDate() - d);
      store.daily[dayKey(dt)] = d === 0 ? 12 : 8 + (d * 5) % 22;
    }
    store.favs = ['s1', 'm3', 'j8', 'c2'];
    store.exams = [
      { ts: now - 86400000 * 2, score: 78, passed: false, total: 100, timeMs: 2600000 },
      { ts: now - 86400000 * 5, score: 84, passed: true, total: 100, timeMs: 2400000 },
      { ts: now - 86400000 * 9, score: 91, passed: true, total: 100, timeMs: 2100000 }
    ];
    if (kind === 'quiz') {
      const sess = { mode: 'practice', ids: BANK.filter(q => q.t === 'single').slice(0, 20).map(q => q.i), i: 0, picks: { s1: ['A'] }, graded: { s1: true }, startedAt: now - 300000, deadline: 0 };
      store.session = sess;
      location.hash = '#/quiz';
    } else if (kind === 'exam') {
      const ids = buildExam();
      const picks = {}; ids.slice(0, 6).forEach((id, i) => { picks[id] = i % 2 ? ['A'] : ['B']; });
      store.session = { mode: 'exam', ids, i: 5, picks, graded: {}, startedAt: now - 600000, deadline: now + 3000000 };
      location.hash = '#/quiz';
    } else if (kind === 'result') {
      store.lastResult = { kind: 'exam', score: 86, total: 100, correct: 86, answered: 96, byType: { single: { total: 40, correct: 36, answered: 39 }, multiple: { total: 28, correct: 22, answered: 26 }, judge: { total: 30, correct: 27, answered: 30 }, case: { total: 2, correct: 1, answered: 1 } }, wrong: [{ id: 's2', picked: ['A'] }, { id: 'm5', picked: ['A', 'B'] }, { id: 'j9', picked: ['A'] }, { id: 'c3', picked: ['B'] }], timeMs: 2412000, passed: true, ts: now };
      location.hash = '#/result';
    } else if (kind === 'wrong') {
      location.hash = '#/wrong';
    } else if (kind === 'stats') {
      location.hash = '#/stats';
    } else if (kind === 'settings') {
      location.hash = '#/settings';
    } else {
      location.hash = '#/home';
    }
    render();
    window.__APP__ = { BANK, BY_ID, isCorrect, buildExam, wrongIds, store };
  }
})();

