/* Partie Double — moteur : navigation, exercices, widgets, atelier, entraînement. */
(() => {
'use strict';
const {PCG, NIVEAUX, MODULES, LEXIQUE, TEST, ATELIER, J, T} = window.PD;
const A = window.PDA = {}; /* espace partagé avec plus.js (jeu, tableau de bord, assistant) */
/* Intitulé d'un compte ; un numéro abrégé (4457) prend celui du premier compte qui le prolonge */
const lab = n => window.PD.lab(n) || (String(n).length >= 3 && (PCG.find(a => a[0].startsWith(n)) || [])[1]) || '';
const V = document.getElementById('vue');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const fmt = n => (Math.round(n * 100) / 100).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const f0 = n => Math.round(n).toLocaleString('fr-FR');
const num = s => { const v = parseFloat(String(s).replace(/[\s  €]/g, '').replace(',', '.').replace('−', '-')); return isFinite(v) ? v : 0; };
const sum = (X, g = x => x) => X.reduce((s, x) => s + g(x), 0);
const pick = X => X[Math.floor(Math.random() * X.length)];
let _id = 0; const uid = () => 'c' + (++_id);
const NAT = Object.fromEntries(PCG.map(a => [a[0], a[2]]));
const nature = n => { let k = String(n); while (k && !NAT[k]) k = k.slice(0, -1); return NAT[k] || ''; };
const sens = t => ({A: 'D', C: 'D', RM: 'D', P: 'C', R: 'C', AM: 'C', CM: 'C'}[t] || '');
const NOMNAT = {A: 'Actif', P: 'Passif', C: 'Charge', R: 'Produit', AM: 'En moins de l\'actif', CM: 'En moins des charges', RM: 'En moins des produits', X: 'Variable'};

/* ── état, gardé dans ce navigateur ── */
const KEY = 'partie-double-v1';
const S = {ok: {}, atelier: null, test: null, best: {}, xp: 0, jours: {}, badges: {}, flags: {}, qv: {}, vu: {}, finis: {}, cartes: {}, nbCartes: 0, exam: {}, temps: 0, dern: null, sem: null, but: 30, nom: '', err: {}, prem: {}, notes: {}, son: true, theme: 'sombre', libre: false, hist: [], vid: {}, xl: {}};
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* stockage indisponible */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* idem */ } };
MODULES.forEach(m => m.ex.forEach((e, i) => { e._k = m.id + ':' + i; }));
const TOTAL = sum(MODULES, m => m.ex.length);
const faits = m => m.ex.filter((_, i) => S.ok[m.id + ':' + i]).length;
function majProg() {
  const n = sum(MODULES, faits);
  $('#pbar').style.width = (100 * n / TOTAL) + '%';
  $('#ptxt').textContent = n + ' / ' + TOTAL + ' exercices';
}
$('#pcg').innerHTML = PCG.map(a => `<option value="${a[0]}">${esc(a[1])}</option>`).join('');

/* ══════════ EXERCICES ══════════ */
const rate = fb => fb.dispatchEvent(new Event('rate', {bubbles: true}));
const say = (fb, ok, html) => { fb.className = 'fb ' + (ok ? 'ok' : 'ko'); fb.innerHTML = html; };

/* Grille de saisie d'une écriture */
function grille(n) {
  const el = h('<div class="scroll"><table class="ge"><thead><tr><th>Compte</th><th>Débit</th><th>Crédit</th></tr></thead><tbody></tbody><tfoot><tr><td><button type="button" class="lien">+ Ajouter une ligne</button></td><td class="m td">0,00</td><td class="m tc">0,00</td></tr></tfoot></table></div>');
  const tb = $('tbody', el), tab = $('table', el);
  const get = () => $$('tr', tb).map(tr => { const [a, d, c] = $$('input', tr); return {a: (a.value.match(/\d+/) || [''])[0], d: num(d.value), c: num(c.value), tr}; });
  const tot = () => { const X = get(), d = sum(X, l => l.d), c = sum(X, l => l.c); $('.td', el).textContent = fmt(d); $('.tc', el).textContent = fmt(c); tab.classList.toggle('eq', d > 0 && Math.abs(d - c) < .005); };
  const add = () => {
    const i = uid();
    const tr = h(`<tr><td><input id="a${i}" class="cpt" list="pcg" placeholder="N° ou nom du compte" autocomplete="off" aria-label="Compte"><small></small></td><td><input id="d${i}" class="mt" inputmode="decimal" autocomplete="off" aria-label="Montant au débit"></td><td><input id="e${i}" class="mt" inputmode="decimal" autocomplete="off" aria-label="Montant au crédit"></td></tr>`);
    const [a, d, c] = $$('input', tr);
    a.addEventListener('input', () => { const k = (a.value.match(/\d+/) || [''])[0]; $('small', tr).textContent = k ? lab(k) : ''; });
    d.addEventListener('input', tot); c.addEventListener('input', tot);
    tb.append(tr);
  };
  for (let i = 0; i < n; i++) add();
  $('.lien', el).addEventListener('click', add);
  const vider = () => { tb.innerHTML = ''; for (let i = 0; i < n; i++) add(); tot(); };
  return {el, get, vider};
}

const pareil = (u, e) => u === e;
const proche = (u, e) => u && (u.startsWith(e) || (e.startsWith(u) && u.length >= (e.length >= 5 ? 4 : 3)));

/* Corrige une écriture saisie par rapport aux lignes attendues */
function corrige(lignes, att) {
  const U = lignes.filter(l => l.a || l.d || l.c), msgs = [];
  lignes.forEach(l => l.tr.classList.remove('ok', 'ko'));
  if (U.length < 2) return {ok: false, msgs: ['Une écriture comporte au moins deux lignes : un débit et un crédit.']};
  const td = sum(U, l => l.d), tc = sum(U, l => l.c);
  if (Math.abs(td - tc) > .005) msgs.push(`L'écriture n'est pas équilibrée : ${fmt(td)} au débit, ${fmt(tc)} au crédit.`);
  const pris = new Set();
  const cherche = (a, test) => U.findIndex((l, k) => !pris.has(k) && test(l.a, a));
  att.forEach(([a, d, c]) => {
    let i = cherche(a, pareil); if (i < 0) i = cherche(a, proche);
    if (i < 0) { msgs.push(`Il manque un compte de la classe ${a[0]}.`); return; }
    pris.add(i); const l = U[i], bon = d ? l.d : l.c, autre = d ? l.c : l.d, m = d || c;
    if (!(bon > 0) || autre > 0) { l.tr.classList.add('ko'); msgs.push(`${l.a} ${lab(l.a)} : ce compte est du mauvais côté.`); }
    else if (Math.abs(bon - m) > .005) { l.tr.classList.add('ko'); msgs.push(`${l.a} ${lab(l.a)} : bon côté, mais le montant est à revoir.`); }
    else l.tr.classList.add('ok');
  });
  U.forEach((l, k) => { if (!pris.has(k)) { l.tr.classList.add('ko'); msgs.push(l.a ? `Le compte ${l.a} ${lab(l.a)} n'est pas attendu ici.` : 'Une ligne n\'a pas de compte.'); } });
  return {ok: !msgs.length, msgs};
}

