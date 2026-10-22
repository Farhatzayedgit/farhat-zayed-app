(() => {
'use strict';

/* ================= إعدادات ================= */
const LINKS = {
  youtube: 'https://www.youtube.com/@farhatzayedmusic',
  subscribe: 'https://www.youtube.com/@farhatzayedmusic?sub_confirmation=1',
  spotify: 'https://open.spotify.com/artist/1iqJZQtO4ucCF2Sev8w8oW',
  facebook: 'https://www.facebook.com/farhat.zoon/',
  instagram: 'https://www.instagram.com/farhatzayedofficiall/'
};
const AUDIO_CACHE = 'fz-audio';

/* أعمالنا التانية — لإضافة شغل جديد: ضيف عنصر هنا */
const WORKS = [
  { name: 'Movera Podcast', note: 'بودكاست', mark: 'MP', links: [
    { p: 'yt', url: 'https://www.youtube.com/@MoveraPodcast' },
    { p: 'fb', url: 'https://www.facebook.com/profile.php?id=61595351128257' } ] },
  { name: 'روح', note: 'قناة أغاني روح', mark: 'روح', links: [
    { p: 'yt', url: 'https://www.youtube.com/@rou7musicofficial' } ] },
  { name: 'محكمة الشلّة', note: 'برنامج كوميدي', mark: 'مح', links: [
    { p: 'yt', url: 'https://www.youtube.com/@MahkametElShella' } ] },
  { name: 'Movera Comics', note: 'شورتس كوميدي', mark: 'MC', links: [
    { p: 'fb', url: 'https://www.facebook.com/profile.php?id=61594201239094' } ] }
];

/* ================= بيانات ================= */
const SONGS = window.SONGS || [];
const BY_ID = {};
SONGS.forEach((s, i) => { s.i = i; BY_ID[s.id] = s; });

const $ = (s, r = document) => r.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cover = (s) => `covers/${s.id}.jpg`;
const src = (s) => `audio/${s.id}.mp3`;
const artist = (s) => s.f ? `فرحات زايد و${s.f}` : 'فرحات زايد';
const fmt = (sec) => { sec = Math.max(0, Math.floor(sec || 0)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
const store = {
  get(k, d) { try { const v = localStorage.getItem('fz.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('fz.' + k, JSON.stringify(v)); } catch (e) {} }
};

/* ================= أيقونات ================= */
const I = {
  play: '<svg class="fill" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>',
  pause: '<svg class="fill" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  prev: '<svg class="fill" viewBox="0 0 24 24"><path d="M19 5v14L8 12z"/><rect x="5" y="5" width="2.4" height="14" rx="1"/></svg>',
  next: '<svg class="fill" viewBox="0 0 24 24"><path d="M5 5v14l11-7z"/><rect x="16.6" y="5" width="2.4" height="14" rx="1"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>',
  repeat: '<svg viewBox="0 0 24 24"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
  music: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  video: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-3.5v11L16 14z"/></svg>',
  yt: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/></svg>',
  ext: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/><path d="M12 11v6"/><path d="m9.5 14.5 2.5 2.5 2.5-2.5"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  spin: '<svg class="spin" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
  people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.6 0 4.5 1.6 4.5 4.5"/></svg>',
  insta: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  waves: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M7 9.5c3.5-1 7-.6 10 1"/><path d="M7.8 12.7c2.8-.7 5.6-.4 8 .9"/><path d="M8.6 15.6c2.1-.5 4.1-.3 5.9.6"/></svg>',
  fbook: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M15.5 7.5h-2a2 2 0 0 0-2 2V21"/><path d="M9 12.5h6"/></svg>',
  install: '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M12 7v7"/><path d="m9 11 3 3 3-3"/></svg>'
};

/* ================= حالة ================= */
const audio = new Audio();
audio.preload = 'metadata';
const st = {
  queue: SONGS.map(s => s.id),
  cur: null,
  shuffle: store.get('shuffle', false),
  repeat: store.get('repeat', 'off'), // off | all | one
  favs: new Set(store.get('favs', [])),
  offline: new Set(),
  busy: {},          // id -> percent while saving offline
  filter: 'all',
  q: ''
};

/* ================= تشغيل ================= */
function load(id, autoplay = true, at = 0) {
  const s = BY_ID[id]; if (!s) return;
  st.cur = id;
  audio.src = src(s);
  if (at) audio.addEventListener('loadedmetadata', () => { audio.currentTime = at; }, { once: true });
  store.set('last', { id, t: at || 0 });
  setMeta(s);
  if (autoplay) audio.play().catch(() => {});
  if (route().name === 'player') {
    if (location.hash !== `#/song/${id}`) history.replaceState(null, '', `#/song/${id}`);
    render();
  }
  syncUI();
}
function playSong(id, list) {
  if (list) st.queue = list.slice();
  if (st.cur === id && audio.src) { audio.paused ? audio.play() : audio.pause(); return; }
  load(id, true);
}
function toggle(id) {
  if (id && id !== st.cur) { load(id, true); return; }
  if (!st.cur) { load(SONGS[0].id); return; }
  if (!audio.src) { const l = store.get('last', null); load(st.cur, true, l && l.id === st.cur ? l.t : 0); return; }
  audio.paused ? audio.play().catch(() => {}) : audio.pause();
}
function step(dir) {
  if (!st.cur) return;
  const q = st.queue.length ? st.queue : SONGS.map(s => s.id);
  let i = q.indexOf(st.cur);
  if (st.shuffle && q.length > 1) {
    let j; do { j = Math.floor(Math.random() * q.length); } while (j === i);
    i = j;
  } else {
    i = i + dir;
    if (i >= q.length) i = 0;
    if (i < 0) i = q.length - 1;
  }
  load(q[i], true);
}
audio.addEventListener('ended', () => {
  if (st.repeat === 'one') { audio.currentTime = 0; audio.play(); return; }
  const q = st.queue; const i = q.indexOf(st.cur);
  if (!st.shuffle && st.repeat === 'off' && i === q.length - 1) { syncUI(); return; }
  step(1);
});
['play', 'pause'].forEach(e => audio.addEventListener(e, syncUI));
audio.addEventListener('error', () => { if (st.cur) toast('مش قادر يشغّل الأغنية دلوقتي — اتأكد من النت'); syncUI(); });
let lastSave = 0;
audio.addEventListener('timeupdate', () => {
  tick();
  const now = Date.now();
  if (now - lastSave > 4000 && st.cur) { lastSave = now; store.set('last', { id: st.cur, t: audio.currentTime }); }
});
audio.addEventListener('loadedmetadata', tick);

function setMeta(s) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: s.t, artist: artist(s), album: 'فرحات زايد',
    artwork: [{ src: new URL(cover(s), location.href).href, sizes: '640x360', type: 'image/jpeg' }]
  });
}
if ('mediaSession' in navigator) {
  const ms = navigator.mediaSession;
  ms.setActionHandler('play', () => audio.play());
  ms.setActionHandler('pause', () => audio.pause());
  ms.setActionHandler('previoustrack', () => step(-1));
  ms.setActionHandler('nexttrack', () => step(1));
  try { ms.setActionHandler('seekto', (d) => { audio.currentTime = d.seekTime; }); } catch (e) {}
}

/* ================= واجهة ثابتة ================= */
const mini = $('#mini');
function syncUI() {
  const s = BY_ID[st.cur];
  const playing = !audio.paused;
  if (s) {
    mini.hidden = route().name === 'player';
    document.body.classList.toggle('has-mini', !mini.hidden);
    $('#miniCover').src = cover(s);
    $('#miniTitle').textContent = s.t;
    $('#miniSub').textContent = (playing ? 'بيشتغل — ' : '') + artist(s);
    $('#miniToggle').innerHTML = playing ? I.pause : I.play;
    $('#miniToggle').setAttribute('aria-label', playing ? 'إيقاف مؤقت' : 'تشغيل');
  }
  // زرار التشغيل الكبير
  const big = $('#pBig');
  if (big && big.dataset.id === st.cur) { big.innerHTML = playing ? I.pause : I.play; big.setAttribute('aria-label', playing ? 'إيقاف مؤقت' : 'تشغيل'); }
  // تمييز الأغنية الشغالة في القوايم
  document.querySelectorAll('.item[data-id]').forEach(el => {
    const on = el.dataset.id === st.cur;
    el.classList.toggle('playing', on);
    const eq = el.querySelector('.it-eq');
    if (on && !eq) el.querySelector('.it-art').insertAdjacentHTML('beforeend', '<span class="it-eq"><span class="eq"><i></i><i></i><i></i></span></span>');
    if (!on && eq) eq.remove();
    if (on) el.classList.toggle('paused', !playing);
  });
}
function tick() {
  const d = audio.duration || (BY_ID[st.cur] && BY_ID[st.cur].d) || 0;
  const p = d ? (audio.currentTime / d) * 100 : 0;
  $('#miniBar').style.width = p + '%';
  const r = $('#pSeek');
  if (r && r.dataset.id !== st.cur) return;
  if (r && !r.dataset.drag) { r.max = Math.floor(d); r.value = Math.floor(audio.currentTime); r.style.setProperty('--p', p + '%'); }
  const a = $('#pCur'), b = $('#pDur');
  if (a) a.textContent = fmt(audio.currentTime);
  if (b) b.textContent = fmt(d);
}

let tt;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ================= أوفلاين (التحميل جوه الأبليكيشن) ================= */
async function refreshOffline() {
  if (!('caches' in window)) return;
  try {
    const c = await caches.open(AUDIO_CACHE);
    const keys = await c.keys();
    st.offline = new Set(keys.map(k => (k.url.match(/audio\/(s\d+)\.mp3/) || [])[1]).filter(Boolean));
  } catch (e) {}
}
async function saveOffline(id) {
  const s = BY_ID[id];
  if (!('caches' in window)) { toast('المتصفح ده مش بيدعم الحفظ أوفلاين — استخدم «حمّل MP3»'); return; }
  if (st.busy[id] != null || st.offline.has(id)) return;
  st.busy[id] = 0; render();
  try {
    const res = await fetch(src(s));
    if (!res.ok) throw new Error(res.status);
    const total = +res.headers.get('content-length') || 0;
    const reader = res.body.getReader(); const parts = []; let got = 0;
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      parts.push(value); got += value.length;
      if (total) { const p = Math.round(got / total * 100); if (p !== st.busy[id]) { st.busy[id] = p; updateBusy(id); } }
    }
    const blob = new Blob(parts, { type: 'audio/mpeg' });
    const c = await caches.open(AUDIO_CACHE);
    await c.put(new URL(src(s), location.href).href, new Response(blob, { headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': String(blob.size) } }));
    st.offline.add(id);
    toast(`«${s.t}» اتحفظت — تشتغل من غير نت`);
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  } catch (e) {
    toast('التحميل وقف — جرّب تاني');
  }
  delete st.busy[id]; render();
}
async function removeOffline(id) {
  try { const c = await caches.open(AUDIO_CACHE); await c.delete(new URL(src(BY_ID[id]), location.href).href); } catch (e) {}
  st.offline.delete(id); toast('اتشالت من التحميلات'); render();
}
function updateBusy(id) {
  document.querySelectorAll(`[data-busy="${id}"]`).forEach(el => { el.textContent = `بيتحمّل… ${st.busy[id]}%`; });
}

/* ================= مفضلة ================= */
function toggleFav(id) {
  st.favs.has(id) ? st.favs.delete(id) : st.favs.add(id);
  store.set('favs', [...st.favs]);
  toast(st.favs.has(id) ? 'اتضافت للمفضلة' : 'اتشالت من المفضلة');
  render();
}

/* ================= قطع واجهة ================= */
const card = (s, list) => `
  <button class="card" data-act="play" data-id="${s.id}" data-list="${list}">
    <span class="card-art"><img loading="lazy" src="${cover(s)}" alt=""><span class="card-play">${I.play}</span></span>
    <span class="card-t">${esc(s.t)}</span>
    <span class="card-s">${esc(artist(s))}</span>
  </button>`;
const clipCard = (s) => `
  <a class="card" href="#/clip/${s.id}">
    <span class="card-art"><img loading="lazy" src="${cover(s)}" alt=""><span class="card-play">${I.yt}</span></span>
    <span class="card-t">${esc(s.t)}</span>
    <span class="card-s">${esc(artist(s))}</span>
  </a>`;
function item(s, list, extra = '') {
  const off = st.offline.has(s.id);
  const sub = st.busy[s.id] != null
    ? `<span data-busy="${s.id}">بيتحمّل… ${st.busy[s.id]}%</span>`
    : `${off ? `<span class="ok">${I.check}</span>` : ''}${esc(artist(s))} · ${fmt(s.d)}`;
  return `
  <div class="item${s.id === st.cur ? ' playing' : ''}" data-id="${s.id}">
    <button class="it-art" data-act="play" data-id="${s.id}" data-list="${list}" aria-label="شغّل ${esc(s.t)}"><img loading="lazy" src="${cover(s)}" alt=""></button>
    <button class="it-main" data-act="play" data-id="${s.id}" data-list="${list}" style="text-align:right">
      <span class="it-t">${esc(s.t)}</span><span class="it-s">${sub}</span>
    </button>
    ${extra || `<a class="icon-btn" href="#/song/${s.id}" aria-label="افتح ${esc(s.t)}">${I.back.replace('m9 6 6 6-6 6', 'm15 6-6 6 6 6')}</a>`}
  </div>`;
}
const LISTS = {
  all: () => SONGS,
  duets: () => SONGS.filter(s => s.f),
  helm: () => SONGS.filter(s => s.t.includes('شكله حلم')),
  favs: () => SONGS.filter(s => st.favs.has(s.id)),
  offline: () => SONGS.filter(s => st.offline.has(s.id))
};

/* ================= الشاشات ================= */
function vHome() {
  const n = SONGS[0];
  const last = store.get('last', null);
  return `
  <header class="top">
    <div class="hello"><small>أهلاً بيك في عالمي</small><span class="brand">فرحات زايد</span></div>
    <a class="logo" href="#/follow" aria-label="تابعني">FZ</a>
  </header>
  <section class="hero">
    <a class="hero-art" href="#/song/${n.id}">
      <img src="${cover(n)}" alt="">
      <span class="chip-new">أحدث إصدار</span>
      <span class="hero-txt"><b>${esc(n.t)}</b><span>${esc(artist(n))}</span></span>
    </a>
    <div class="row-btns">
      <button class="btn primary" data-act="play" data-id="${n.id}" data-list="all">${I.play}اسمعها</button>
      <a class="btn outline" href="#/clip/${n.id}">${I.video}شوف الكليب</a>
    </div>
  </section>
  ${last && BY_ID[last.id] && last.id !== n.id ? `
  <section class="sec"><div class="sec-head"><h2>كمّل من مكان ما وقفت</h2></div>
    <div class="list">${item(BY_ID[last.id], 'all')}</div></section>` : ''}
  <section class="sec">
    <div class="sec-head"><h2>الجديد</h2><a href="#/songs">عرض الكل</a></div>
    <div class="rail">${SONGS.slice(1, 11).map(s => card(s, 'all')).join('')}</div>
  </section>
  <section class="sec">
    <div class="sec-head"><h2>دويتوهات</h2><a href="#/songs?f=duets">عرض الكل</a></div>
    <div class="rail">${LISTS.duets().map(s => card(s, 'duets')).join('')}</div>
  </section>
  <section class="sec">
    <div class="sec-head"><h2>سلسلة «شكله حلم»</h2><a href="#/songs?f=helm">عرض الكل</a></div>
    <div class="rail">${LISTS.helm().map(s => card(s, 'helm')).join('')}</div>
  </section>
  <section class="sec">
    <div class="sec-head"><h2>كل الأغاني</h2><a href="#/songs">${SONGS.length} أغنية</a></div>
    <div class="list">${SONGS.slice(0, 6).map(s => item(s, 'all')).join('')}</div>
    <a class="more-link" href="#/songs">عرض كل الأغاني</a>
  </section>
  ${worksSection()}
  ${installCard()}`;
}

function vSongs(params) {
  if (params.f && LISTS[params.f]) st.filter = params.f;
  const base = LISTS[st.filter]();
  const q = st.q.trim();
  const list = q ? base.filter(s => (s.t + ' ' + s.f).includes(q)) : base;
  const chip = (k, t) => `<button class="chip" data-act="filter" data-f="${k}" aria-pressed="${st.filter === k}">${t}</button>`;
  return `
  <div class="page-head"><h1 class="page-title">الأغاني</h1><p class="page-sub">كل أغانيّ — كلامي وألحاني — في مكان واحد</p></div>
  <label class="search">${I.search}<input id="q" type="search" placeholder="دوّر على أغنية…" value="${esc(st.q)}" autocomplete="off" aria-label="بحث"></label>
  <div class="chips">${chip('all', 'الكل')}${chip('duets', 'دويتوهات')}${chip('helm', 'شكله حلم')}${chip('favs', 'المفضلة')}</div>
  <div class="count" id="count">${list.length} أغنية</div>
  <div class="list" id="songList">${list.length ? list.map(s => item(s, st.filter)).join('') :
    `<div class="empty">${I.heart}<div><b>${st.filter === 'favs' ? 'لسه مفيش أغاني في المفضلة' : 'مفيش نتايج'}</b>${st.filter === 'favs' ? 'دوس على القلب في صفحة أي أغنية عشان تلاقيها هنا.' : 'جرّب تكتب اسم الأغنية بطريقة تانية.'}</div></div>`}</div>`;
}

function vPlayer(params) {
  const s = BY_ID[params.id] || BY_ID[st.cur] || SONGS[0];
  const isCur = s.id === st.cur && !!audio.src;
  const playing = isCur && !audio.paused;
  const fav = st.favs.has(s.id);
  const off = st.offline.has(s.id);
  const busy = st.busy[s.id] != null;
  return `
  <div class="player">
    <div class="bar">
      <button class="icon-btn" data-act="back" aria-label="رجوع">${I.back}</button>
      <span class="muted">${playing ? 'بيشتغل دلوقتي' : 'فرحات زايد'}</span>
      <button class="icon-btn" data-act="share" data-id="${s.id}" aria-label="شارك الأغنية">${I.share}</button>
    </div>
    <div class="seg">
      <button aria-pressed="true">${I.music}صوت بس</button>
      <a href="#/clip/${s.id}">${I.video}فيديو كليب</a>
    </div>
    <div class="p-art"><img src="${cover(s)}" alt=""></div>
    <div class="p-meta">
      <div><h1 class="p-title">${esc(s.t)}</h1><div class="p-sub">${esc(artist(s))}</div></div>
      <button class="icon-btn ghost${fav ? ' on' : ''}" data-act="fav" data-id="${s.id}" aria-label="${fav ? 'شيلها من المفضلة' : 'ضيفها للمفضلة'}" aria-pressed="${fav}">${fav ? I.heartFill : I.heart}</button>
    </div>
    <div class="p-seek">
      <input id="pSeek" data-id="${s.id}" type="range" min="0" max="${s.d}" value="0" step="1" aria-label="مكان التشغيل">
      <div class="p-times"><span id="pCur">0:00</span><span id="pDur">${fmt(s.d)}</span></div>
    </div>
    <div class="p-ctrl">
      <button class="icon-btn sm${st.shuffle ? ' on' : ''}" data-act="shuffle" aria-label="عشوائي" aria-pressed="${st.shuffle}">${I.shuffle}</button>
      <button class="icon-btn mid" data-act="prev" aria-label="الأغنية اللي فاتت">${I.prev}</button>
      <button id="pBig" class="icon-btn big" data-act="toggle" data-id="${s.id}" aria-label="${playing ? 'إيقاف مؤقت' : 'تشغيل'}">${playing ? I.pause : I.play}</button>
      <button class="icon-btn mid" data-act="next" aria-label="الأغنية اللي بعدها">${I.next}</button>
      <button class="icon-btn sm${st.repeat !== 'off' ? ' on' : ''}${st.repeat === 'one' ? ' repeat-one' : ''}" data-act="repeat" aria-label="تكرار: ${{off:'مقفول',all:'كل الأغاني',one:'الأغنية دي'}[st.repeat]}">${I.repeat}</button>
    </div>
    <div class="p-actions">
      ${off ? `<button class="btn outline" data-act="unsave" data-id="${s.id}">${I.check}محفوظة أوفلاين</button>`
        : busy ? `<button class="btn outline" disabled><span data-busy="${s.id}">بيتحمّل… ${st.busy[s.id]}%</span></button>`
        : `<button class="btn outline" data-act="save" data-id="${s.id}">${I.cloud}احفظ أوفلاين</button>`}
      <a class="btn outline" href="${src(s)}" download="${esc(s.t)} - ${esc(artist(s))}.mp3">${I.down}حمّل MP3</a>
    </div>
  </div>`;
}

function vClips() {
  return `
  <div class="page-head"><h1 class="page-title">الكليبات</h1><p class="page-sub">بتشتغل من قناتي على يوتيوب</p></div>
  <div class="clip-grid">${SONGS.map(clipCard).join('')}</div>`;
}

function vClip(params) {
  const s = BY_ID[params.id] || SONGS[0];
  if (!audio.paused) audio.pause();
  const others = SONGS.filter(x => x.id !== s.id).slice(0, 6);
  return `
  <div class="bar">
    <button class="icon-btn" data-act="back" aria-label="رجوع">${I.back}</button>
    <h1>الفيديو كليب</h1>
    <button class="icon-btn" data-act="share" data-id="${s.id}" data-clip="1" aria-label="شارك الكليب">${I.share}</button>
  </div>
  <div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${s.yt}?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="${esc(s.t)} — الفيديو كليب" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
  <div class="yt-badge">${I.yt}بيشتغل من قناة فرحات زايد على يوتيوب</div>
  <div class="c-meta"><h2 class="p-title">${esc(s.t)}</h2><div class="p-sub">${esc(artist(s))}</div></div>
  <div class="grid3">
    <button class="tile" data-act="playgo" data-id="${s.id}">${I.music}اسمعها صوت بس</button>
    <a class="tile" href="${src(s)}" download="${esc(s.t)} - ${esc(artist(s))}.mp3">${I.down}حمّل الصوت</a>
    <a class="tile" href="https://www.youtube.com/watch?v=${s.yt}" target="_blank" rel="noopener">${I.ext}افتح في يوتيوب</a>
  </div>
  <section class="sec">
    <div class="sec-head"><h2>كليبات تانية</h2><a href="#/clips">عرض الكل</a></div>
    <div class="rail">${others.map(clipCard).join('')}</div>
  </section>`;
}

function vDownloads() {
  const list = LISTS.offline();
  const busy = Object.keys(st.busy).map(id => BY_ID[id]);
  const rm = (s) => `<button class="icon-btn" data-act="unsave" data-id="${s.id}" aria-label="شيل ${esc(s.t)} من التحميلات">${I.trash}</button>`;
  return `
  <div class="page-head"><h1 class="page-title">التحميلات</h1><p class="page-sub">اسمع أغانيك من غير نت</p></div>
  ${list.length > 1 ? `<div style="padding:0 20px 10px"><button class="btn primary block" data-act="play" data-id="${list[0].id}" data-list="offline">${I.play}شغّل كل التحميلات</button></div>` : ''}
  <div class="list">${busy.map(s => item(s, 'offline', '<span></span>')).join('')}${list.map(s => item(s, 'offline', rm(s))).join('')}</div>
  ${!list.length && !busy.length ? `<div class="empty">${I.cloud}<div><b>لسه مفيش أغاني متحمّلة</b>افتح أي أغنية ودوس «احفظ أوفلاين» عشان تشتغل من غير نت، أو «حمّل MP3» عشان تنزل الملف على موبايلك.</div></div>` : ''}
  <div class="empty" style="margin-top:12px">${I.down}<div><b>عايز الملف نفسه على موبايلك؟</b>من صفحة أي أغنية دوس «حمّل MP3» — الملف هينزل في فولدر التنزيلات وتقدر تشغّله من أي مشغّل.</div></div>`;
}

function vFollow() {
  const link = (href, ic, t, sub) => `<a class="link" href="${href}" target="_blank" rel="noopener"><span class="link-ic">${ic}</span><span class="link-tx"><b>${t}</b><span>${sub}</span></span>${I.ext}</a>`;
  return `
  <section class="prof">
    <div class="avatar" aria-hidden="true"><div>FZ</div></div>
    <span class="brand">فرحات زايد</span>
    <p>كل أغانيّ — كلامي وألحاني — في مكان واحد</p>
  </section>
  <div style="padding:18px 20px 0"><a class="btn primary block" href="${LINKS.subscribe}" target="_blank" rel="noopener">${I.yt}اشترك في القناة</a></div>
  <nav class="links" aria-label="حساباتي">
    ${link(LINKS.youtube, I.yt, 'يوتيوب', '@farhatzayedmusic')}
    ${link(LINKS.spotify, I.waves, 'سبوتيفاي', 'Farhat Zayed')}
    ${link(LINKS.facebook, I.people, 'فيسبوك', 'farhat.zoon')}
    ${link(LINKS.instagram, I.insta, 'إنستجرام', '@farhatzayedofficiall')}
  </nav>
  <div style="padding:14px 20px 0"><button class="btn outline block" data-act="shareapp">${I.share}ابعت الأبليكيشن لصحابك</button></div>
  ${installCard(true)}
  ${worksSection()}
  <p class="foot">التطبيق الرسمي · إنتاج Movera</p>
  ${isAdmin() ? `<p style="text-align:center;margin:10px 0 0"><a class="btn outline" style="display:inline-flex" href="admin.html">${I.music}لوحة التحكم — ضيف أغنية</a></p>` : ''}`;
}

// زرار لوحة التحكم بيظهر على جهاز صاحب الأبليكيشن بس (اللي ربط حسابه)
function isAdmin() { try { return !!localStorage.getItem('fz.admin.token'); } catch (e) { return false; } }

/* ================= أعمالنا التانية ================= */
function worksSection() {
  const P = { yt: { ic: I.yt, t: 'يوتيوب' }, fb: { ic: I.fbook, t: 'فيسبوك' } };
  return `
  <section class="sec" aria-labelledby="worksH">
    <div class="sec-head"><h2 id="worksH">أعمالنا التانية</h2></div>
    <div class="works">${WORKS.map(w => `
      <div class="work">
        <span class="work-mark" aria-hidden="true">${esc(w.mark)}</span>
        <span class="work-tx"><b>${esc(w.name)}</b><span>${esc(w.note)}</span></span>
        <span class="work-links">${w.links.map(l => `<a class="work-btn" href="${l.url}" target="_blank" rel="noopener" aria-label="${esc(w.name)} على ${P[l.p].t}">${P[l.p].ic}<span>${P[l.p].t}</span></a>`).join('')}</span>
      </div>`).join('')}
    </div>
  </section>`;
}

/* ================= تثبيت الأبليكيشن ================= */
let deferredPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; render(); });
window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('الأبليكيشن اتثبّت 🎉'); render(); });
function installCard(always) {
  if (isStandalone()) return '';
  if (!deferredPrompt && !isIOS && !always) return '';
  return `<div class="install"><img src="icons/icon-192.png" alt=""><div><b>ثبّت الأبليكيشن</b><span>يظهر على شاشة موبايلك زي أي أبليكيشن</span></div><button class="btn primary" data-act="install">${I.install}ثبّت</button></div>`;
}
async function doInstall() {
  if (deferredPrompt) { deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (e) {} deferredPrompt = null; render(); return; }
  const steps = isIOS
    ? '<li>افتح الصفحة دي من متصفح <b>Safari</b></li><li>دوس على زرار <b>المشاركة</b> (المربع اللي طالع منه سهم)</li><li>اختار <b>إضافة إلى الشاشة الرئيسية</b></li>'
    : '<li>افتح الصفحة دي من متصفح <b>Chrome</b></li><li>دوس على <b>⋮</b> فوق</li><li>اختار <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b></li>';
  const bg = document.createElement('div');
  bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="طريقة التثبيت"><h3>إزاي تثبّت الأبليكيشن</h3><ol>${steps}</ol><button class="btn primary block" data-close>تمام</button></div>`;
  bg.addEventListener('click', (e) => { if (e.target === bg || e.target.hasAttribute('data-close')) bg.remove(); });
  document.body.appendChild(bg);
}

/* ================= مشاركة ================= */
async function share(id, clip) {
  const base = location.href.split('#')[0];
  const s = id ? BY_ID[id] : null;
  const data = s
    ? { title: s.t, text: `اسمع «${s.t}» — ${artist(s)}`, url: clip ? `https://www.youtube.com/watch?v=${s.yt}` : `${base}#/song/${s.id}` }
    : { title: 'فرحات زايد', text: 'كل أغاني فرحات زايد في أبليكيشن واحد', url: base };
  if (navigator.share) { try { await navigator.share(data); } catch (e) {} return; }
  try { await navigator.clipboard.writeText(data.url); toast('اللينك اتنسخ'); } catch (e) { prompt('انسخ اللينك:', data.url); }
}

/* ================= راوتر ================= */
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  const name = parts[0] || 'home';
  if (name === 'song') return { name: 'player', params: { ...params, id: parts[1] } };
  if (name === 'clip') return { name: 'clip', params: { ...params, id: parts[1] } };
  return { name, params };
}
const VIEWS = { home: vHome, songs: vSongs, player: vPlayer, clips: vClips, clip: vClip, downloads: vDownloads, follow: vFollow };
const TAB = { home: 'home', songs: 'songs', player: 'songs', clips: 'clips', clip: 'clips', downloads: 'downloads', follow: 'follow' };
let lastRoute = '';
function render() {
  const r = route();
  const v = VIEWS[r.name] || vHome;
  const key = location.hash;
  const keepScroll = key === lastRoute;
  const y = window.scrollY;
  // ماتعيدش رسم الكليب لو شغال عشان الفيديو مايقفش
  if (keepScroll && r.name === 'clip') { syncUI(); return; }
  const view = $('#view');
  view.innerHTML = v(r.params);
  document.querySelectorAll('.tabs a').forEach(a => { if (a.dataset.tab === TAB[r.name]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  lastRoute = key;
  bindView(r);
  syncUI(); tick();
}
function bindView(r) {
  const q = $('#q');
  if (q) q.addEventListener('input', () => {
    st.q = q.value;
    const base = LISTS[st.filter]();
    const t = st.q.trim();
    const list = t ? base.filter(s => (s.t + ' ' + s.f).includes(t)) : base;
    $('#songList').innerHTML = list.length ? list.map(s => item(s, st.filter)).join('') : `<div class="empty">${I.search}<div><b>مفيش نتايج</b>جرّب تكتب اسم الأغنية بطريقة تانية.</div></div>`;
    $('#count').textContent = `${list.length} أغنية`;
    syncUI();
  });
  const seek = $('#pSeek');
  if (seek) {
    seek.addEventListener('input', () => { seek.dataset.drag = 1; const d = +seek.max || 1; seek.style.setProperty('--p', (seek.value / d * 100) + '%'); $('#pCur').textContent = fmt(seek.value); });
    seek.addEventListener('change', () => {
      delete seek.dataset.drag;
      if (seek.dataset.id !== st.cur || !audio.src) { load(seek.dataset.id, true, +seek.value); return; }
      audio.currentTime = +seek.value;
    });
  }
}
window.addEventListener('hashchange', render);

/* ================= أحداث ================= */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const id = el.dataset.id;
  switch (el.dataset.act) {
    case 'play': {
      const listKey = el.dataset.list || 'all';
      const list = (LISTS[listKey] ? LISTS[listKey]() : SONGS).map(s => s.id);
      playSong(id, list); break;
    }
    case 'playgo': load(id, true); location.hash = '#/player'; break;
    case 'toggle': toggle(id); break;
    case 'prev': if (audio.src && audio.currentTime > 4) audio.currentTime = 0; else step(-1); break;
    case 'next': step(1); break;
    case 'shuffle': st.shuffle = !st.shuffle; store.set('shuffle', st.shuffle); toast(st.shuffle ? 'التشغيل العشوائي شغال' : 'التشغيل العشوائي اتقفل'); render(); break;
    case 'repeat': st.repeat = { off: 'all', all: 'one', one: 'off' }[st.repeat]; store.set('repeat', st.repeat); toast({ off: 'التكرار اتقفل', all: 'تكرار كل الأغاني', one: 'تكرار الأغنية دي' }[st.repeat]); render(); break;
    case 'fav': toggleFav(id); break;
    case 'save': saveOffline(id); break;
    case 'unsave': removeOffline(id); break;
    case 'filter': st.filter = el.dataset.f; if (location.hash !== '#/songs') location.hash = '#/songs'; else render(); break;
    case 'share': share(id, el.dataset.clip); break;
    case 'shareapp': share(null); break;
    case 'install': doInstall(); break;
    case 'back': if (history.length > 1) history.back(); else location.hash = '#/'; break;
  }
});
$('#miniToggle').addEventListener('click', () => toggle());

/* ================= بداية ================= */
(function init() {
  const last = store.get('last', null);
  if (last && BY_ID[last.id]) { st.cur = last.id; setMeta(BY_ID[last.id]); }
  refreshOffline().then(render);
  render();
  if ('serviceWorker' in navigator) {
    // لما ينزل تحديث جديد للأبليكيشن، الصفحة تتحدّث لوحدها مرة واحدة
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded || !audio.paused) return;
      reloaded = true; location.reload();
    });
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
  }
})();
})();