const TYPES = {
  qcm(ex, c, fb, done) {
    const box = h('<div class="opts"></div>');
    ex.o.forEach((o, i) => {
      const b = h(`<button type="button">${o}</button>`);
      b.addEventListener('click', () => {
        if (i === ex.r) { b.classList.add('ok'); $$('button', box).forEach(x => x.disabled = true); say(fb, true, '<b>Exact.</b> ' + ex.e); done(); }
        else { b.classList.add('ko'); b.disabled = true; rate(fb); say(fb, false, 'Pas tout à fait. Relisez l\'énoncé et essayez une autre réponse.'); }
      });
      box.append(b);
    });
    c.append(box);
  },
  tri(ex, c, fb, done) {
    const box = h('<div class="tri"></div>'), rep = [];
    ex.items.forEach(([nom], i) => {
      const l = h(`<div class="l"><span>${nom}</span><div class="seg" role="group" aria-label="${esc(nom)}"></div></div>`);
      ex.cats.forEach((cat, k) => {
        const b = h(`<button type="button" aria-pressed="false">${cat}</button>`);
        b.addEventListener('click', () => { rep[i] = k; $$('button', l).forEach((x, j) => x.setAttribute('aria-pressed', j === k)); l.classList.remove('ok', 'ko'); });
        $('.seg', l).append(b);
      });
      box.append(l);
    });
    const btn = h('<button type="button" class="btn">Vérifier</button>');
    btn.addEventListener('click', () => {
      let faux = 0;
      $$('.l', box).forEach((l, i) => { const ok = rep[i] === ex.items[i][1]; l.classList.toggle('ok', ok); l.classList.toggle('ko', !ok); if (!ok) faux++; });
      if (!faux) { say(fb, true, '<b>Tout est juste.</b> ' + ex.e); done(); }
      else { rate(fb); say(fb, false, faux === 1 ? 'Une réponse est à revoir : elle est signalée en rouge.' : faux + ' réponses sont à revoir : elles sont signalées en rouge.'); }
    });
    c.append(box, btn);
  },
  calcul(ex, c, fb, done) {
    const i = uid(); let essais = 0;
    const box = h(`<form class="saisie"><input id="${i}" inputmode="decimal" autocomplete="off" aria-label="Votre réponse"><span>${ex.u || ''}</span><button class="btn">Vérifier</button></form>`);
    box.addEventListener('submit', e => {
      e.preventDefault();
      const brut = $('input', box).value.trim();
      if (!brut) { say(fb, false, 'Saisissez un nombre.'); return; }
      if (Math.abs(num(brut) - ex.r) <= (ex.tol || .01)) { say(fb, true, '<b>Exact.</b> ' + ex.e); done(); return; }
      essais++; rate(fb);
      say(fb, false, 'Ce n\'est pas le bon montant. ' + (ex.h ? '<b>Indice :</b> ' + ex.h : 'Reprenez le calcul étape par étape.') + (essais >= 2 ? ' <button type="button" class="lien">Voir la réponse</button>' : ''));
      const v = $('.lien', fb); if (v) v.addEventListener('click', () => say(fb, false, '<b>Réponse : ' + fmt(ex.r).replace(',00', '') + ' ' + (ex.u || '') + '.</b> ' + ex.e + ' Saisissez-la pour valider l\'exercice.'));
    });
    c.append(box);
  },
  ecriture(ex, c, fb, done) {
    const g = grille(ex.l.length); let essais = 0;
    const act = h('<div class="act"><button type="button" class="btn">Vérifier l\'écriture</button></div>');
    $('.btn', act).addEventListener('click', () => {
      const r = corrige(g.get(), ex.l);
      if (r.ok) { say(fb, true, '<b>Écriture exacte.</b> ' + ex.e); done(); return; }
      essais++; rate(fb);
      say(fb, false, '<ul>' + r.msgs.map(m => '<li>' + esc(m) + '</li>').join('') + '</ul>' + (essais >= 2 ? '<button type="button" class="lien">Voir la correction</button>' : ''));
      const v = $('.lien', fb); if (v) v.addEventListener('click', () => say(fb, false, '<b>Correction.</b> ' + ex.e + J(ex.l) + 'Recopiez-la pour valider l\'exercice : écrire le geste aide à le retenir.'));
    });
    c.append(g.el, act);
  }
};

function exo(ex, key, i, n, apres) {
  const el = h(`<section class="exo" id="exercice-${i + 1}"><div class="exo-h"><span class="tag">Exercice ${i + 1} / ${n}</span><span class="etat"></span><button type="button" class="lien aide">Un coup de pouce ?</button></div><p class="q">${ex.q}</p><div class="corps"></div><div class="fb" aria-live="polite"></div></section>`);
  const marque = () => { el.classList.add('fait'); $('.etat', el).textContent = 'Réussi'; $('.aide', el).hidden = true; };
  if (key && S.ok[key]) marque();
  $('.aide', el).addEventListener('click', () => A.demander('Aide-moi à démarrer cet exercice, étape par étape, sans me donner tout de suite la réponse : ' + ex.q));
  let compte = false;
  el.addEventListener('rate', () => A.erreur(ex._k));
  TYPES[ex.t](ex, $('.corps', el), $('.fb', el), () => {
    const neuf = key ? !S.ok[key] : !compte; compte = true;
    A.reussite(ex._k, !key);
    if (key) { S.ok[key] = 1; save(); majProg(); }
    marque(); el.classList.add('pop');
    if (apres) apres(neuf);
  });
  return el;
}

/* ══════════ WIDGETS ══════════ */
const tuile = (l, v) => `<div><small>${l}</small><b>${v}</b></div>`;
const WID = {
  tva(el) {
    const a = uid(), b = uid(), c = uid();
    el.innerHTML = `<div class="w"><h4>Calculette de TVA</h4><div class="wf"><label for="${a}">Montant en €<input id="${a}" value="1 000" inputmode="decimal"></label><label for="${b}">Ce montant est<select id="${b}"><option value="ht">hors taxes</option><option value="ttc">toutes taxes comprises</option></select></label><label for="${c}">Taux<select id="${c}"><option value="20">20 %</option><option value="10">10 %</option><option value="5.5">5,5 %</option><option value="2.1">2,1 %</option></select></label></div><div class="tuiles"></div><div class="barre"><i style="background:var(--debit)"></i><i style="background:var(--credit)"></i></div><div class="leg"><span><i style="background:var(--debit)"></i>Hors taxes</span><span><i style="background:var(--credit)"></i>TVA</span></div></div>`;
    const maj = () => {
      const m = num($('#' + a).value), t = num($('#' + c).value) / 100, ht = $('#' + b).value === 'ht' ? m : m / (1 + t), tva = ht * t;
      $('.tuiles', el).innerHTML = tuile('Hors taxes', fmt(ht) + ' €') + tuile('TVA', fmt(tva) + ' €') + tuile('TTC', fmt(ht + tva) + ' €');
      const [x, y] = $$('.barre i', el); x.style.width = (100 / (1 + t)) + '%'; y.style.width = (100 * t / (1 + t)) + '%';
    };
    el.addEventListener('input', maj); maj();
  },
  amort(el) {
    const a = uid(), b = uid(), c = uid(), mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    el.innerHTML = `<div class="w"><h4>Plan d'amortissement linéaire</h4><div class="wf"><label for="${a}">Coût d'acquisition HT en €<input id="${a}" value="24 000" inputmode="decimal"></label><label for="${b}">Durée d'utilisation<select id="${b}">${[3, 4, 5, 6, 8, 10].map(n => `<option value="${n}"${n === 5 ? ' selected' : ''}>${n} ans</option>`).join('')}</select></label><label for="${c}">Mise en service le 1er<select id="${c}">${mois.map((m, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${m}</option>`).join('')}</select></label></div><div class="scroll"><table class="tb"><thead><tr><th>Exercice</th><th class="m">Dotation</th><th class="m">Cumul</th><th class="m">Valeur nette</th></tr></thead><tbody></tbody></table></div><p class="verdict"></p></div>`;
    const maj = () => {
      const base = num($('#' + a).value), n = +$('#' + b).value, m0 = +$('#' + c).value, an = base / n, L = [];
      let cum = 0;
      for (let k = 0; k <= n; k++) {
        const part = k === 0 ? (12 - m0) / 12 : k === n ? m0 / 12 : 1;
        if (!part) continue;
        cum += an * part; L.push(`<tr><td>N${k ? '+' + k : ''}${part < 1 ? ` <small>(${Math.round(part * 12)} mois)</small>` : ''}</td><td class="m">${fmt(an * part)}</td><td class="m">${fmt(cum)}</td><td class="m">${fmt(Math.max(0, base - cum))}</td></tr>`);
      }
      $('tbody', el).innerHTML = L.join('');
      $('.verdict', el).textContent = `Annuité complète : ${fmt(an)} €. ` + (m0 ? `La première année ne compte que ${12 - m0} mois ; les ${m0} mois manquants sont rattrapés sur un exercice de plus.` : 'Mise en service au 1er janvier : toutes les annuités sont complètes.');
    };
    el.addEventListener('input', maj); maj();
  },
  paie(el) {
    const a = uid(), b = uid();
    el.innerHTML = `<div class="w"><h4>Du brut au net, et au coût employeur</h4><div class="wf"><label for="${a}">Salaire brut mensuel : <b class="mono vb"></b><input id="${a}" type="range" min="1800" max="8000" step="100" value="3000"></label><label for="${b}">Prélèvement à la source (taux simplifié, sur le brut)<select id="${b}"><option value="0">0 %</option><option value="3" selected>3 %</option><option value="6">6 %</option><option value="10">10 %</option></select></label></div><div class="tuiles"></div><div class="barre"><i style="background:var(--good)"></i><i style="background:var(--muted)"></i><i style="background:var(--debit)"></i><i style="background:var(--credit)"></i></div><div class="leg"><span><i style="background:var(--good)"></i>Net à payer</span><span><i style="background:var(--muted)"></i>Impôt prélevé</span><span><i style="background:var(--debit)"></i>Cotisations salariales (22 %)</span><span><i style="background:var(--credit)"></i>Cotisations patronales (40 %)</span></div></div>`;
    const maj = () => {
      const br = +$('#' + a).value, cs = br * .22, pas = br * (+$('#' + b).value) / 100, cp = br * .4, net = br - cs - pas, tot = br + cp;
      $('.vb', el).textContent = f0(br) + ' €';
      $('.tuiles', el).innerHTML = tuile('Net à payer', fmt(net) + ' €') + tuile('Brut (641)', fmt(br) + ' €') + tuile('Charges patronales (645)', fmt(cp) + ' €') + tuile('Coût total employeur', fmt(tot) + ' €');
      [net, pas, cs, cp].forEach((v, i) => $$('.barre i', el)[i].style.width = (100 * v / tot) + '%');
    };
    el.addEventListener('input', maj); maj();
  },
  emprunt(el) {
    const a = uid(), b = uid(), c = uid();
    el.innerHTML = `<div class="w"><h4>Échéancier à mensualités constantes</h4><div class="wf"><label for="${a}">Capital emprunté en €<input id="${a}" value="50 000" inputmode="decimal"></label><label for="${b}">Taux annuel en %<input id="${b}" value="4" inputmode="decimal"></label><label for="${c}">Durée<select id="${c}">${[2, 3, 5, 7, 10, 15].map(n => `<option value="${n}"${n === 5 ? ' selected' : ''}>${n} ans</option>`).join('')}</select></label></div><div class="tuiles"></div><div class="scroll"><table class="tb"><thead><tr><th>Échéance</th><th class="m">Intérêts (6611)</th><th class="m">Capital (164)</th><th class="m">Reste dû</th></tr></thead><tbody></tbody></table></div></div>`;
    const maj = () => {
      const C = num($('#' + a).value), r = num($('#' + b).value) / 1200, n = +$('#' + c).value * 12;
      const mens = r ? C * r / (1 - Math.pow(1 + r, -n)) : C / n; let du = C, ti = 0; const L = [];
      for (let k = 1; k <= n; k++) {
        const int = du * r, cap = mens - int; du -= cap; ti += int;
        if (k <= 3 || k === n) L.push(`${k === n ? '<tr><td colspan="4" style="text-align:center;color:var(--muted)">…</td></tr>' : ''}<tr><td>n° ${k}</td><td class="m">${fmt(int)}</td><td class="m">${fmt(cap)}</td><td class="m">${fmt(Math.abs(du) < .005 ? 0 : du)}</td></tr>`);
      }
      $('.tuiles', el).innerHTML = tuile('Mensualité', fmt(mens) + ' €') + tuile('Total des intérêts', fmt(ti) + ' €') + tuile('Coût en % du capital', C ? fmt(100 * ti / C) + ' %' : '–');
      $('tbody', el).innerHTML = L.join('');
    };
    el.addEventListener('input', maj); maj();
  },
  bulletin(el) { A.bulletin(el); },
  sig(el) {
    const F = [['vm', 'Ventes de marchandises', 500000], ['ca', 'Coût d\'achat des marchandises vendues', 300000], ['pr', 'Production vendue', 100000], ['ce', 'Consommations en provenance des tiers', 90000], ['it', 'Impôts et taxes', 10000], ['cp', 'Charges de personnel', 130000], ['do', 'Dotations aux amortissements', 25000], ['rf', 'Résultat financier', -5000], ['is', 'Impôt sur les bénéfices', 10000]];
    const ids = Object.fromEntries(F.map(x => [x[0], uid()]));
    el.innerHTML = `<div class="w"><h4>La cascade des soldes</h4><div class="wf">${F.map(([k, l, v]) => `<label for="${ids[k]}">${l}<input id="${ids[k]}" value="${f0(v)}" inputmode="decimal"></label>`).join('')}</div><div class="casc"></div><p class="verdict"></p></div>`;
    const maj = () => {
      const v = Object.fromEntries(F.map(x => [x[0], num($('#' + ids[x[0]]).value)]));
      const mc = v.vm - v.ca, va = mc + v.pr - v.ce, ebe = va - v.it - v.cp, rex = ebe - v.do, rc = rex + v.rf, rn = rc - v.is, caf = rn + v.do, ca = v.vm + v.pr || 1;
      const X = [['Chiffre d\'affaires', v.vm + v.pr], ['Marge commerciale', mc], ['Valeur ajoutée', va], ['Excédent brut d\'exploitation', ebe], ['Résultat d\'exploitation', rex], ['Résultat courant avant impôt', rc], ['Résultat net', rn], ['Capacité d\'autofinancement', caf]];
      $('.casc', el).innerHTML = X.map(([l, x]) => `<div><span>${l}</span><i class="${x < 0 ? 'neg' : ''}" style="width:${Math.min(100, Math.abs(100 * x / ca))}%"></i><span>${f0(x)} €</span></div>`).join('');
      $('.verdict', el).textContent = `EBE : ${fmt(100 * ebe / ca)} % du chiffre d'affaires. Résultat net : ${fmt(100 * rn / ca)} %.` + (ebe < 0 ? ' L\'exploitation perd de l\'argent avant même les amortissements.' : '');
    };
    el.addEventListener('input', maj); maj();
  },
  frbfr(el) {
    const F = [['cp', 'Capitaux propres', 120], ['df', 'Emprunts', 80], ['ai', 'Immobilisations', 150], ['st', 'Stocks', 40], ['cl', 'Créances clients', 70], ['de', 'Dettes d\'exploitation', 60]];
    const ids = Object.fromEntries(F.map(x => [x[0], uid()]));
    el.innerHTML = `<div class="w"><h4>L'équilibre financier, en milliers d'euros</h4><div class="wf">${F.map(([k, l, v]) => `<label for="${ids[k]}">${l} : <b class="mono" data-v="${k}"></b><input id="${ids[k]}" type="range" min="0" max="300" step="5" value="${v}"></label>`).join('')}</div><div class="casc"></div><p class="verdict"></p></div>`;
    const maj = () => {
      const v = Object.fromEntries(F.map(x => [x[0], +$('#' + ids[x[0]]).value]));
      F.forEach(x => $(`[data-v="${x[0]}"]`, el).textContent = v[x[0]] + ' k€');
      const fr = v.cp + v.df - v.ai, bfr = v.st + v.cl - v.de, tn = fr - bfr, max = Math.max(1, Math.abs(fr), Math.abs(bfr), Math.abs(tn));
      $('.casc', el).innerHTML = [['Fonds de roulement', fr], ['Besoin en fonds de roulement', bfr], ['Trésorerie nette', tn]].map(([l, x]) => `<div><span>${l}</span><i class="${x < 0 ? 'neg' : ''}" style="width:${100 * Math.abs(x) / max}%"></i><span>${x} k€</span></div>`).join('');
      $('.verdict', el).textContent = fr < 0 ? 'Fonds de roulement négatif : des immobilisations sont financées par des dettes à court terme. Situation fragile.' : tn < 0 ? 'Le fonds de roulement ne couvre pas le besoin d\'exploitation : l\'écart est financé par du découvert.' : bfr < 0 ? 'BFR négatif : les fournisseurs financent l\'exploitation, comme dans la grande distribution.' : 'Le fonds de roulement couvre le besoin d\'exploitation : la trésorerie est positive.';
    };
    el.addEventListener('input', maj); maj();
  }
};

/* ══════════ VUES ══════════ */
function accueil() {
  const reprise = MODULES.find(m => faits(m) < m.ex.length), entame = sum(MODULES, faits) > 0;
  V.innerHTML = `
  <section class="hero">
    <div>
      <h1>Tout s'écrit <em>deux fois.</em></h1>
      <p>Apprenez la comptabilité française en pratiquant : ${MODULES.length} modules, du premier bilan à l'analyse financière. De vraies écritures à passer, une correction à chaque ligne, des points et des badges pour tenir le rythme.</p>
      <div class="cta">
        <a class="btn" href="#${reprise ? reprise.id : 'atelier'}">${entame ? 'Reprendre : ' + (reprise ? reprise.t : 'l\'Atelier') : 'Commencer au début'}</a>
        <a class="btn sec" href="#test">${S.test ? 'Refaire le test de niveau' : 'Trouver mon niveau en 8 questions'}</a>
      </div>
    </div>
    <div class="carte demo" id="demo"></div>
  </section>
  ${A.bandeau()}
  ${NIVEAUX.map(n => `<section class="niv${S.test && S.test.niv === n.n ? ' reco' : ''}" id="niveau-${n.n}">
    <div class="niv-h"><span class="num">Niveau ${n.n} · ${n.t}</span><h2>${n.s}</h2><p>${n.d}</p></div>
    <div class="mods">${MODULES.filter(m => m.niv === n.n).map(m => { const k = faits(m), t = m.ex.length; const lk = !A.ouvert(m); return `<a class="mod${k === t ? ' fini' : ''}${lk ? ' verrou' : ''}" href="#${m.id}"${lk ? ' aria-label="' + esc(m.t) + ', verrouillé"' : ''}><span class="k">${String(MODULES.indexOf(m) + 1).padStart(2, '0')} · ${m.min} min${lk ? ' · verrouillé' : ''}</span><h3>${m.t}</h3><div class="av"><b><i style="width:${100 * k / t}%"></i></b><span>${k === t ? 'Terminé' : k + ' / ' + t}</span></div></a>`; }).join('')}</div>
  </section>`).join('')}
  <p class="note">Les taux et les seuils cités sont ceux en vigueur en France en 2026 ; plusieurs sont simplifiés pour l'apprentissage. Votre progression est enregistrée dans ce navigateur uniquement. <button type="button" class="lien" id="raz">Effacer ma progression</button></p>`;
  demo($('#demo'));
  const raz = $('#raz');
  raz.addEventListener('click', () => {
    if (raz.dataset.sur) { Object.assign(S, {ok: {}, test: null, best: {}, xp: 0, jours: {}, badges: {}, flags: {}, qv: {}, vu: {}, finis: {}, cartes: {}, nbCartes: 0, exam: {}, temps: 0, dern: null, sem: null, err: {}, prem: {}, notes: {}, hist: [], vid: {}, xl: {}}); save(); go(); }
    else { raz.dataset.sur = 1; raz.textContent = 'Cliquez encore pour confirmer l\'effacement'; }
  });
}

/* Démonstration d'ouverture : le bilan reste équilibré à chaque opération */
function demo(el) {
  const OPS = [
    ['Les associés apportent 10 000 € sur le compte bancaire.', 'Banque', 'Capital', {Banque: 10000}, {Capital: 10000}],
    ['La banque prête 5 000 € à la société.', 'Banque', 'Emprunt', {Banque: 5000}, {Emprunt: 5000}],
    ['Naelys achète une machine 4 000 €, payée par virement.', 'Machine', 'Banque', {Machine: 4000, Banque: -4000}, {}],
    ['Naelys achète 2 000 € de marchandises, payables dans 30 jours.', 'Stock', 'Fournisseurs', {Stock: 2000}, {Fournisseurs: 2000}]
  ];
  let k = 3;
  el.innerHTML = `<h2>Quatre opérations, un bilan toujours équilibré</h2><p class="op"></p><div class="bilh"><span style="color:var(--debit)">Actif · ce qu'elle possède</span><span style="color:var(--credit)">Passif · d'où ça vient</span></div><div class="bil"><div class="a"></div><div class="p"></div></div><div class="bilt"><span class="ta"></span><span class="tp"></span></div><div class="pas"><button type="button" class="btn sec" data-d="-1">Précédente</button><span class="pts">${OPS.map(() => '<i></i>').join('')}</span><button type="button" class="btn" data-d="1">Suivante</button></div>`;
  const maj = () => {
    const A = {}, P = {};
    OPS.slice(0, k).forEach(o => { for (const x in o[3]) A[x] = (A[x] || 0) + o[3][x]; for (const x in o[4]) P[x] = (P[x] || 0) + o[4][x]; });
    const col = X => Object.entries(X).map(([n, v]) => `<div class="bl" style="--v:${v}"><span>${n}</span><b class="mono">${f0(v)}</b></div>`).join('');
    const o = OPS[k - 1];
    $('.op', el).innerHTML = `<b>Opération ${k} sur 4.</b> ${o[0]}<br><span class="mono" style="font-size:.85rem"><span style="color:var(--debit)">Débit ${o[1]}</span> · <span style="color:var(--credit)">Crédit ${o[2]}</span></span>`;
    $('.a', el).innerHTML = col(A); $('.p', el).innerHTML = col(P);
    $('.ta', el).textContent = 'Total ' + f0(sum(Object.values(A))) + ' €'; $('.tp', el).textContent = 'Total ' + f0(sum(Object.values(P))) + ' €';
    $$('.pts i', el).forEach((i, j) => i.classList.toggle('on', j < k));
    $('[data-d="-1"]', el).disabled = k === 1; $('[data-d="1"]', el).disabled = k === OPS.length;
  };
  $$('.pas button', el).forEach(b => b.addEventListener('click', () => { k += +b.dataset.d; maj(); }));
  maj();
}

function moduleVue(m) {
  const i = MODULES.indexOf(m), niv = NIVEAUX[m.niv - 1], prec = MODULES[i - 1], suiv = MODULES[i + 1];
  if (!A.ouvert(m)) {
    V.innerHTML = `<div class="etroit"><p class="fil"><a href="#parcours">Parcours</a> › Niveau ${niv.n} · ${niv.t}</p><h1 class="titre">${m.t}</h1>
    <div class="verre bloc" style="margin-top:18px"><h2>Ce module n'est pas encore débloqué</h2><p>Réussissez au moins la moitié des exercices de « ${prec.t} » pour l'ouvrir. Vous pouvez aussi passer le test de niveau, ou activer le mode libre dans le tableau de bord.</p>
    <div class="act"><a class="btn" href="#${prec.id}">Aller à « ${prec.t} »</a><a class="btn sec" href="#test">Passer le test de niveau</a></div></div></div>`;
    return;
  }
  V.innerHTML = `<article class="lecon etroit">
    <p class="fil"><a href="#parcours">Parcours</a> › Niveau ${niv.n} · ${niv.t} › Module ${i + 1} sur ${MODULES.length}</p>
    <h1>${m.t}</h1><p class="chapo">${m.chapo}</p>
    <div class="jalons" id="jal" aria-hidden="true"></div>
    <div id="etapes"></div>
    <div class="act" id="suite"><button type="button" class="btn" id="cont">Continuer</button><button type="button" class="lien" id="toutv">Tout afficher d'un coup</button></div>
    <div id="apres" hidden>
      <section class="videos"><h2>Pour aller plus loin</h2><div class="vids" id="vids"></div><div class="act"><button type="button" class="btn sec" id="fiche">Télécharger la fiche pratique</button><span class="fb" id="fiche-fb"></span></div></section>
      <section class="notes"><h2><label for="note">Mes notes</label></h2><textarea id="note" rows="4" placeholder="Ce que je retiens, mes questions, mes moyens mnémotechniques…"></textarea><small id="note-etat">Enregistrées automatiquement.</small></section>
      <h2 class="exos-h">À vous</h2><div id="exos"></div><div id="bravo"></div>
    </div>
    <div class="fin">${prec ? `<a class="btn sec" href="#${prec.id}">← ${prec.t}</a>` : '<span></span>'}${suiv ? `<a class="btn" href="#${suiv.id}">${suiv.t} →</a>` : '<a class="btn" href="#atelier">Passer à l\'Atelier →</a>'}</div>
  </article>`;
  /* La leçon se découvre étape par étape ; schémas et questions de Naelys s'intercalent */
  const X = (window.PD.PLUS || {})[m.id] || {}, parts = m.h.split(/(?=<h2>)/).map(s => s.trim()).filter(Boolean), nP = parts.length;
  let vu = faits(m) === m.ex.length ? nP : Math.max(1, Math.min(nP, S.vu[m.id] || 1));
  const E = $('#etapes');
  parts.forEach((p, k) => {
    const s = h(`<section class="etape" hidden>${p}${X.s && X.s[0] === k ? X.s[1] : ''}</section>`);
    (X.q || []).filter(q => q[0] === k).forEach((q, j) => s.append(A.bulle(q, m.id + ':' + k + ':' + j)));
    const ax = A.atelierXL(m.id, k); if (ax) s.append(ax);
    E.append(s);
  });
  $('#jal').innerHTML = parts.map(() => '<i></i>').join('');
  const montre = anime => {
    $$('.etape', E).forEach((s, k) => { if (k < vu && s.hidden) { s.hidden = false; if (anime) { s.classList.add('entre'); s.scrollIntoView({behavior: 'smooth', block: 'start'}); } } });
    $$('#jal i').forEach((d, k) => d.classList.toggle('on', k < vu));
    $('#suite').hidden = vu >= nP; $('#apres').hidden = vu < nP;
    if ((S.vu[m.id] || 0) < vu) { S.vu[m.id] = vu; save(); }
  };
  $('#cont').addEventListener('click', () => { vu++; montre(true); });
  $('#toutv').addEventListener('click', () => { vu = nP; montre(false); });
  montre(false);
  A.ctx = {t: m.t, texte: E.textContent.replace(/\s+/g, ' ').slice(0, 3500)};
  A.videos($('#vids'), m.id, X.v || []);
  const note = $('#note'); note.value = S.notes[m.id] || ''; let tn;
  note.addEventListener('input', () => { clearTimeout(tn); $('#note-etat').textContent = 'Enregistrement…'; tn = setTimeout(() => { if (note.value.trim()) S.notes[m.id] = note.value; else delete S.notes[m.id]; save(); $('#note-etat').textContent = 'Enregistrées automatiquement.'; }, 600); });
  $('#fiche').addEventListener('click', () => A.fiche(m, $('#fiche-fb')));
  $$('[data-w]', V).forEach(el => WID[el.dataset.w](el));
  const bravo = neuf => {
    if (neuf) A.gain(10, 'ex', m.t);
    if (faits(m) === m.ex.length && !S.finis[m.id]) { S.finis[m.id] = 1; A.gain(20, 'mod', m.t); }
    if (faits(m) === m.ex.length) $('#bravo').innerHTML = `<div class="bravo">Module terminé : les ${m.ex.length} exercices sont réussis. ${suiv ? 'Vous pouvez passer à la suite.' : 'Vous êtes au bout du parcours. L\'Atelier et l\'Entraînement vous attendent pour entretenir le geste.'}</div>`; };
  m.ex.forEach((ex, k) => $('#exos').append(exo(ex, m.id + ':' + k, k, m.ex.length, bravo)));
  bravo();
}

function testVue() {
  V.innerHTML = `<div class="etroit"><h1 class="titre">Trouver mon niveau</h1><p class="sous">Huit questions, deux par niveau. Répondez sans chercher : « Je ne sais pas » est une réponse utile.</p><div id="qs"></div><div class="act"><button type="button" class="btn" id="fin">Voir mon résultat</button></div><div class="fb" id="res" aria-live="polite"></div></div>`;
  const rep = [];
  TEST.forEach((q, i) => {
    const el = h(`<section class="exo"><div class="exo-h"><span class="tag">Question ${i + 1} / ${TEST.length}</span></div><p class="q">${q.q}</p><div class="opts"></div></section>`);
    q.o.forEach((o, k) => { const b = h(`<button type="button">${o}</button>`); b.addEventListener('click', () => { rep[i] = k; $$('button', el).forEach((x, j) => x.classList.toggle('ok', j === k)); }); $('.opts', el).append(b); });
    $('#qs').append(el);
  });
  $('#fin').addEventListener('click', () => {
    if (TEST.some((_, i) => rep[i] === undefined)) { say($('#res'), false, 'Il reste des questions sans réponse.'); return; }
    let niv = 5;
    for (let n = 1; n <= 4; n++) if (TEST.filter((q, i) => q.niv === n && rep[i] === q.r).length < 2) { niv = n; break; }
    const bon = TEST.filter((q, i) => rep[i] === q.r).length;
    S.test = {niv: Math.min(niv, 4), bon}; save();
    const N = NIVEAUX[Math.min(niv, 4) - 1], prem = MODULES.find(m => m.niv === N.n);
    say($('#res'), true, `<b>${bon} bonnes réponses sur 8.</b> ${niv === 5 ? 'Vous maîtrisez les bases de chaque niveau. Allez directement aux modules d\'analyse et au cas de synthèse.' : niv === 1 ? 'Commencez au niveau 1 : tout le reste s\'appuie dessus.' : `Les niveaux précédents semblent acquis. Votre point de départ conseillé : niveau ${N.n}, ${N.s.toLowerCase()}.`}<p><a class="btn" href="#${prem.id}">Commencer : ${prem.t}</a></p>`);
  });
}

/* ── Atelier : journal libre et états en direct ── */
const ecritures = () => S.atelier || (S.atelier = ATELIER.map(e => ({...e, base: 1})));
function soldes(E) {
  const m = {};
  E.forEach(e => e.l.forEach(([a, d, c]) => { (m[a] = m[a] || {d: 0, c: 0}).d += d; m[a].c += c; }));
  return Object.keys(m).sort().map(a => ({a, d: m[a].d, c: m[a].c, s: m[a].d - m[a].c}));
}
function etats(E) {
  const act = [], pas = [], ch = [], pr = [];
  soldes(E).forEach(x => {
    if (Math.abs(x.s) < .005) return;
    const k = x.a[0];
    if (k === '6') ch.push([x.a, x.s]); else if (k === '7') pr.push([x.a, -x.s]);
    else if (k === '1') pas.push([x.a, -x.s]);
    else if (k === '2' || k === '3' || nature(x.a) === 'AM') act.push([x.a, x.s]);
    else (x.s > 0 ? act : pas).push([x.a, Math.abs(x.s)]);
  });
  const res = sum(pr, x => x[1]) - sum(ch, x => x[1]);
  if (Math.abs(res) > .005) pas.splice(pas.filter(x => x[0][0] === '1').length, 0, ['', res]);
  return {act, pas, ch, pr, res};
}
const ligne = ([a, v]) => `<tr><td class="n">${a}</td><td>${a ? lab(a) : 'Résultat de l\'exercice (' + (v < 0 ? 'perte' : 'bénéfice') + ')'}</td><td class="m${v < 0 ? ' neg' : ''}">${fmt(v)}</td></tr>`;
const etat = (titre, X, tot) => `<div class="scroll"><table class="tb"><thead><tr><th colspan="2">${titre}</th><th class="m">€</th></tr></thead><tbody>${X.map(ligne).join('') || '<tr><td colspan="3">Aucun mouvement</td></tr>'}</tbody><tfoot><tr><td colspan="2">${tot}</td><td class="m">${fmt(sum(X, x => x[1]))}</td></tr></tfoot></table></div>`;

function atelier() {
  let onglet = 'journal';
  V.innerHTML = `<h1 class="titre">L'Atelier</h1><p class="sous">La comptabilité de janvier d'Atelier Lumen, société fictive. Ajoutez vos propres écritures et regardez le grand livre, la balance, le bilan et le compte de résultat se mettre à jour.</p>
  <div class="deux"><div><div class="tabs" role="tablist">${[['journal', 'Journal'], ['livre', 'Grand livre'], ['balance', 'Balance'], ['bilan', 'Bilan'], ['resultat', 'Résultat']].map(([k, l]) => `<button type="button" role="tab" data-k="${k}">${l}</button>`).join('')}</div><div id="zone"></div></div>
  <aside class="carte"><h2 style="font-size:1.15rem;margin-bottom:10px">Passer une écriture</h2><div class="wf"><label for="adate">Date<input id="adate" value="31/01"></label><label for="alib" style="flex:3 1 200px">Libellé<input id="alib" placeholder="Ex. : facture d'électricité"></label></div><div id="agr"></div><div class="act"><button type="button" class="btn" id="aok">Enregistrer</button><button type="button" class="lien" id="araz">Revenir aux écritures de départ</button></div><div class="fb" id="afb" aria-live="polite"></div>
  <p style="font-size:.85rem;color:var(--muted);margin:14px 0 0">Idées à essayer : payer le fournisseur de marchandises, encaisser le solde du client, enregistrer une facture d'assurance, passer la déclaration de TVA du mois.</p></aside></div>`;
  const g = grille(3); $('#agr').append(g.el);
  const rendu = () => {
    const E = ecritures(), Z = $('#zone');
    $$('.tabs button', V).forEach(b => b.setAttribute('aria-selected', b.dataset.k === onglet));
    if (onglet === 'journal') {
      Z.innerHTML = E.map((e, i) => `<div class="ecr"><header><span><b>${esc(e.d)}</b> · ${esc(e.lib)}</span>${e.base ? '' : `<button type="button" class="lien" data-x="${i}">Supprimer</button>`}</header>${J(e.l).replace('class="scroll"', 'class="scroll" style="margin:0"')}</div>`).join('');
      $$('[data-x]', Z).forEach(b => b.addEventListener('click', () => { E.splice(+b.dataset.x, 1); save(); rendu(); }));
    } else if (onglet === 'livre') {
      const M = {};
      E.forEach(e => e.l.forEach(([a, d, c]) => { (M[a] = M[a] || [[], []])[d ? 0 : 1].push([e.d, d || c]); }));
      Z.innerHTML = '<div class="cols">' + Object.keys(M).sort().map(a => T(a + ' ' + lab(a), M[a][0], M[a][1])).join('') + '</div>';
    } else if (onglet === 'balance') {
      const B = soldes(E);
      Z.innerHTML = `<div class="scroll"><table class="tb"><thead><tr><th>Compte</th><th>Intitulé</th><th class="m">Débit</th><th class="m">Crédit</th><th class="m">Solde débiteur</th><th class="m">Solde créditeur</th></tr></thead><tbody>${B.map(x => `<tr><td class="n">${x.a}</td><td>${lab(x.a)}</td><td class="m">${fmt(x.d)}</td><td class="m">${fmt(x.c)}</td><td class="m">${x.s > 0 ? fmt(x.s) : ''}</td><td class="m">${x.s < 0 ? fmt(-x.s) : ''}</td></tr>`).join('')}</tbody><tfoot><tr><td colspan="2">Totaux</td><td class="m">${fmt(sum(B, x => x.d))}</td><td class="m">${fmt(sum(B, x => x.c))}</td><td class="m">${fmt(sum(B, x => Math.max(0, x.s)))}</td><td class="m">${fmt(sum(B, x => Math.max(0, -x.s)))}</td></tr></tfoot></table></div>`;
    } else {
      const X = etats(E);
      Z.innerHTML = onglet === 'bilan'
        ? `<div class="deux">${etat('Actif', X.act, 'Total actif')}${etat('Passif', X.pas, 'Total passif')}</div><p class="verdict">Les deux totaux sont égaux parce que chaque écriture était équilibrée. Les amortissements et dépréciations apparaissent en négatif à l'actif.</p>`
        : `<div class="deux">${etat('Charges', X.ch, 'Total charges')}${etat('Produits', X.pr, 'Total produits')}</div><p class="verdict">${X.res < 0 ? 'Perte' : 'Bénéfice'} de ${fmt(Math.abs(X.res))} €. Le même montant figure au passif du bilan.</p>`;
    }
  };
  $$('.tabs button', V).forEach(b => b.addEventListener('click', () => { onglet = b.dataset.k; rendu(); }));
  $('#aok').addEventListener('click', () => {
    const fb = $('#afb'), U = g.get().filter(l => l.a || l.d || l.c), td = sum(U, l => l.d), tc = sum(U, l => l.c);
    const err = U.length < 2 ? 'Il faut au moins deux lignes.' : U.some(l => !/^[1-7]\d+$/.test(l.a)) ? 'Chaque ligne doit porter un numéro de compte des classes 1 à 7.' : U.some(l => (l.d > 0) === (l.c > 0)) ? 'Chaque ligne porte un montant, soit au débit, soit au crédit.' : Math.abs(td - tc) > .005 ? `Écriture déséquilibrée : ${fmt(td)} au débit, ${fmt(tc)} au crédit.` : '';
    if (err) { say(fb, false, err); return; }
    ecritures().push({d: $('#adate').value.trim() || '31/01', lib: $('#alib').value.trim() || 'Opération diverse', l: U.map(l => [l.a, l.d, l.c])});
    save(); g.vider(); $('#alib').value = ''; onglet = 'journal'; rendu();
    say(fb, true, 'Écriture enregistrée en bas du journal. Ouvrez le bilan pour voir son effet.');
    A.badge('atelier');
  });
  const raz = $('#araz');
  raz.addEventListener('click', () => {
    if (raz.dataset.sur) { S.atelier = null; save(); delete raz.dataset.sur; raz.textContent = 'Revenir aux écritures de départ'; rendu(); }
    else { raz.dataset.sur = 1; raz.textContent = 'Confirmer : supprimer mes écritures'; }
  });
  rendu();
}

/* ── Entraînement : exercices générés à l'infini ── */
const mont = () => pick([200, 350, 500, 800, 1200, 1500, 2400, 3000, 4500, 6000, 7500, 9000]);
const GEN = [
  () => { const x = mont(); return ['Facture d\'achat de marchandises : ' + f0(x) + ' € HT, TVA 20 %.', [['607', x, 0], ['44566', x * .2, 0], ['401', 0, x * 1.2]]]; },
  () => { const x = mont(); return ['Facture de vente de marchandises : ' + f0(x) + ' € HT, TVA 20 %.', [['411', x * 1.2, 0], ['707', 0, x], ['44571', 0, x * .2]]]; },
  () => { const x = mont(); return ['Facture de prestation de services à un client : ' + f0(x) + ' € HT, TVA 20 %.', [['411', x * 1.2, 0], ['706', 0, x], ['44571', 0, x * .2]]]; },
  () => { const x = mont(); return ['Un client règle par virement une facture de ' + f0(x * 1.2) + ' €.', [['512', x * 1.2, 0], ['411', 0, x * 1.2]]]; },
  () => { const x = mont(); return ['Vous payez par virement une facture fournisseur de ' + f0(x * 1.2) + ' €.', [['401', x * 1.2, 0], ['512', 0, x * 1.2]]]; },
  () => { const x = mont(); return ['Facture de loyer du local : ' + f0(x) + ' € HT, TVA 20 %.', [['6132', x, 0], ['44566', x * .2, 0], ['401', 0, x * 1.2]]]; },
  () => { const x = mont(); return ['Facture d\'honoraires de l\'expert-comptable : ' + f0(x) + ' € HT, TVA 20 %.', [['6226', x, 0], ['44566', x * .2, 0], ['401', 0, x * 1.2]]]; },
  () => { const x = mont() * 4; return ['Acquisition d\'une machine industrielle : ' + f0(x) + ' € HT, TVA 20 %.', [['2154', x, 0], ['44562', x * .2, 0], ['404', 0, x * 1.2]]]; },
  () => { const x = mont() * 10; return ['La banque débloque un emprunt de ' + f0(x) + ' €.', [['512', x, 0], ['164', 0, x]]]; },
  () => { const x = mont(); return ['Dotation aux amortissements du matériel de transport : ' + f0(x) + ' €.', [['6811', x, 0], ['28182', 0, x]]]; },
  () => { const x = mont(); return ['À la clôture, ' + f0(x) + ' € de prime d\'assurance concernent l\'exercice suivant.', [['486', x, 0], ['616', 0, x]]]; },
  () => { const x = mont(), i = Math.round(x * .15); return ['Échéance d\'emprunt de ' + f0(x) + ' €, dont ' + f0(i) + ' € d\'intérêts.', [['164', x - i, 0], ['6611', i, 0], ['512', 0, x]]]; },
  () => { const x = mont(), y = Math.round(x * .6); return ['Déclaration de TVA : collectée ' + f0(x) + ' €, déductible sur biens et services ' + f0(y) + ' €.', [['44571', x, 0], ['44566', 0, y], ['44551', 0, x - y]]]; }
];
function entrainement() {
  let mode = 'dc', serie = 0;
  V.innerHTML = `<div class="etroit">${A.onglets('entrainement')}<h1 class="titre">Entraînement</h1><p class="sous">Des questions tirées au hasard, sans fin. Le but : que le geste devienne un réflexe. Chaque bonne réponse rapporte 2 XP.</p><div class="tabs" role="tablist">${[['dc', 'Débit ou crédit ?'], ['cl', 'Quelle classe ?'], ['ec', 'Écriture express'], ['tv', 'Calcul de TVA']].map(([k, l]) => `<button type="button" role="tab" data-k="${k}">${l}</button>`).join('')}</div><div class="score"><span>Série en cours : <b id="ser">0</b></span><span>Meilleure série : <b id="best">0</b></span></div><div id="jeu"></div></div>`;
  const score = ok => { serie = ok ? serie + 1 : 0; if (ok) A.gain(2, 'tr', 'Entraînement'); if (serie > (S.best[mode] || 0)) { S.best[mode] = serie; save(); } $('#ser').textContent = serie; $('#best').textContent = S.best[mode] || 0; };
  const tour = () => {
    const Z = $('#jeu'); Z.innerHTML = '';
    $$('.tabs button', V).forEach(b => b.setAttribute('aria-selected', b.dataset.k === mode));
    $('#ser').textContent = serie; $('#best').textContent = S.best[mode] || 0;
    const suite = (ok, html) => { score(ok); const fb = h('<div class="fb"></div>'); say(fb, ok, html + ' <button type="button" class="btn" style="margin-left:8px">Question suivante</button>'); Z.append(fb); $$('.gros button', Z).forEach(b => b.disabled = true); const n = $('.btn', fb); n.addEventListener('click', tour); n.focus(); };
    if (mode === 'dc') {
      const a = pick(PCG.filter(x => sens(x[2]))), bon = sens(a[2]);
      Z.append(h(`<div class="exo"><p class="tag">Ce compte augmente au…</p><p class="cible"><small>${a[0]}</small>${a[1]}</p><div class="gros"><button type="button" class="D" data-r="D">Débit</button><button type="button" class="C" data-r="C">Crédit</button></div></div>`));
      $$('.gros button', Z).forEach(b => b.addEventListener('click', () => suite(b.dataset.r === bon, (b.dataset.r === bon ? '<b>Exact.</b> ' : '<b>Non.</b> ') + `${NOMNAT[a[2]]} : ce compte augmente au ${bon === 'D' ? 'débit' : 'crédit'}.`)));
    } else if (mode === 'cl') {
      const a = pick(PCG), noms = ['capitaux', 'immobilisations', 'stocks', 'tiers', 'financiers', 'charges', 'produits'];
      Z.append(h(`<div class="exo"><p class="tag">Dans quelle classe se range…</p><p class="cible">${a[1]}</p><div class="gros">${[1, 2, 3, 4, 5, 6, 7].map(n => `<button type="button" data-r="${n}">${n}</button>`).join('')}</div></div>`));
      $$('.gros button', Z).forEach(b => b.addEventListener('click', () => suite(b.dataset.r === a[0][0], (b.dataset.r === a[0][0] ? '<b>Exact.</b> ' : '<b>Non.</b> ') + `Compte ${a[0]}, classe ${a[0][0]} : ${noms[a[0][0] - 1]}.`)));
    } else if (mode === 'ec') {
      const [q, l] = pick(GEN)(), g = grille(l.length), box = h(`<div class="exo"><p class="tag">Passez l'écriture</p><p class="q">${q}</p><div class="corps"></div><div class="act"><button type="button" class="btn">Vérifier</button><button type="button" class="lien">Voir la correction et passer</button></div><div class="fb" aria-live="polite"></div></div>`);
      $('.corps', box).append(g.el); Z.append(box);
      const fin = (ok, html) => { $$('.act button', box).forEach(b => b.disabled = true); suite(ok, html); };
      $('.btn', box).addEventListener('click', () => { const r = corrige(g.get(), l); if (r.ok) fin(true, '<b>Écriture exacte.</b>'); else say($('.fb', box), false, '<ul>' + r.msgs.map(m => '<li>' + esc(m) + '</li>').join('') + '</ul>'); });
      $('.lien', box).addEventListener('click', () => { $('.fb', box).className = 'fb'; $('.fb', box).innerHTML = J(l); fin(false, 'Voici la correction.'); });
    } else {
      const t = pick([20, 20, 10, 5.5]), ht = mont(), versTTC = Math.random() < .5, ttc = Math.round(ht * (100 + t)) / 100, r = versTTC ? ttc : ht, i = uid();
      const box = h(`<div class="exo"><p class="tag">TVA à ${String(t).replace('.', ',')} %</p><p class="q">${versTTC ? `Montant hors taxes : ${fmt(ht)} €. Quel est le montant TTC ?` : `Montant TTC : ${fmt(ttc)} €. Quel est le montant hors taxes ?`}</p><form class="saisie"><input id="${i}" inputmode="decimal" autocomplete="off" aria-label="Votre réponse"><span>€</span><button class="btn">Vérifier</button></form></div>`);
      Z.append(box);
      $('form', box).addEventListener('submit', e => { e.preventDefault(); const ok = Math.abs(num($('input', box).value) - r) < .011; $('form .btn', box).disabled = true; suite(ok, (ok ? '<b>Exact.</b> ' : `<b>Non : ${fmt(r)} €.</b> `) + (versTTC ? `${fmt(ht)} × ${String(1 + t / 100).replace('.', ',')}` : `${fmt(ttc)} ÷ ${String(1 + t / 100).replace('.', ',')}`) + '.'); });
    }
  };
  $$('.tabs button', V).forEach(b => b.addEventListener('click', () => { mode = b.dataset.k; serie = 0; tour(); }));
  tour();
}

function planVue() {
  let cl = '';
  V.innerHTML = `<h1 class="titre">Plan comptable</h1><p class="sous">Les ${PCG.length} comptes utilisés dans le parcours, avec leur nature et le côté où ils augmentent. Le plan comptable général complet en compte plusieurs centaines.</p><div class="filtres"><input id="pq" placeholder="Chercher un numéro ou un mot : 411, TVA, stock…" aria-label="Chercher un compte"><div class="seg" role="group" aria-label="Filtrer par classe"><button type="button" data-c="" aria-pressed="true">Toutes</button>${[1, 2, 3, 4, 5, 6, 7].map(n => `<button type="button" data-c="${n}" aria-pressed="false">${n}</button>`).join('')}</div></div><div class="scroll"><table class="tb"><thead><tr><th>N°</th><th>Intitulé</th><th>Nature</th><th>Augmente au</th><th>Se lit au</th></tr></thead><tbody id="pt"></tbody></table></div>`;
  const maj = () => {
    const q = $('#pq').value.trim().toLowerCase();
    const X = PCG.filter(a => (!cl || a[0][0] === cl) && (!q || a[0].startsWith(q) || a[1].toLowerCase().includes(q)));
    $('#pt').innerHTML = X.map(a => { const s = sens(a[2]); return `<tr><td class="n">${a[0]}</td><td>${a[1]}</td><td>${NOMNAT[a[2]]}</td><td>${s ? `<span class="pill ${s}">${s === 'D' ? 'Débit' : 'Crédit'}</span>` : 'Selon le cas'}</td><td>${a[0][0] > 5 ? 'Résultat' : 'Bilan'}</td></tr>`; }).join('') || '<tr><td colspan="5">Aucun compte ne correspond. Essayez un autre mot ou une autre classe.</td></tr>';
  };
  $('#pq').addEventListener('input', maj);
  $$('.seg button', V).forEach(b => b.addEventListener('click', () => { cl = b.dataset.c; $$('.seg button', V).forEach(x => x.setAttribute('aria-pressed', x === b)); maj(); }));
  maj();
}

function lexiqueVue() {
  V.innerHTML = `<div class="etroit"><h1 class="titre">Lexique</h1><p class="sous">${LEXIQUE.length} termes à connaître, dans l'ordre alphabétique.</p><div class="filtres"><input id="lq" placeholder="Chercher un terme…" aria-label="Chercher un terme"></div><dl class="lex" id="ll"></dl></div>`;
  const maj = () => { const q = $('#lq').value.trim().toLowerCase(); $('#ll').innerHTML = LEXIQUE.filter(x => !q || (x[0] + ' ' + x[1]).toLowerCase().includes(q)).sort((a, b) => a[0].localeCompare(b[0], 'fr')).map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('') || '<p>Aucun terme ne correspond.</p>'; };
  $('#lq').addEventListener('input', maj); maj();
}

/* ── navigation par ancre ── */
const ROUTES = {parcours: accueil, atelier, entrainement, 'plan-comptable': planVue, lexique: lexiqueVue, test: testVue};
function go() {
  const k = location.hash.slice(1), m = MODULES.find(x => x.id === k);
  if (!m && !ROUTES[k] && k && document.getElementById(k)) return; /* ancre interne à la vue */
  A.ctx = null; if (A.quitte) { A.quitte(); A.quitte = null; }
  V.classList.remove('vue-in'); void V.offsetWidth; V.classList.add('vue-in');
  (m ? () => moduleVue(m) : ROUTES[k] || accueil)();
  const cur = m || k === 'test' || !ROUTES[k] ? 'parcours' : (A.NAV[k] || k);
  $$('.top nav a').forEach(a => a.getAttribute('href') === '#' + cur ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  const actif = $('.top nav a[aria-current]'), nav = $('.top nav'); if (actif && nav) nav.scrollLeft = Math.max(0, actif.offsetLeft - nav.offsetLeft - (nav.clientWidth - actif.offsetWidth) / 2);
  majProg(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', go);
Object.assign(A, {S, save, $, $$, h, esc, fmt, f0, num, sum, pick, uid, lab, faits, TOTAL, majProg, ROUTES, V, exo, say, tuile, NAV: {}, start: go});
})();
(() => {
})();
