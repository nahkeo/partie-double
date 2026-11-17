/* Partie Double — jeu (XP, badges, séries, défis), tableau de bord, révision, cartes mémoire,
   examens blancs, certificats, assistant, vidéos, fiches et classement. Chargé après app.js. */
(() => {
'use strict';
const A = window.PDA, {S, save, $, $$, h, esc, fmt, f0, num, sum, pick, uid, lab, faits, TOTAL, majProg, ROUTES, V, exo, say} = A;
const {MODULES, NIVEAUX, LEXIQUE, PCG, TEST} = window.PD;

/* ══════════ CONTENU ADDITIONNEL PAR MODULE ══════════
   q : questions de Vania [étape, affirmation, vrai ?, explication] · v : recherches vidéo · s : [étape, schéma] */
const flux = (X, leg) => `<figure class="sch"><div class="flux">${X.map(x => `<span>${x[0]}<small>${x[1] || ''}</small></span>`).join('<i aria-hidden="true">→</i>')}</div>${leg ? `<figcaption>${leg}</figcaption>` : ''}</figure>`;
const blocs = (g, d, G, D, leg) => `<figure class="sch"><div class="blocs"><div class="ga"><h5>${g}</h5>${G.map(x => `<p><b>${x[0]}</b>${x[1]}</p>`).join('')}</div><div class="dr"><h5>${d}</h5>${D.map(x => `<p><b>${x[0]}</b>${x[1]}</p>`).join('')}</div></div><figcaption>${leg}</figcaption></figure>`;
window.PD.PLUS = {
'm-pourquoi': {q: [[1, 'Le compte de résultat décrit le patrimoine de l\'entreprise à une date précise.', false, 'C\'est le bilan qui est une photo. Le compte de résultat raconte toute une période.'], [2, 'Un emprunt bancaire est une ressource pour l\'entreprise.', true, 'Il dit d\'où vient l\'argent, même s\'il faudra le rembourser.']],
  s: [2, flux([['Ressources', 'capital, emprunts, dettes'], ['Entreprise', ''], ['Emplois', 'machines, stocks, banque']], 'L\'argent entre par les ressources et se retrouve dans les emplois : les deux totaux sont égaux.')],
  v: ['comptabilité générale cours débutant introduction', 'à quoi sert la comptabilité d\'entreprise', 'bilan et compte de résultat expliqués simplement']},
'm-bilan': {q: [[0, 'Une créance sur un client fait partie de l\'actif.', true, 'C\'est de l\'argent qu\'on doit à l\'entreprise.'], [1, 'Le capital est une dette de l\'entreprise envers sa banque.', false, 'Il appartient aux associés : il fait partie des capitaux propres.']],
  s: [1, blocs('Actif', 'Passif', [['Actif immobilisé', 'ce qui dure : machines, locaux, logiciels'], ['Actif circulant', 'stocks, créances, banque']], [['Capitaux propres', 'capital, réserves, résultat'], ['Dettes', 'emprunts, fournisseurs, État']], 'La structure d\'un bilan : deux colonnes, quatre grandes masses.')],
  v: ['bilan comptable actif passif expliqué', 'comprendre le bilan comptable débutant', 'capitaux propres explication simple']},
'm-resultat': {q: [[0, 'Un bénéfice signifie que les produits dépassent les charges.', true, 'Résultat = produits − charges.'], [2, 'Une facture reçue en décembre et payée en janvier est une charge de janvier.', false, 'Elle est rattachée à décembre : on enregistre à la date de l\'opération, pas du paiement.']],
  s: [0, flux([['Produits', 'ce que l\'activité rapporte'], ['− Charges', 'ce qu\'elle consomme'], ['= Résultat', 'bénéfice ou perte']])],
  v: ['compte de résultat expliqué simplement', 'charges et produits comptabilité cours', 'différence entre charge et immobilisation']},
'm-partie-double': {q: [[0, 'Débiter un compte signifie toujours le diminuer.', false, 'Débit veut seulement dire « colonne de gauche ». Un compte d\'actif augmente au débit.'], [1, 'Dans une écriture, le total des débits peut dépasser le total des crédits.', false, 'Jamais : cette égalité est la règle de base de la partie double.']],
  v: ['débit crédit comptabilité explication simple', 'principe de la partie double comptabilité', 'compte en T exercices corrigés']},
'm-plan': {q: [[0, 'Les comptes de la classe 7 enregistrent les produits.', true, 'Et la classe 6, les charges.'], [1, 'Le compte 607 est plus détaillé que le compte 60.', true, 'Chaque chiffre ajouté précise le précédent.']],
  v: ['plan comptable général les 7 classes', 'apprendre le plan comptable facilement', 'numéros de comptes comptabilité astuces']},
'm-journal': {q: [[0, 'Le grand livre classe les écritures par compte.', true, 'Le journal, lui, les classe par date.'], [2, 'On peut supprimer une écriture validée si elle est fausse.', false, 'On la contre-passe : l\'erreur et sa correction restent visibles.']],
  s: [0, flux([['Pièce', 'facture, relevé'], ['Journal', 'par date'], ['Grand livre', 'par compte'], ['Balance', 'les soldes'], ['Comptes annuels', 'bilan, résultat']], 'Le chemin de toute information comptable.')],
  v: ['journal grand livre balance comptabilité', 'comment passer une écriture comptable au journal', 'lettrage comptable explication']},
'm-tva': {q: [[0, 'La TVA facturée aux clients est un produit pour l\'entreprise.', false, 'Elle est collectée pour le compte de l\'État : c\'est une dette.'], [1, 'Sur 120 € TTC à 20 %, la TVA est de 20 €.', true, '120 ÷ 1,20 = 100 € HT, donc 20 € de TVA.']],
  s: [0, flux([['Achats', 'TVA déductible : créance'], ['Entreprise', 'collecte et déduit'], ['Ventes', 'TVA collectée : dette'], ['État', 'reçoit la différence']])],
  v: ['TVA collectée déductible explication', 'comptabiliser la TVA écritures', 'calcul TVA HT TTC méthode']},
'm-achats-ventes': {q: [[0, 'La dette envers le fournisseur s\'enregistre pour le montant TTC.', true, 'C\'est bien le TTC que vous devrez payer.'], [2, 'Une remise figurant sur la facture s\'enregistre dans le compte 609.', false, 'On enregistre directement le net commercial. Le 609 sert aux réductions obtenues après coup.']],
  v: ['comptabiliser une facture d\'achat écriture', 'comptabiliser une facture de vente écriture', 'rabais remise ristourne escompte comptabilité']},
'm-banque': {q: [[0, 'Le règlement d\'un client augmente le chiffre d\'affaires.', false, 'Le produit a été enregistré à la facture. Le règlement solde seulement la créance.'], [1, 'Un chèque émis mais pas encore débité explique un écart entre le relevé et le compte 512.', true, 'C\'est un simple décalage de temps.']],
  v: ['rapprochement bancaire méthode exemple', 'état de rapprochement bancaire exercice corrigé', 'comptabiliser un règlement client fournisseur']},
'm-paie': {q: [[0, 'Les cotisations patronales sont retenues sur le salaire du salarié.', false, 'Elles s\'ajoutent au brut et sont payées par l\'employeur.']],
  v: ['comptabilisation de la paie écritures', 'salaire brut net coût employeur explication', 'lire un bulletin de paie']},
'm-amortissements': {q: [[0, 'Un terrain s\'amortit sur vingt ans.', false, 'Un terrain ne s\'use pas : il ne s\'amortit pas.'], [1, 'Un bien mis en service le 1er juillet ne supporte que six mois de dotation la première année.', true, 'C\'est le prorata temporis.']],
  v: ['amortissement linéaire explication exemple', 'tableau d\'amortissement linéaire prorata temporis', 'immobilisation ou charge comment choisir']},
'm-depreciations': {q: [[0, 'Une provision concerne un actif qui a perdu de la valeur.', false, 'Cela, c\'est une dépréciation. La provision est un passif incertain.'], [1, 'La dépréciation d\'une créance se calcule sur son montant hors taxes.', true, 'La TVA pourra être récupérée si la créance est perdue.']],
  v: ['dépréciation créances clients douteux écriture', 'provisions pour risques et charges comptabilité', 'différence provision dépréciation']},
'm-regularisations': {q: [[1, 'Une charge constatée d\'avance diminue les charges de l\'exercice.', true, 'La part qui concerne l\'exercice suivant est reportée à l\'actif.'], [2, 'On attend toujours la facture pour enregistrer une charge.', false, 'Si le bien ou le service est reçu, la charge appartient à l\'exercice.']],
  v: ['charges constatées d\'avance écriture', 'factures non parvenues factures à établir', 'écritures d\'inventaire régularisations cours']},
'm-stocks': {q: [[0, 'Les comptes de stock sont mis à jour à chaque achat.', false, 'Dans la méthode courante, ils ne bougent qu\'à l\'inventaire.'], [1, 'Si le stock augmente pendant l\'exercice, les charges diminuent.', true, 'Ce qui reste en stock n\'a pas été consommé.']],
  v: ['variation de stock comptabilité écriture', 'CMUP FIFO valorisation des stocks', 'inventaire des stocks fin d\'exercice']},
'm-emprunts': {q: [[0, 'Le remboursement du capital d\'un emprunt est une charge.', false, 'Seuls les intérêts sont une charge.']],
  v: ['comptabilisation emprunt bancaire écriture', 'tableau d\'amortissement emprunt annuités constantes', 'intérêts courus non échus écriture']},
'm-cloture': {q: [[1, 'L\'impôt sur les sociétés se calcule sur le résultat comptable, sans aucune correction.', false, 'Il se calcule sur le résultat fiscal, après réintégrations et déductions.'], [2, 'La réserve légale cesse d\'être dotée quand elle atteint 10 % du capital.', true, 'Au-delà, la dotation n\'est plus obligatoire.']],
  s: [0, flux([['Justifier', 'banque, tiers, TVA'], ['Inventorier', 'stocks, risques'], ['Régulariser', 'écritures d\'inventaire'], ['Imposer', 'calcul de l\'IS'], ['Publier', 'comptes annuels']])],
  v: ['clôture des comptes annuels étapes', 'affectation du résultat écriture comptable', 'calcul impôt sur les sociétés résultat fiscal']},
'm-sig': {q: [[0, 'L\'EBE est calculé avant les dotations aux amortissements.', true, 'C\'est ce qui le rend comparable d\'une entreprise à l\'autre.'], [1, 'La CAF est toujours égale au résultat net.', false, 'On y rajoute les charges calculées, comme les dotations.']],
  v: ['soldes intermédiaires de gestion explication', 'calcul EBE valeur ajoutée exemple', 'capacité d\'autofinancement CAF calcul']},
'm-analyse': {q: [[1, 'Une trésorerie nette négative signifie que le BFR dépasse le fonds de roulement.', true, 'Trésorerie nette = FR − BFR.'], [2, 'Allonger le délai accordé aux clients réduit le BFR.', false, 'Il l\'augmente : les créances restent plus longtemps à l\'actif.']],
  s: [0, blocs('Emplois', 'Ressources', [['Emplois stables', 'immobilisations'], ['Actif d\'exploitation', 'stocks, créances'], ['Trésorerie active', 'banque, caisse']], [['Ressources stables', 'capitaux propres, emprunts'], ['Dettes d\'exploitation', 'fournisseurs, fiscal, social'], ['Trésorerie passive', 'découverts']], 'Le bilan fonctionnel : trois étages qui se lisent ligne par ligne.')],
  v: ['fonds de roulement BFR trésorerie nette explication', 'bilan fonctionnel analyse financière', 'ratios financiers à connaître analyse']},
'm-liasse': {q: [[1, 'L\'impôt sur les sociétés est déductible de son propre résultat fiscal.', false, 'On le réintègre toujours : il ne peut pas réduire sa propre base.'], [2, 'Un déficit fiscal peut se reporter en avant sans limite de durée.', true, 'Mais chaque année, l\'imputation est plafonnée à un million d\'euros plus 50 % du bénéfice au-delà.']],
  s: [1, flux([['Résultat comptable', 'tableau 2052'], ['+ Réintégrations', 'charges non déductibles'], ['− Déductions', 'produits non imposables, déficits'], ['= Résultat fiscal', 'base de l\'impôt']])],
  v: ['liasse fiscale 2050 2058-A explication', 'passage du résultat comptable au résultat fiscal', 'déficit fiscal report en avant et en arrière']},
'm-societes': {q: [[0, 'Dans une SARL, tout le capital en numéraire doit être versé dès la création.', false, 'Un cinquième suffit à la création ; le reste dans les cinq ans.'], [1, 'Une prime d\'émission fait partie des capitaux propres.', true, 'Elle figure au compte 1041, à côté du capital.']],
  s: [0, flux([['Souscription', 'promesse d\'apport'], ['Appel', 'la société demande les fonds'], ['Versement', 'l\'argent arrive en banque']])],
  v: ['comptabilisation constitution société capital souscrit appelé versé', 'augmentation de capital prime d\'émission écriture comptable', 'compte courant d\'associé comptabilité']},
'm-consolidation': {q: [[1, 'Une société détenue à 30 % est intégrée globalement.', false, 'À 30 %, on présume une influence notable : mise en équivalence.'], [2, 'Le pourcentage d\'intérêt peut être inférieur au pourcentage de contrôle.', true, 'Dans une chaîne de participations, on multiplie les pourcentages pour l\'intérêt.']],
  s: [3, flux([['Homogénéiser', 'mêmes méthodes'], ['Cumuler', 'les comptes'], ['Éliminer', 'opérations internes'], ['Partager', 'groupe et minoritaires']])],
  v: ['consolidation des comptes intégration globale mise en équivalence', 'pourcentage de contrôle et pourcentage d\'intérêt', 'écart d\'acquisition goodwill consolidation']},
'm-avance': {q: [[0, 'Dans les comptes individuels français, un bien en crédit-bail figure à l\'actif du locataire.', false, 'Il reste au bailleur : le locataire enregistre des redevances en charges.'], [1, 'Un gain de change latent est enregistré en produit à la clôture.', false, 'Il va au compte 477, sans produit : on attend qu\'il soit réalisé.']],
  v: ['crédit-bail comptabilisation redevance levée d\'option', 'écart de conversion actif passif provision pour perte de change', 'TVA intracommunautaire autoliquidation écriture comptable']},
'm-synthese': {v: ['exercice corrigé comptabilité écritures de fin d\'exercice', 'cas pratique comptabilité générale corrigé', 'travaux d\'inventaire exercice complet']}
};

/* Vidéos choisies dans la playlist « Les Meilleurs Cours de Comptabilité » (Les Geeks des Chiffres) : [id, titre, durée] */
const YT = {
'm-pourquoi': [['dg0khfpzc04', 'À quoi sert la compta ? Initiation 1/6', '8:35'], ['idfzuX0zGLw', 'Le rôle de la comptabilité', '5:12'], ['ufra0ue9z9U', 'Les destinataires de l\'information financière', '8:30'], ['hIjOIBefHCg', 'Les obligations comptables', '3:01'], ['HZI4QjcU974', 'Comptabilité ou finance : la différence en 2 minutes', '2:11'], ['YQzoBpb9LZI', 'Repartir de zéro en comptabilité : méthode en 7 étapes', '17:00'], ['Qs3SHPpZRlg', '5 conseils pour être bon en compta', '7:06']],
'm-bilan': [['SnC_LvjZyIs', 'Qu\'est-ce qu\'un actif et un passif ?', '11:15'], ['8a82i1DVCZI', 'Le bilan comptable. Initiation 4/6', '22:27'], ['95ry214JmT0', 'Le bilan comptable en détail', '8:31'], ['TvPk0uSHbfg', 'Créances et dettes : ne plus les confondre', '3:44'], ['ZIfD1C3cb_U', 'Différence entre bilan et compte de résultat', '5:18']],
'm-resultat': [['2BQog5xSy6k', 'Le compte de résultat. Initiation 3/6', '15:54'], ['wChNv8CX8Dw', 'Le compte de résultat en détail', '6:53'], ['OHhKtcVKuVA', 'Exercice : remplir un compte de résultat', '5:00'], ['05JQMkNGzAQ', 'Le nouveau bilan et compte de résultat 2025', '22:00']],
'm-partie-double': [['NRqCw2EOo0w', 'Principe de la partie double : débit et crédit', '16:23'], ['C8q17zBA05M', 'Le débit et le crédit', '3:25'], ['bodJx9UkRfw', 'Comment fonctionnent les comptes en T', '8:24'], ['Hn_vwVIsoNY', 'Principe de l\'écriture comptable', '6:48'], ['z4y8YB2rZpk', 'Le lien entre écriture, bilan et compte de résultat', '8:05']],
'm-plan': [['fVv_ZjZr_Yg', 'La codification comptable et le PCG. Initiation 2/6', '25:03'], ['PiR0sR08qCE', 'La codification comptable', '10:52'], ['42onWPEY8Dk', 'Plan comptable : 52 comptes à apprendre par cœur', '24:00'], ['Zj19j8RjKjw', 'Les sources du droit comptable', '5:07']],
'm-journal': [['6eXilKmmQYU', 'Le journal, le grand livre et la balance', '3:54'], ['izsXvuv1j90', 'Les écritures comptables. Initiation 6/6', '15:10'], ['RuzJc-a0qJ4', 'La vie d\'une écriture comptable', '10:51'], ['Xre0mFpQu0A', 'Enregistrement comptable : les questions à se poser', '10:10'], ['OnJ2dmGJ-Gg', 'Grand livre, balance, bilan et résultat en même temps', '45:00']],
'm-tva': [['_RqkB2AI8Sc', 'La TVA', '6:57'], ['RyCKY5xygLg', 'TVA : comptabilisation de l\'écriture (1/2)', '4:30'], ['Vx-E8KQ8MjQ', 'TVA : comptabilisation de l\'écriture (2/2)', '5:55'], ['HvSckjR4Y6o', 'Exercice : calculer et comptabiliser la TVA', '15:00'], ['g0vvHzrP0u0', 'Cours complet sur la TVA (CA3, logiciel…)', '49:00']],
'm-achats-ventes': [['oRoARqWXjXQ', 'Facture d\'achat : enregistrement comptable', '7:27'], ['5pyk3UVr7SU', 'Facture de vente : enregistrement comptable', '5:22'], ['2ieU7eDka04', 'L\'écriture comptable de vente', '6:27'], ['HZEnvHNP_j4', 'Exercice : achats, ventes, avoirs', '19:00'], ['gtvCoI5fGfM', 'Exercice : les opérations courantes', '18:08'], ['p3QAAuf0ZwI', 'Les emballages : écritures et exemples', '24:00']],
'm-banque': [['q1r6opBtdtI', 'Tout sur le compte 512 Banque', '9:35'], ['Qyp6IvMfVRs', 'Les avances et acomptes versés et reçus', '27:00']],
'm-amortissements': [['HioNEdYu2T4', 'Qu\'est-ce qu\'une immobilisation ?', '6:47'], ['Vu5b_voQGXs', 'Enregistrer l\'acquisition d\'une immobilisation', '12:56'], ['86KFWvZr9KI', 'Enregistrer une écriture d\'immobilisation', '9:44'], ['racliCbW6Mw', 'Les amortissements : introduction', '20:00'], ['GrMGQkjgWlU', 'Exercice : acquisition d\'une immobilisation', '18:00'], ['f7IYK6QotPI', 'Les immobilisations financières', '7:06'], ['RZRIe7gdHRo', 'Coût d\'acquisition des immobilisations corporelles (DCG)', '40:37']],
'm-depreciations': [['-UhxzORL760', 'Les dépréciations en 8 minutes', '8:09'], ['4puj8mEMt1I', 'Exercice : les provisions', '15:00']],
'm-regularisations': [['GxUSyOAVN0w', 'Le compte 408 : factures non parvenues', '8:05'], ['EHf5QfWi4dw', 'Qu\'est-ce qu\'une charge constatée d\'avance ?', '0:53']],
'm-emprunts': [['pV72HtmBLoc', 'Exercice : les emprunts', '8:49']],
'm-cloture': [['MqQEtGI4d4Y', 'La clôture des comptes en 30 minutes', '35:00']],
'm-analyse': [['Qn9HUehCmR4', 'Bilan : 4 indicateurs pour un diagnostic', '9:42']],
'm-synthese': [['kMa08OEvHYM', '6 cours de compta : compilation', '1:42:26'], ['vSRhuX9vMOI', 'Les 5 erreurs courantes des comptables', '5:53'], ['PDKSBKZsaOc', 'Analyse d\'un sujet de comptabilité du DCG', '28:00'], ['DsgkE_Re2Ko', 'Cours : utiliser un logiciel de comptabilité', '']]
};
window.PD.YT = YT;

/* ══════════ MOTEUR DE JEU ══════════ */
const jour = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const recule = n => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const serie = () => { let n = 0, i = S.jours[jour()] ? 0 : 1; while (S.jours[jour(recule(i))]) { n++; i++; } return n; };
const lundi = () => jour(recule((new Date().getDay() + 6) % 7));
const sem = () => { const k = lundi(); if (!S.sem || S.sem.k !== k) S.sem = {k, ex: 0, xp: 0, tr: 0, mod: 0, fait: 0}; return S.sem; };
const DEFIS = [
  {t: 'Réussir 12 exercices du parcours', f: w => w.ex, n: 12},
  {t: 'Gagner 150 XP', f: w => w.xp, n: 150},
  {t: 'Donner 30 bonnes réponses à l\'entraînement', f: w => w.tr, n: 30},
  {t: 'Terminer 2 modules', f: w => w.mod, n: 2}
];
const defi = () => DEFIS[Math.floor(new Date(lundi()).getTime() / 6048e5) % DEFIS.length];
const RANGS = [[0, 'Stagiaire'], [100, 'Aide-comptable'], [300, 'Comptable'], [600, 'Comptable confirmé'], [1000, 'Chef comptable'], [1500, 'Directeur financier']];
const rang = () => { let i = 0; RANGS.forEach((r, k) => { if (S.xp >= r[0]) i = k; }); return {nom: RANGS[i][1], bas: RANGS[i][0], haut: (RANGS[i + 1] || [null])[0]}; };
const nbEx = () => sum(MODULES, faits);
const nbMod = () => MODULES.filter(m => faits(m) === m.ex.length).length;
const nivFini = n => MODULES.filter(m => m.niv === n).every(m => faits(m) === m.ex.length);
const maitrisees = () => Object.values(S.cartes).filter(b => b >= 2).length;

const BADGES = [
  ['premier', '1', 'Premier pas', 'Réussir un exercice', () => nbEx() >= 1],
  ['module', 'M', 'Module bouclé', 'Terminer un module', () => nbMod() >= 1],
  ['n1', 'N1', 'Fondations posées', 'Terminer le niveau Débutant', () => nivFini(1)],
  ['n2', 'N2', 'Au quotidien', 'Terminer le niveau Intermédiaire', () => nivFini(2)],
  ['n3', 'N3', 'Maître de l\'inventaire', 'Terminer le niveau Avancé', () => nivFini(3)],
  ['n4', 'N4', 'Analyste', 'Terminer le niveau Confirmé', () => nivFini(4)],
  ['s3', '3j', 'Régulier', '3 jours de suite', () => serie() >= 3],
  ['s7', '7j', 'Une semaine pleine', '7 jours de suite', () => serie() >= 7],
  ['xp100', '100', 'Centurion', 'Atteindre 100 XP', () => S.xp >= 100],
  ['xp500', '500', 'Infatigable', 'Atteindre 500 XP', () => S.xp >= 500],
  ['xp1000', '1k', 'Mille points', 'Atteindre 1 000 XP', () => S.xp >= 1000],
  ['serie10', '×10', 'Réflexe', 'Série de 10 à l\'entraînement', () => Object.values(S.best).some(b => b >= 10)],
  ['examen', 'Ex', 'Reçu', 'Réussir un examen blanc', () => Object.values(S.exam).some(e => e.ok)],
  ['parfait', '10', 'Sans faute', 'Un examen blanc à 10 sur 10', () => Object.values(S.exam).some(e => e.best >= 10)],
  ['cartes', 'Aa', 'Bonne mémoire', 'Maîtriser 30 cartes mémoire', () => maitrisees() >= 30],
  ['atelier', 'T', 'Teneur de livres', 'Passer une écriture dans l\'Atelier', () => S.flags.atelier],
  ['defi', 'D', 'Défi relevé', 'Réussir un défi de la semaine', () => S.flags.defi],
  ['curieux', '?', 'Curieux', 'Poser une question à l\'assistant', () => S.flags.curieux],
  ['xl1', 'X', 'Premier classeur', 'Réussir un atelier Excel', () => Object.keys(S.xl || {}).length >= 1],
  ['xl4', 'XL', 'Excel débutant', 'Réussir les ateliers Excel du niveau Débutant', () => xlFaits(1) >= xlTotal(1)],
  ['xl8', 'XL+', 'Excel intermédiaire', 'Réussir les ateliers Excel du niveau Intermédiaire', () => xlFaits(2) >= xlTotal(2)],
  ['xl12', 'XL³', 'Excel avancé', 'Réussir les ateliers Excel du niveau Avancé', () => xlFaits(3) >= xlTotal(3)]
];
function toast(t) {
  const Z = $('#toasts'), el = h(`<div class="toast">${esc(t)}</div>`);
  el.style.bottom = (Z.children.length * 46) + 'px';
  Z.append(el); setTimeout(() => el.remove(), 2800);
}
function verif() { BADGES.forEach(b => { if (!S.badges[b[0]] && b[4]()) { S.badges[b[0]] = jour(); toast('Badge obtenu : ' + b[2]); A.son('badge'); } }); }
function entete() { $('#c-serie').textContent = serie(); $('#c-xp').textContent = f0(S.xp); majProg(); }
A.gain = (n, type, quoi) => {
  const w = sem(), j = jour();
  S.xp += n; S.jours[j] = (S.jours[j] || 0) + n; w.xp += n;
  if (w[type] !== undefined) w[type]++;
  S.dern = {t: Date.now(), q: quoi || (S.dern && S.dern.q) || ''};
  S.hist.unshift({t: Date.now(), q: S.dern.q, n}); S.hist.length = Math.min(S.hist.length, 30);
  toast('+' + n + ' XP');
  const d = defi();
  if (!w.fait && d.f(w) >= d.n) { w.fait = 1; S.xp += 50; S.jours[j] += 50; S.flags.defi = 1; toast('Défi de la semaine relevé : +50 XP'); }
  verif(); save(); entete(); pousser();
};
A.badge = id => { if (S.flags[id]) return; S.flags[id] = 1; verif(); save(); };

/* sons discrets, générés sans fichier audio */
let actx;
A.son = t => {
  if (!S.son) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const N = {ok: [660, 880], ko: [233], badge: [523, 659, 784]}[t] || [440];
    N.forEach((fr, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t0 = actx.currentTime + i * .09;
      o.type = 'sine'; o.frequency.value = fr;
      g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(t === 'ko' ? .035 : .05, t0 + .015); g.gain.exponentialRampToValueAtTime(.0001, t0 + .24);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + .26);
    });
  } catch (e) { /* audio indisponible */ }
};

/* apprentissage adaptatif : chaque erreur est notée, la révision la fait disparaître */
A.erreur = k => { if (!k) return; S.err[k] = (S.err[k] || 0) + 1; if (S.prem[k] === undefined) S.prem[k] = 0; save(); A.son('ko'); };
A.reussite = (k, rev) => { if (!k) return; if (S.prem[k] === undefined) S.prem[k] = 1; if (rev && S.err[k]) { S.err[k]--; if (!S.err[k]) delete S.err[k]; } save(); A.son('ok'); };
const exDe = k => { const i = k.lastIndexOf(':'), m = MODULES.find(x => x.id === k.slice(0, i)); return m && m.ex[+k.slice(i + 1)] ? [m.ex[+k.slice(i + 1)], m] : null; };
const faibles = () => {
  const P = {};
  Object.entries(S.err).forEach(([k, n]) => { const x = exDe(k); if (x) P[x[1].id] = (P[x[1].id] || 0) + n; });
  return Object.entries(P).sort((a, b) => b[1] - a[1]).map(([id, n]) => [MODULES.find(m => m.id === id), n]);
};
const scoreMoyen = () => { const W = Object.values(S.prem); return W.length ? Math.round(100 * sum(W) / W.length) : null; };

/* déblocage progressif */
A.ouvert = m => {
  const i = MODULES.indexOf(m);
  if (i <= 0 || S.libre || faits(m) > 0) return true;
  const p = MODULES[i - 1];
  if (faits(p) * 2 >= p.ex.length) return true;
  if (S.test && S.test.niv >= m.niv) return true;
  if (S.exam[m.niv - 1] && S.exam[m.niv - 1].ok) return true;
  return false;
};

/* thème clair ou sombre */
const theme = () => {
  const c = S.theme === 'clair', b = $('#theme');
  document.documentElement.classList.toggle('clair', c);
  if (b) { b.setAttribute('aria-pressed', c); b.setAttribute('aria-label', c ? 'Passer en mode sombre' : 'Passer en mode clair'); b.title = c ? 'Mode sombre' : 'Mode clair'; }
  const mt = document.querySelector('meta[name="theme-color"]'); if (mt) mt.content = c ? '#f3f6f4' : '#0F1115';
};

/* temps d'étude : compté seulement quand la page est visible et utilisée */
let actif = Date.now();
['pointerdown', 'keydown', 'scroll'].forEach(e => addEventListener(e, () => { actif = Date.now(); }, {passive: true}));
setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - actif < 90000) { S.temps += 15; if (S.temps % 60 === 0) save(); } }, 15000);

/* capacités de la page publiée ; absentes en local, tout est prévu pour s'en passer */
const caps = {};
const use = n => caps[n] || (caps[n] = (window.claude && window.claude.use ? window.claude.use(n) : Promise.resolve(null)).catch(() => null));

/* ══════════ ÉLÉMENTS DE LEÇON ══════════ */
A.bulle = (q, key) => {
  const el = h(`<div class="dial"><div class="av" aria-hidden="true">V</div><div class="bul"><p><b>Vania :</b> vrai ou faux ? ${q[1]}</p><div class="seg"><button type="button">Vrai</button><button type="button">Faux</button></div><p class="rep" aria-live="polite"></p></div></div>`);
  $$('button', el).forEach((b, k) => b.addEventListener('click', () => {
    const ok = (k === 0) === q[2], r = $('.rep', el);
    $$('button', el).forEach(x => x.disabled = true); b.setAttribute('aria-pressed', 'true');
    r.className = 'rep ' + (ok ? 'ok' : 'ko'); r.textContent = (ok ? 'Bien vu. ' : 'Pas tout à fait. ') + q[3];
    if (!S.qv[key]) { S.qv[key] = 1; if (ok) A.gain(5, 'qv'); else save(); }
  }));
  return el;
};
A.videos = (el, id, Q) => {
  const L = YT[id] || [], cap = q => q.charAt(0).toUpperCase() + q.slice(1);
  const R = L.length ? Q.slice(0, 1) : Q;
  el.innerHTML = L.map(x => { const [v, t] = x, d = x.length > 3 ? x[3] : x[2], ch = x.length > 3 ? x[2] : 'Les Geeks des Chiffres'; return `<a class="vid yt${S.vid[v] ? ' vue' : ''}" data-v="${v}" href="https://www.youtube.com/watch?v=${v}" target="_blank" rel="noopener"><span class="mini"><img src="https://i.ytimg.com/vi/${v}/mqdefault.jpg" alt="" loading="lazy"><i aria-hidden="true"></i>${d ? `<em>${d}</em>` : ''}</span><span class="vt">${esc(t)}<small data-ch="${esc(ch)}">${S.vid[v] ? 'Déjà vue' : esc(ch)}</small></span></a>`; }).join('')
    + R.map(q => `<a class="vid" href="https://www.youtube.com/results?search_query=${encodeURIComponent(q)}" target="_blank" rel="noopener"><i aria-hidden="true"></i><span>${L.length ? 'Chercher d\'autres vidéos sur YouTube' : esc(cap(q))}<small>Recherche YouTube</small></span></a>`).join('');
  $$('img', el).forEach(i => i.addEventListener('error', () => i.remove()));
  $$('.yt', el).forEach(a => a.addEventListener('click', () => {
    const v = a.dataset.v; if (S.vid[v]) return;
    S.vid[v] = Date.now(); a.classList.add('vue'); $('small', a).textContent = 'Déjà vue';
    A.gain(2, 'vid', 'Vidéo : ' + $('.vt', a).firstChild.textContent);
  }));
};
A.telecharger = async (nom, data, fb) => {
  const dl = await use('downloads');
  if (dl) {
    try { await dl.save({filename: nom, data}); if (fb) say(fb, true, 'Fichier enregistré.'); }
    catch (e) { if (fb) say(fb, false, e && e.code === 'declined' ? 'Téléchargement annulé.' : 'Le téléchargement n\'a pas abouti. Réessayez dans un instant.'); }
    return;
  }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], {type: 'text/html'})); a.download = nom; document.body.append(a); a.click(); a.remove(); }
  catch (e) { if (fb) say(fb, false, 'Le téléchargement n\'est pas disponible dans cette vue.'); }
};
/* ══════════ ATELIERS EXCEL ══════════
   etape : étape de la leçon où la carte apparaît · v : [id, titre, chaîne, durée] · d : [intitulé, valeur, unité, tolérance] */
const XL = {
'm-bilan': {niv: 1, n: 1, etape: 2, t: 'Construire le bilan avec SOMME', min: 15,
  obj: 'Additionnez automatiquement l\'actif et le passif du bilan de Vania, passez les montants en euros et vérifiez que le bilan est équilibré.',
  comp: ['SOMME', 'Alt + =', 'Format monétaire'],
  v: [['BxuQN_oO0VA', 'Tu connais la fonction SOMME ?', 'La minute Excel', '3:22'], ['97wRm52wVxQ', 'Appliquer le format monétaire', 'Ben Info', '0:27']],
  d: [['Total de l\'actif (B11)', 23300, '€'], ['Capitaux propres (E7)', 13800, '€']]},
'm-resultat': {niv: 1, n: 2, etape: 0, t: 'Le compte de résultat et le symbole $', min: 15,
  obj: 'Calculez le résultat de l\'atelier et le poids de chaque charge dans le chiffre d\'affaires, en recopiant une seule formule grâce à une référence absolue.',
  comp: ['Formules', 'Référence absolue $', 'Recopie', 'Pourcentage'],
  v: [['GqnhbGXmi7I', 'Comprendre la référence absolue', 'CRFormations', '3:32'], ['GWApVx9db1A', 'L\'adressage absolu en 2 minutes', 'Excel en 2 minutes', '1:41']],
  d: [['Résultat de l\'exercice (B17)', 12000, '€'], ['Part des salaires dans le chiffre d\'affaires (C11)', 24.7, '%', .051]]},
'm-partie-double': {niv: 1, n: 3, etape: 2, t: 'Contrôler un journal avec SI', min: 20,
  obj: 'Vérifiez automatiquement que chaque écriture du journal de janvier est équilibrée, et retrouvez celle qui contient une erreur de saisie.',
  comp: ['SI', 'SOMME', 'Recopie de formule'],
  v: [['5lCvmWm6wTc', 'Tu connais la fonction SI ?', 'La minute Excel', '3:49'], ['WPkgLP2Lu6o', 'La formule SI en une minute', 'Axel Formateur Excel', '0:59']],
  d: [['Numéro de l\'écriture en erreur', 4, ''], ['Montant de l\'écart, en valeur positive', 90, '€']]},
'm-plan': {niv: 1, n: 4, etape: 1, t: 'Trier, filtrer et compter les comptes', min: 15,
  obj: 'Retrouvez la classe de 35 comptes avec GAUCHE, filtrez la liste, triez-la, puis comptez les comptes de chaque classe avec NB.SI.',
  comp: ['GAUCHE', 'Filtres', 'Tri', 'NB.SI'],
  v: [['tmqjEkZy76Y', 'Tu connais la fonction NB.SI ?', 'La minute Excel', '2:35'], ['HlPYn97pDn8', 'Trier et filtrer des données', 'tutosurexcel', '1:11']],
  d: [['Comptes de classe 6 (charges)', 11, ''], ['Comptes de classe 4 (tiers)', 9, '']]},
'm-journal': {niv: 2, n: 5, etape: 0, t: 'Construire la balance avec SOMME.SI', min: 20,
  obj: 'Transformez le journal de janvier de l\'atelier de Vania en balance : total débit, total crédit et solde de chaque compte, calculés automatiquement.',
  comp: ['SOMME.SI', 'MAX', 'Plages figées $', 'Tableau croisé dynamique'],
  v: [['SqJmG4c1bLY', 'Tu connais la fonction SOMME.SI ?', 'La minute Excel', '2:35'], ['E8tizMO74HU', 'Le tableau croisé dynamique', 'Alphorm', '2:28']],
  d: [['Solde du compte 512 Banque', 37550, '€'], ['Total des débits du journal', 127850, '€']]},
'm-tva': {niv: 2, n: 6, etape: 2, t: 'Calculer la TVA et préparer la déclaration', min: 20,
  obj: 'Calculez la TVA et le TTC de dix factures à 20 %, 10 % et 5,5 %, puis préparez automatiquement la déclaration du mois.',
  comp: ['ARRONDI', 'SOMME.SI avec texte', 'Formats % et €'],
  v: [['v0BeX-cp8Z4', 'HT, TTC, TVA : calculer la TVA sur Excel', 'Docteur Excel', '3:12'], ['ndV3GM9VcB8', 'La fonction ARRONDI', 'Excel x Solpedinn', '1:45']],
  d: [['TVA à décaisser (J7)', 2478.59, '€'], ['Total TTC des ventes (J9)', 27088.22, '€']]},
'm-banque': {niv: 2, n: 7, etape: 1, t: 'Pointer le relevé et rapprocher la banque', min: 25,
  obj: 'Repérez automatiquement les opérations présentes d\'un seul côté, colorez-les, puis établissez l\'état de rapprochement de mars.',
  comp: ['NB.SI', 'SI', 'Mise en forme conditionnelle', 'SOMME.SI.ENS'],
  v: [['ySPrjHgAMqk', 'Colorer une cellule selon sa valeur', 'La minute Excel', '3:34'], ['tmqjEkZy76Y', 'Tu connais la fonction NB.SI ?', 'La minute Excel', '2:35']],
  d: [['Solde bancaire corrigé (C21 ou H21)', 11382, '€'], ['Nombre de lignes « À rapprocher », des deux côtés', 4, '']]},
'm-paie': {niv: 2, n: 8, etape: 0, t: 'Préparer les salaires avec RECHERCHEV', min: 25,
  obj: 'Calculez les cotisations, le net à payer et le coût employeur de six salariés, en allant chercher les taux de chaque statut dans une table.',
  comp: ['RECHERCHEV', 'ARRONDI', 'Table de paramètres'],
  v: [['tAlnUOLJNHA', 'Tu connais la fonction RECHERCHEV ?', 'La minute Excel', '4:16'], ['f6tkMn3i-TA', 'RECHERCHEV : deux démonstrations simples', 'David Montet - Excel Solutions', '3:20']],
  d: [['Total des nets à payer (H11)', 11906.6, '€'], ['Coût total employeur (J13)', 22260, '€']]},
'm-amortissements': {niv: 3, n: 9, etape: 1, t: 'Les dotations aux amortissements avec AMORLIN', min: 20,
  obj: 'Calculez la dotation 2026 de cinq immobilisations mises en service en cours d\'année, au prorata temporis, et leur valeur nette comptable au 31 décembre.',
  comp: ['AMORLIN', 'JOURS360', 'Dates', 'ARRONDI'],
  v: [['kGwYzwNPg40', 'Calculer l\'amortissement linéaire avec AMORLIN', 'BricolExcel', '1:36'], ['qUG2RHeifjY', 'La fonction JOURS360', 'Excel x Solpedinn', '1:10']],
  d: [['Total des dotations 2026 (G11)', 8280, '€'], ['Valeur nette comptable de la machine (H6)', 20400, '€']]},
'm-regularisations': {niv: 3, n: 10, etape: 1, t: 'Les charges constatées d\'avance avec FIN.MOIS', min: 20,
  obj: 'Pour six factures à cheval sur deux exercices, calculez automatiquement la part qui concerne 2027 et la charge réelle de 2026.',
  comp: ['FIN.MOIS', 'ANNEE et MOIS', 'MAX', 'Format date'],
  v: [['OjP4iuvs1f8', 'La fonction FIN.MOIS', 'Excel x Solpedinn', '1:15'], ['avWW_HFjfB4', 'Calculer la durée entre deux dates', 'La minute Excel', '5:57']],
  d: [['Total des charges constatées d\'avance (H12)', 5840, '€'], ['Total des charges de l\'exercice 2026 (I12)', 5260, '€']]},
'm-stocks': {niv: 3, n: 11, etape: 2, t: 'La fiche de stock au coût moyen pondéré', min: 20,
  obj: 'Tenez la fiche de stock des modules LED : quantité, valeur et coût moyen recalculés après chaque entrée, coût des sorties, puis un graphique.',
  comp: ['Références relatives en chaîne', 'SI', 'Graphique en courbes'],
  v: [['5lpBEDofEWs', 'Les fiches de stocks : le CMUP après chaque entrée', '5 minutes pour réussir', '5:02'], ['5vsE7Yez_gI', 'Créer un graphique en courbes', 'excelcorpo', '3:43']],
  d: [['Valeur du stock final (G10)', 1000, '€'], ['Coût total des sorties (I11)', 6875, '€']]},
'm-emprunts': {niv: 3, n: 12, etape: 1, t: 'Le tableau d\'emprunt avec VPM', min: 25,
  obj: 'Construisez le tableau de remboursement d\'un emprunt de 50 000 € à 4 % sur 5 ans, séparez intérêts et capital, et contrôlez les intérêts de la première année.',
  comp: ['VPM', 'CUMUL.INTER', 'Recopie sur 60 lignes'],
  v: [['9gs1AKmmym0', 'Tu connais la fonction VPM ?', 'La minute Excel', '2:18'], ['z1xA-TGQcXI', 'Tu connais la fonction CUMUL.INTER ?', 'La minute Excel', '3:12']],
  d: [['Mensualité, au centime (B7)', 920.83, '€'], ['Intérêts de la première année (B8)', 1832.23, '€', .02]]}
};
const NBXL = Object.keys(XL).length;
const CHEZ_NOUS = /(^|\.)nahkeo\.fr$|github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
const bouton = (f, txt, cls, cache) => CHEZ_NOUS
  ? `<button type="button" class="btn${cls}" data-f="${f}"${cache ? ' hidden' : ''}>${txt}</button>`
  : `<a class="btn${cls}" data-f="${f}" href="https://compta.nahkeo.fr/${f}" target="_blank" rel="noopener"${cache ? ' hidden' : ''}>${txt}</a>`;
const xlFaits = niv => Object.keys(XL).filter(k => S.xl[k] && (!niv || XL[k].niv === niv)).length;
const xlTotal = niv => Object.keys(XL).filter(k => XL[k].niv === niv).length;
A.fichier = async (chemin, nom, fb) => {
  try {
    const r = await fetch(chemin); if (!r.ok) throw new Error(r.status);
    await A.telecharger(nom, await r.blob(), fb);
  } catch (e) { if (fb) say(fb, false, 'Le fichier n\'a pas pu être récupéré. Vérifiez la connexion et réessayez.'); }
};
A.atelierXL = (id, k) => {
  const x = XL[id]; if (!x || x.etape !== k) return null;
  const fait = !!S.xl[id];
  const el = h(`<section class="xl${fait ? ' fait' : ''}" aria-label="Atelier Excel ${x.n}">
    <header><span class="xl-ico" aria-hidden="true">X</span><div><small>Atelier Excel ${x.n} sur ${NBXL} · ${x.min} min · niveau ${NIVEAUX[x.niv - 1].t}</small><h3>${x.t}</h3></div><span class="etat">${fait ? 'Réussi' : ''}</span></header>
    <p>${x.obj}</p>
    <div class="xl-comp">${x.comp.map(c => `<span>${c}</span>`).join('')}</div>
    <ol class="xl-pas"><li><b>Regardez</b> le tuto, court.</li><li><b>Téléchargez</b> le classeur : les consignes sont dans la première feuille, l'exercice dans la seconde, les cellules jaunes à compléter.</li><li><b>Reportez</b> vos résultats ici pour valider l'atelier.</li></ol>
    <div class="vids xl-vids"></div>
    <div class="act">${bouton(`ateliers/atelier-${x.n}.xlsx`, 'Télécharger le classeur (.xlsx)', '', false)}${bouton(`ateliers/atelier-${x.n}-corrige.xlsx`, 'Télécharger le corrigé', ' sec', !fait)}</div>
    <div class="fb xl-dl" aria-live="polite"></div>
    <form class="xl-defi"><h4>Le défi</h4>${x.d.map((d, i) => { const u = uid(); return `<label for="${u}">${d[0]}<span><input id="${u}" inputmode="decimal" autocomplete="off" data-i="${i}">${d[2] ? `<em>${d[2]}</em>` : ''}</span></label>`; }).join('')}
    <div class="act"><button class="btn">Vérifier mes résultats</button></div><div class="fb" aria-live="polite"></div></form>
  </section>`);
  A.videos($('.xl-vids', el), '__xl_' + id, []);
  if (CHEZ_NOUS) $$('[data-f]', el).forEach(b => b.addEventListener('click', () => A.fichier(b.dataset.f, b.dataset.f.split('/').pop(), $('.xl-dl', el))));
  let essais = 0;
  $('form', el).addEventListener('submit', e => {
    e.preventDefault();
    const fb = $('form .fb', el), I = $$('input', el);
    if (I.some(i => !i.value.trim())) { say(fb, false, 'Complétez chaque résultat avant de vérifier.'); return; }
    const faux = x.d.filter((d, i) => Math.abs(num(I[i].value) - d[1]) > (d[3] || .01));
    I.forEach((inp, i) => inp.classList.toggle('ko', Math.abs(num(inp.value) - x.d[i][1]) > (x.d[i][3] || .01)));
    if (!faux.length) {
      say(fb, true, '<b>Atelier réussi.</b> Vos formules donnent les bons résultats. Le corrigé est disponible pour comparer votre classeur.');
      $('[data-f$="corrige.xlsx"]', el).hidden = false; el.classList.add('fait', 'pop'); $('.etat', el).textContent = 'Réussi';
      if (!S.xl[id]) { S.xl[id] = Date.now(); A.gain(15, 'xl', 'Atelier Excel : ' + x.t); }
      A.son('ok');
      return;
    }
    essais++; A.son('ko');
    say(fb, false, (faux.length === 1 ? 'Un résultat ne correspond pas : ' : 'Ces résultats ne correspondent pas : ') + faux.map(d => d[0]).join(', ') + '. Vérifiez la plage de cellules de votre formule.' + (essais >= 2 ? ' <button type="button" class="lien">Télécharger le corrigé pour comparer</button>' : ''));
    const l = $('.lien', fb); if (l) l.addEventListener('click', () => { const c = $('[data-f$="corrige.xlsx"]', el); c.hidden = false; if (CHEZ_NOUS) A.fichier(c.dataset.f, `atelier-${x.n}-corrige.xlsx`, $('.xl-dl', el)); else c.focus(); });
  });
  return el;
};
Object.keys(XL).forEach(k => { YT['__xl_' + k] = XL[k].v; });
A.fiche = (m, fb) => {
  const d = document.createElement('div'); d.innerHTML = m.h;
  const bloc = s => [...d.querySelectorAll(s)].map(e => e.outerHTML).join('');
  const plan = [...d.querySelectorAll('h2')].map(e => '<li>' + e.textContent + '</li>').join('');
  const pieges = bloc('.piege');
  A.telecharger('fiche-' + m.id.slice(2) + '.html', `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Fiche pratique – ${m.t}</title><style>body{font:16px/1.65 Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px;color:#1a2420}h1{font:700 28px Arial,sans-serif;border-bottom:3px solid #0B6B3A;padding-bottom:8px}h2{font:700 17px Arial,sans-serif;color:#0B6B3A;margin-top:28px}table{border-collapse:collapse;width:100%;margin:10px 0;font:14px Arial,sans-serif}td,th{border:1px solid #c9d3cd;padding:5px 8px;text-align:left}td.m{text-align:right}aside,.piege{background:#eef6f1;border-left:4px solid #0B6B3A;padding:10px 14px;margin:10px 0}.piege{background:#fdf1f1;border-color:#b3393f}footer{margin-top:30px;font:12px Arial,sans-serif;color:#667}</style></head><body><h1>${m.t}</h1><p><em>${m.chapo}</em></p><h2>L'essentiel</h2>${bloc('.retenir')}${pieges ? '<h2>Les pièges</h2>' + pieges : ''}${d.querySelector('table.jr') ? '<h2>Les écritures types</h2>' + bloc('table.jr') : ''}<h2>Plan de la leçon</h2><ul>${plan}</ul>${(YT[m.id] || []).length ? '<h2>Vidéos conseillées</h2><ul>' + YT[m.id].map(v => '<li><a href="https://www.youtube.com/watch?v=' + v[0] + '">' + esc(v[1]) + '</a>' + (v[2] ? ' (' + v[2] + ')' : '') + '</li>').join('') + '</ul>' : ''}${S.notes[m.id] ? '<h2>Mes notes</h2><p>' + esc(S.notes[m.id]).replace(/\n/g, '<br>') + '</p>' : ''}<footer>Partie Double · fiche pratique · taux et seuils en vigueur en France en 2026</footer></body></html>`, fb);
};

/* ══════════ ACCUEIL : LE BANDEAU DU JOUR ══════════ */
const anneau = p => { const c = 2 * Math.PI * 24; return `<svg class="anneau" viewBox="0 0 58 58" aria-hidden="true"><circle class="f" cx="29" cy="29" r="24"/><circle class="v" cx="29" cy="29" r="24" stroke-dasharray="${Math.min(1, p) * c} ${c}"/></svg>`; };
const septJours = () => [6, 5, 4, 3, 2, 1, 0].map(i => { const d = recule(i); return `<i class="${S.jours[jour(d)] ? 'on' : ''}">${'DLMMJVS'[d.getDay()]}</i>`; }).join('');
const rappel = () => {
  const F = Object.keys(S.err).length, xj = S.jours[jour()] || 0, sr = serie(), L = [];
  if (!xj && sr > 0) L.push(`Votre série de ${sr} jour${sr > 1 ? 's' : ''} s'arrête ce soir si vous ne gagnez pas d'XP aujourd'hui. <a href="#revision">Une révision rapide suffit.</a>`);
  if (F) L.push(`Révision recommandée : ${F} exercice${F > 1 ? 's' : ''} à retravailler. <a href="#revision">Réviser mes points faibles</a>`);
  return L.map(t => `<p class="rappel">${t}</p>`).join('');
};
A.bandeau = () => {
  const xj = S.jours[jour()] || 0, w = sem(), d = defi(), p = Math.min(d.n, d.f(w));
  return rappel() + `<section class="jour" aria-label="Aujourd'hui">
    <div class="verre">${anneau(xj / S.but)}<div><h3>Objectif du jour</h3><b>${xj} / ${S.but} XP</b><small>${xj >= S.but ? 'Objectif atteint. À demain.' : 'Un exercice réussi rapporte 10 XP.'}</small></div></div>
    <div class="verre"><div><h3>Série en cours</h3><b>${serie()} jour${serie() > 1 ? 's' : ''} de suite</b><div class="sept">${septJours()}</div></div></div>
    <div class="verre"><div style="flex:1"><h3>Défi de la semaine</h3><b style="font-size:1.02rem">${d.t}</b><div class="jauge"><i style="width:${100 * p / d.n}%"></i></div><small>${w.fait ? 'Relevé : +50 XP gagnés.' : p + ' / ' + d.n + ' · 50 XP à la clé'}</small></div></div>
  </section>`;
};

/* ══════════ TABLEAU DE BORD ══════════ */
function tableau() {
  const r = rang(), n = nbEx(), nm = nbMod(), niv = NIVEAUX.find(x => !nivFini(x.n)), mn = Math.round(S.temps / 60);
  const stat = (l, v, s) => `<div class="verre stat"><small>${l}</small><b>${v}</b><span>${s || ''}</span></div>`;
  const J7 = [6, 5, 4, 3, 2, 1, 0].map(i => { const d = recule(i); return [d.toLocaleDateString('fr-FR', {weekday: 'short'}), S.jours[jour(d)] || 0]; }), mx = Math.max(S.but, ...J7.map(x => x[1]));
  V.innerHTML = `<h1 class="titre">Tableau de bord</h1><p class="sous">Votre progression, enregistrée automatiquement dans ce navigateur.</p>
  <div class="stats">
    ${stat('Niveau actuel', niv ? niv.t : 'Confirmé', niv ? niv.s : 'Parcours terminé')}
    ${stat('Progression', Math.round(100 * n / TOTAL) + ' %', n + ' exercices sur ' + TOTAL)}
    ${stat('Expérience', f0(S.xp) + ' XP', r.nom + (r.haut ? ' · encore ' + (r.haut - S.xp) + ' XP' : ''))}
    ${stat('Série', serie() + ' j', 'jours consécutifs')}
    ${stat('Temps d\'étude', mn >= 60 ? Math.floor(mn / 60) + ' h ' + String(mn % 60).padStart(2, '0') : mn + ' min', 'temps actif cumulé')}
    ${stat('Modules validés', nm + ' / ' + MODULES.length, '')}
    ${stat('Ateliers Excel', xlFaits() + ' / ' + NBXL, [1, 2, 3].map(nv => NIVEAUX[nv - 1].t + ' ' + xlFaits(nv) + '/' + xlTotal(nv)).join(' · '))}
    ${stat('Score moyen', scoreMoyen() === null ? '–' : scoreMoyen() + ' %', 'réussite du premier coup')}
    ${(() => { const N = NIVEAUX.find(x => !(S.exam[x.n] && S.exam[x.n].ok)); if (!N) return stat('Certifications', '4 / 4', 'toutes obtenues'); const M = MODULES.filter(m => m.niv === N.n), p = Math.round(100 * sum(M, faits) / sum(M, m => m.ex.length)); return stat('Prochaine certification', N.t, p + ' % du niveau fait · <a href="#examen">examen</a>'); })()}
    ${stat('Dernière activité', S.dern ? new Date(S.dern.t).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) : '–', S.dern ? esc(S.dern.q) : 'Rien pour l\'instant')}
  </div>
  <div class="deux">
    <div class="verre bloc"><h2>XP des sept derniers jours</h2><div class="hist">${J7.map(([l, v]) => `<div><span>${v || ''}</span><i class="${v ? '' : 'vide'}" style="height:${Math.max(2, 100 * v / mx)}%"></i><span>${l}</span></div>`).join('')}</div>
      <div class="act" style="margin-top:14px"><span style="font-size:.88rem;color:var(--muted)">Objectif quotidien :</span><div class="seg" id="but">${[20, 30, 50].map(b => `<button type="button" data-b="${b}" aria-pressed="${S.but === b}">${b} XP</button>`).join('')}</div></div></div>
    <div class="verre bloc"><h2>Progression par niveau</h2>${NIVEAUX.map(N => { const M = MODULES.filter(m => m.niv === N.n), a = sum(M, faits), t = sum(M, m => m.ex.length); return `<div class="lig"><span>${N.t}</span><div class="jauge"><i style="width:${100 * a / t}%"></i></div><span>${Math.round(100 * a / t)} %</span></div>`; }).join('')}
      <h2 style="margin-top:18px">Statistiques détaillées</h2>
      <div class="lig" style="grid-template-columns:1fr auto"><span>Questions de Vania répondues</span><span>${Object.keys(S.qv).length}</span></div>
      <div class="lig" style="grid-template-columns:1fr auto"><span>Meilleure série à l'entraînement</span><span>${Math.max(0, ...Object.values(S.best))}</span></div>
      <div class="lig" style="grid-template-columns:1fr auto"><span>Cartes mémoire maîtrisées</span><span>${maitrisees()} / ${LEXIQUE.length + PCG.length}</span></div>
      <div class="lig" style="grid-template-columns:1fr auto"><span>Examens blancs réussis</span><span>${Object.values(S.exam).filter(e => e.ok).length} / 4</span></div>
      <p style="margin:12px 0 0"><a class="btn sec" href="#certificats">Voir mes certificats</a></p></div>
  </div>
  <div class="verre bloc" style="margin-top:18px"><h2>Badges · ${Object.keys(S.badges).length} sur ${BADGES.length}</h2><div class="badges">${BADGES.map(b => `<div class="badge${S.badges[b[0]] ? ' on' : ''}"><i>${b[1]}</i><b>${b[2]}</b>${b[3]}</div>`).join('')}</div></div>
  <div class="deux" style="margin-top:18px">
    <div class="verre bloc"><h2>Points à retravailler</h2>${faibles().length ? '<div class="rangs">' + faibles().slice(0, 5).map(([m, n]) => `<div><b>${n}</b><span>${m.t}</span><a href="#revision">Réviser</a></div>`).join('') + '</div>' : '<p style="margin:0;color:var(--muted)">Aucune erreur en attente. Les exercices manqués apparaîtront ici, et la révision vous les reproposera.</p>'}</div>
    <div class="verre bloc"><h2>Historique</h2>${S.hist.length ? '<div class="histo">' + S.hist.slice(0, 8).map(e => `<div><span>${new Date(e.t).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})} · ${new Date(e.t).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span><span>${esc(e.q || '')}</span><b>+${e.n}</b></div>`).join('') + '</div>' : '<p style="margin:0;color:var(--muted)">Votre activité s\'affichera ici.</p>'}</div>
  </div>
  <div class="verre bloc" style="margin-top:18px"><h2>Réglages</h2><div class="reglages">
    <label><input type="checkbox" id="r-son"${S.son ? ' checked' : ''}> Sons discrets à chaque réponse</label>
    <label><input type="checkbox" id="r-libre"${S.libre ? ' checked' : ''}> Mode libre : tous les modules ouverts, sans attendre</label>
    <label><input type="checkbox" id="r-clair"${S.theme === 'clair' ? ' checked' : ''}> Mode clair</label>
  </div></div>
  <div class="verre bloc" style="margin-top:18px"><h2>Classement</h2><div id="clas" class="rangs"></div></div>`;
  $$('#but button').forEach(b => b.addEventListener('click', () => { S.but = +b.dataset.b; save(); tableau(); }));
  classement($('#clas'));
  $('#r-son').addEventListener('change', e => { S.son = e.target.checked; save(); if (S.son) A.son('ok'); });
  $('#r-libre').addEventListener('change', e => { S.libre = e.target.checked; save(); });
  $('#r-clair').addEventListener('change', e => { S.theme = e.target.checked ? 'clair' : 'sombre'; save(); theme(); });
}

/* Classement réel entre les personnes qui partagent la page ; seuls l'identifiant et le score sont stockés */
let pousse = -1, minuterie;
function pousser() {
  clearTimeout(minuterie);
  minuterie = setTimeout(async () => {
    if (S.xp === pousse) return;
    const [db, user] = await Promise.all([use('db'), use('user')]);
    if (!db || !user) return;
    try { const id = await user.id(); if (!id) return; const xp = S.xp; await db.doc('classement/' + id).set({xp, modules: nbMod(), maj: Date.now()}); pousse = xp; } catch (e) { /* lecture seule ou hors ligne */ }
  }, 4000);
}
async function classement(el) {
  el.textContent = 'Chargement du classement…';
  const [db, user] = await Promise.all([use('db'), use('user')]);
  if (!el.isConnected) return;
  if (!db || !user) { el.textContent = 'Le classement compare les personnes avec qui cette page est partagée sur claude.ai. Il n\'est pas disponible dans cette vue.'; return; }
  const garde = setTimeout(() => { el.textContent = 'Le classement ne répond pas pour le moment.'; }, 10000);
  try {
    const moi = await user.id(), snap = await db.collection('classement').orderBy('xp', 'desc').limit(20).get();
    clearTimeout(garde); if (!el.isConnected) return;
    const D = snap.docs.filter(d => d.exists);
    if (!D.length) { el.textContent = 'Personne n\'est encore classé. Gagnez vos premiers XP pour ouvrir le classement.'; return; }
    const ps = await user.profiles(D.map(d => d.id));
    el.textContent = '';
    D.forEach((d, i) => {
      const x = d.data() || {}, row = h('<div><b></b><span></span><b></b></div>');
      if (d.id === moi) row.className = 'moi';
      row.children[0].textContent = i + 1;
      row.children[1].textContent = ((ps[d.id] && ps[d.id].name) || 'Participant') + (d.id === moi ? ' (vous)' : '');
      row.children[2].textContent = f0(+x.xp || 0) + ' XP';
      el.append(row);
    });
    if (D.length === 1) el.append(h('<p style="margin:8px 0 0;font-size:.86rem;color:var(--muted)">Vous êtes seul pour l\'instant. Partagez la page pour vous mesurer à d\'autres.</p>'));
  } catch (e) { clearTimeout(garde); el.textContent = 'Le classement n\'a pas pu être chargé.'; }
}

/* ══════════ PRATIQUE : onglets communs ══════════ */
const PRAT = [['entrainement', 'Entraînement'], ['revision', 'Révision'], ['cartes', 'Cartes mémoire'], ['examen', 'Examen blanc']];
A.onglets = k => `<div class="tabs">${PRAT.map(([id, l]) => `<a href="#${id}"${id === k ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</div>`;
const melange = X => { const Y = X.slice(); for (let i = Y.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [Y[i], Y[j]] = [Y[j], Y[i]]; } return Y; };
const AUTONOME = e => !/même|cette machine|cette créance|cette TVA|cette dotation|cette dépréciation|ces intérêts|cette charge constatée|Parmi les écritures/.test(e.q);

function revision() {
  const W = Object.entries(S.err).sort((a, b) => b[1] - a[1]).map(([k]) => exDe(k)).filter(x => x && AUTONOME(x[0])).slice(0, 6);
  let M = MODULES.filter(m => faits(m) > 0); const vide = !M.length; if (vide) M = MODULES.filter(m => m.niv === 1);
  const pris = new Set(W.map(x => x[0]));
  const X = W.concat(melange(M.flatMap(m => m.ex.filter(e => AUTONOME(e) && !pris.has(e)).map(e => [e, m]))).slice(0, Math.max(0, 6 - W.length)));
  const intro = W.length ? `Les ${W.length} premiers exercices reprennent vos erreurs récentes${X.length > W.length ? ', les autres sont tirés au hasard dans vos modules' : ''}. Une erreur disparaît de la liste quand vous réussissez l'exercice ici.` : vide ? 'Vous n\'avez pas encore commencé de module : voici une série tirée du niveau Débutant.' : 'Aucune erreur en attente : six exercices tirés au hasard dans les modules déjà travaillés.';
  V.innerHTML = `<div class="etroit">${A.onglets('revision')}<h1 class="titre">Révision</h1><p class="sous">${intro} Chaque réussite rapporte 3 XP.</p><div id="rx"></div><div class="act"><button type="button" class="btn" id="rn">Nouvelle série</button></div>
  <h2 class="exos-h" style="font-family:var(--f-display)">Les fiches « À retenir »</h2><div id="rf"></div></div>`;
  X.forEach(([e, m], i) => { const el = exo(e, null, i, X.length, neuf => { if (neuf) A.gain(3, 'rev', 'Révision'); }); if (i < W.length) $('.tag', el).textContent += ' · point faible · ' + m.t; $('#rx').append(el); });
  $('#rn').addEventListener('click', () => { revision(); scrollTo(0, 0); });
  $('#rf').innerHTML = M.map(m => { const r = (m.h.match(/<aside class="retenir">[\s\S]*?<\/aside>/) || [''])[0]; return r ? `<details class="verre" style="padding:12px 16px;margin-bottom:10px"><summary style="cursor:pointer;font-weight:600;color:var(--titre)">${m.t}</summary>${r}</details>` : ''; }).join('');
}

function cartes() {
  let jeu = 'L', cur = null, vues = 0;
  const DECKS = {L: LEXIQUE.map(x => ['L:' + x[0], x[0], x[1], 'Définition']), C: PCG.map(a => ['C:' + a[0], a[0], a[1], 'Intitulé du compte'])};
  V.innerHTML = `<div class="etroit">${A.onglets('cartes')}<h1 class="titre">Cartes mémoire</h1><p class="sous">Lisez le recto, répondez dans votre tête, puis retournez la carte. Les cartes mal connues reviennent plus souvent.</p>
  <div class="tabs"><button type="button" data-j="L">Vocabulaire</button><button type="button" data-j="C">Numéros de comptes</button></div>
  <div class="score"><span>Maîtrisées dans ce paquet : <b id="fm"></b></span><span>Vues cette session : <b id="fv">0</b></span></div>
  <div class="fc"><button type="button" class="fc-in" id="fc" aria-label="Retourner la carte"><span class="fc-f"><small id="fq"></small><b id="fr"></b><small>Touchez pour retourner</small></span><span class="fc-f dos"><small id="ft"></small><span id="fd" style="font-size:1.05rem;line-height:1.55"></span></span></button></div>
  <div class="act" style="justify-content:center"><button type="button" class="btn sec" id="fn">À revoir</button><button type="button" class="btn" id="fo">Je savais</button></div></div>`;
  const tire = () => {
    const D = DECKS[jeu], bas = Math.min(...D.map(c => S.cartes[c[0]] || 0));
    let P = D.filter(c => (S.cartes[c[0]] || 0) === bas && c !== cur); if (!P.length) P = D;
    cur = pick(P);
    $('#fc').classList.remove('tourne');
    $('#fq').textContent = jeu === 'L' ? 'Que signifie…' : 'Quel est ce compte ?'; $('#fr').textContent = cur[1]; $('#ft').textContent = cur[3];
    setTimeout(() => { $('#fd') && ($('#fd').textContent = cur[2]); }, 200);
    $('#fm').textContent = D.filter(c => (S.cartes[c[0]] || 0) >= 2).length + ' / ' + D.length;
    $$('[data-j]').forEach(b => b.setAttribute('aria-selected', b.dataset.j === jeu));
  };
  const note = su => {
    S.cartes[cur[0]] = su ? Math.min(3, (S.cartes[cur[0]] || 0) + 1) : 0; S.nbCartes++; vues++; $('#fv').textContent = vues;
    if (su) A.gain(1, 'fc', 'Cartes mémoire'); else save();
    tire();
  };
  $('#fc').addEventListener('click', () => $('#fc').classList.toggle('tourne'));
  $('#fo').addEventListener('click', () => note(true)); $('#fn').addEventListener('click', () => note(false));
  $$('[data-j]').forEach(b => b.addEventListener('click', () => { jeu = b.dataset.j; cur = null; tire(); }));
  tire();
}

/* ── Examens blancs chronométrés ── */
const DUREE = 600, NBQ = 10, SEUIL = 7;
/* Les examens se passent dans l'ordre : celui d'un niveau s'ouvre quand l'examen du niveau précédent est réussi */
const examOuvert = n => n === 1 || !!(S.exam[n - 1] && S.exam[n - 1].ok);
function examen() {
  V.innerHTML = `<div class="etroit">${A.onglets('examen')}<h1 class="titre">Examen blanc</h1><p class="sous">${NBQ} questions, ${DUREE / 60} minutes, aucune correction avant la fin. Il faut ${SEUIL} bonnes réponses pour être reçu et obtenir le certificat du niveau. Les examens se passent dans l'ordre : réussir celui d'un niveau ouvre le suivant.</p>
  <div class="mods">${NIVEAUX.map(N => { const e = S.exam[N.n], o = examOuvert(N.n), P = NIVEAUX[N.n - 2]; return `<div class="mod${e && e.ok ? ' fini' : ''}${o ? '' : ' verrou'}"><span class="k">Niveau ${N.n}</span><h3>${N.t}</h3><div class="av"><span>${!o ? 'Réussissez d\'abord l\'examen ' + P.t : e ? 'Meilleur score : ' + e.best + ' / ' + NBQ + (e.ok ? ' · reçu' : '') : 'Pas encore tenté'}</span></div><button type="button" class="btn${o ? '' : ' sec'}" data-n="${N.n}"${o ? '' : ' disabled'}>${!o ? 'Verrouillé' : e ? 'Repasser' : 'Commencer'}</button></div>`; }).join('')}</div></div>`;
  $$('[data-n]').forEach(b => b.addEventListener('click', () => passer(+b.dataset.n)));
}
function passer(n) {
  if (!examOuvert(n)) { examen(); return; }
  const N = NIVEAUX[n - 1], pool = MODULES.filter(m => m.niv === n).flatMap(m => m.ex.filter(e => (e.t === 'qcm' || e.t === 'calcul') && AUTONOME(e)));
  TEST.filter(q => q.niv === n).forEach(q => pool.push({t: 'qcm', q: q.q, o: q.o.slice(0, 3), r: q.r, e: ''}));
  const Q = melange(pool).slice(0, NBQ), rep = []; let reste = DUREE, fini = false;
  V.innerHTML = `<div class="etroit"><div class="chrono" id="chr"><span>Examen blanc · ${N.t}</span><b id="tps"></b><button type="button" class="btn" id="rendre">Rendre ma copie</button></div><div id="bilan"></div><div id="qx"></div></div>`;
  Q.forEach((q, i) => {
    const el = h(`<section class="exo"><div class="exo-h"><span class="tag">Question ${i + 1} / ${Q.length}</span></div><p class="q">${q.q}</p><div class="corps"></div><div class="fb"></div></section>`), c = $('.corps', el);
    if (q.t === 'qcm') { const box = h('<div class="opts"></div>'); q.o.forEach((o, k) => { const b = h(`<button type="button">${o}</button>`); b.addEventListener('click', () => { if (fini) return; rep[i] = k; $$('button', box).forEach((x, j) => x.classList.toggle('sel', j === k)); }); box.append(b); }); c.append(box); }
    else { const id = uid(); c.append(h(`<div class="saisie"><input id="${id}" inputmode="decimal" autocomplete="off" aria-label="Votre réponse"><span>${q.u || ''}</span></div>`)); }
    $('#qx').append(el);
  });
  const aff = () => { $('#tps').textContent = Math.floor(reste / 60) + ':' + String(reste % 60).padStart(2, '0'); $('#chr').classList.toggle('court', reste <= 60); };
  const rendre = () => {
    if (fini) return; fini = true; clearInterval(tic); A.quitte = null;
    let bon = 0;
    $$('#qx .exo').forEach((el, i) => {
      const q = Q[i]; let ok;
      if (q.t === 'qcm') { ok = rep[i] === q.r; $$('.opts button', el).forEach((b, k) => { b.disabled = true; b.classList.remove('sel'); if (k === q.r) b.classList.add('ok'); else if (k === rep[i]) b.classList.add('ko'); }); }
      else { const inp = $('input', el); ok = inp.value.trim() !== '' && Math.abs(num(inp.value) - q.r) <= .011; inp.disabled = true; }
      if (ok) bon++; el.classList.toggle('fait', ok);
      say($('.fb', el), ok, (ok ? '<b>Juste.</b> ' : '<b>Faux.</b> ' + (q.t === 'calcul' ? 'Réponse : ' + fmt(q.r).replace(',00', '') + ' ' + (q.u || '') + '. ' : '')) + (q.e || ''));
    });
    const recu = bon >= SEUIL, e = S.exam[n] || {best: 0, ok: false};
    S.exam[n] = {best: Math.max(e.best, bon), ok: e.ok || recu, date: recu && !e.ok ? jour() : e.date};
    $('#chr').hidden = true;
    $('#bilan').innerHTML = `<div class="bravo"><b style="font:800 1.5rem var(--f-display)">${bon} / ${Q.length}</b> · ${recu ? 'Reçu. Le certificat du niveau ' + N.t + ' est disponible.' : 'Pas encore : il faut ' + SEUIL + ' bonnes réponses. Reprenez les points signalés ci-dessous, puis retentez.'}<p style="margin:10px 0 0" class="act">${recu ? '<a class="btn" href="#certificats">Voir mon certificat</a>' : ''}<a class="btn sec" href="#examen">Retour aux examens</a></p></div>`;
    if (bon) A.gain(bon * 5, 'exam', 'Examen blanc ' + N.t); else save();
    verif(); save(); scrollTo(0, 0);
  };
  const tic = setInterval(() => { reste--; aff(); if (reste <= 0) rendre(); }, 1000);
  A.quitte = () => clearInterval(tic);
  $('#rendre').addEventListener('click', rendre); aff(); scrollTo(0, 0);
}

/* ── Certificats ── */
const svgCert = (titre, sous, nom, date) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680" font-family="Georgia, 'Times New Roman', serif"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0e0d"/><stop offset="1" stop-color="#0B3A22"/></linearGradient></defs><rect width="1000" height="680" fill="url(#g)"/><rect x="26" y="26" width="948" height="628" fill="none" stroke="#17a35c" stroke-width="2"/><rect x="38" y="38" width="924" height="604" fill="none" stroke="#17a35c" stroke-opacity=".4"/><g stroke="#17a35c" stroke-width="5" fill="none"><path d="M470 96h60M500 96v44"/></g><text x="500" y="196" text-anchor="middle" fill="#86e0ae" font-size="20" letter-spacing="8" font-family="Arial, sans-serif">CERTIFICAT DE RÉUSSITE</text><text x="500" y="262" text-anchor="middle" fill="#9aa69f" font-size="20" font-style="italic">décerné à</text><text x="500" y="338" text-anchor="middle" fill="#f3f6f4" font-size="54" font-weight="bold">${esc(nom)}</text><line x1="300" y1="366" x2="700" y2="366" stroke="#17a35c"/><text x="500" y="424" text-anchor="middle" fill="#dfe6e1" font-size="26">${esc(titre)}</text><text x="500" y="462" text-anchor="middle" fill="#9aa69f" font-size="19">${esc(sous)}</text><text x="500" y="556" text-anchor="middle" fill="#dfe6e1" font-size="18" font-family="Arial, sans-serif">Partie Double · ${esc(date)}</text><text x="500" y="606" text-anchor="middle" fill="#6f7a74" font-size="13" font-family="Arial, sans-serif">Certificat d'entraînement personnel, sans valeur de diplôme ni de titre professionnel.</text></svg>`;
function certificats() {
  const L = NIVEAUX.map(N => ({id: 'niveau-' + N.n, ok: S.exam[N.n] && S.exam[N.n].ok, titre: 'Niveau ' + N.t + ' validé', sous: N.s + ' · examen blanc réussi avec ' + ((S.exam[N.n] || {}).best || 0) + ' sur ' + NBQ, date: (S.exam[N.n] || {}).date, manque: 'Réussissez l\'examen blanc du niveau ' + N.t + '.'}));
  const tout = L.every(c => c.ok);
  L.push({id: 'parcours-complet', ok: tout, titre: 'Parcours complet de comptabilité', sous: 'Les quatre niveaux validés, de débutant à confirmé', date: tout ? L.map(c => c.date).sort().pop() : null, manque: 'Validez les quatre niveaux.'});
  const dateFr = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) : '';
  V.innerHTML = `<div class="etroit"><p class="fil"><a href="#tableau-de-bord">Tableau de bord</a> › Certificats</p><h1 class="titre">Certificats</h1><p class="sous">Un certificat par niveau, obtenu en réussissant son examen blanc. Ce sont des attestations d'entraînement personnel, sans valeur de diplôme.</p>
  <div class="wf"><label for="cnom">Nom à inscrire sur les certificats<input id="cnom" value="${esc(S.nom)}" placeholder="Prénom Nom" style="font-family:var(--f-body)"></label></div><div class="certs" id="cl"></div></div>`;
  const rendu = () => {
    $('#cl').innerHTML = L.map((c, i) => c.ok ? `<div class="cert">${svgCert(c.titre, c.sous, S.nom || 'Votre nom', dateFr(c.date))}<div class="act" style="margin-top:10px"><button type="button" class="btn sec" data-c="${i}">Télécharger (image SVG)</button><span class="fb"></span></div></div>` : `<div class="verre" style="padding:16px 20px;opacity:.7"><b style="color:var(--titre)">${c.titre}</b><br><span style="color:var(--muted);font-size:.92rem">À débloquer : ${c.manque} <a href="#examen">Passer un examen</a></span></div>`).join('');
    $$('[data-c]').forEach(b => b.addEventListener('click', () => { const c = L[+b.dataset.c]; A.telecharger('certificat-' + c.id + '.svg', svgCert(c.titre, c.sous, S.nom || 'Votre nom', dateFr(c.date)), b.nextElementSibling); }));
  };
  $('#cnom').addEventListener('input', e => { S.nom = e.target.value.slice(0, 60); save(); rendu(); $('#cnom').focus(); });
  rendu();
}

/* ══════════ ASSISTANT PÉDAGOGIQUE ══════════ */
const CONSIGNE = 'Tu es le tuteur de comptabilité de l\'application Partie Double. Tu enseignes la comptabilité française (plan comptable général) à une personne qui apprend. Réponds en français, en texte simple sans Markdown ni tableau, en 150 mots au plus, avec un exemple chiffré quand il aide. Si on te demande de l\'aide sur un exercice, guide par étapes et par questions sans donner d\'emblée la solution complète. Ne donne pas de conseil fiscal ou juridique personnalisé.';
const fil = [];
const bulleIA = (cls, t) => { const el = h(`<div class="msg ${cls}"></div>`); el.textContent = t; $('#ia-fil').append(el); $('#ia-fil').scrollTop = 1e6; return el; };
let occupe = false;
async function envoyer(texte) {
  texte = texte.trim(); if (!texte || occupe) return;
  occupe = true; bulleIA('u', texte); fil.push({role: 'user', content: texte});
  const b = bulleIA('b', 'Je réfléchis…'), sample = await use('sample');
  if (!sample) { b.textContent = 'L\'assistant répond quand l\'application est ouverte sur claude.ai. Dans cette vue, il n\'est pas disponible : le lexique et les fiches « À retenir » restent là pour vous aider.'; fil.pop(); occupe = false; return; }
  const H = fil.slice(-9), debut = H.findIndex(m => m.role === 'user'), M = H.slice(debut).map(m => ({role: m.role, content: m.content}));
  M[0].content = CONSIGNE + (A.ctx ? '\n\nLeçon ouverte par l\'élève : « ' + A.ctx.t + ' ». Extrait : ' + A.ctx.texte : '') + '\n\nQuestion de l\'élève : ' + M[0].content;
  try {
    const r = await sample(M, {cache: false, onText: ({text}) => { b.textContent = text; $('#ia-fil').scrollTop = 1e6; }});
    b.textContent = r.text || b.textContent; fil.push({role: 'assistant', content: r.text || ''}); A.badge('curieux');
  } catch (e) {
    fil.pop();
    b.textContent = e && e.code === 'rate_limited' ? 'Trop de questions d\'affilée. Patientez une minute, puis réessayez.' : e && e.code === 'not_granted' ? 'L\'assistant n\'a pas été autorisé dans cette vue.' : 'La réponse n\'est pas arrivée. Vérifiez la connexion et reposez la question.';
  }
  occupe = false;
}
const ouvreIA = o => { $('#ia').hidden = !o; $('#ia-btn').setAttribute('aria-expanded', o); $('#ia-btn').textContent = o ? 'Fermer l\'assistant' : 'Assistant'; if (o) { $('#ia-ctx').textContent = A.ctx ? 'Leçon en cours : ' + A.ctx.t : 'Posez une question sur la comptabilité'; if (!$('#ia-fil').children.length) bulleIA('b', 'Bonjour. Je peux expliquer une notion autrement, donner un exemple chiffré ou vous interroger. Que voulez-vous revoir ?'); $('#ia-q').focus(); } };
$('#ia-btn').addEventListener('click', () => ouvreIA($('#ia').hidden));
$('#ia-x').addEventListener('click', () => ouvreIA(false));
$('#ia-f').addEventListener('submit', e => { e.preventDefault(); const q = $('#ia-q').value; $('#ia-q').value = ''; envoyer(q); });
$('#ia-sugg').innerHTML = ['Explique-moi cette leçon plus simplement', 'Donne-moi un exemple concret', 'Pose-moi une question pour vérifier', 'Résume l\'essentiel en trois points'].map(s => `<button type="button">${s}</button>`).join('');
$$('#ia-sugg button').forEach(b => b.addEventListener('click', () => envoyer(b.textContent)));
A.demander = q => { ouvreIA(true); envoyer(q); };

/* ══════════ ROUTES ET DÉMARRAGE ══════════ */
Object.assign(ROUTES, {'tableau-de-bord': tableau, revision, cartes, examen, certificats});
Object.assign(A.NAV, {revision: 'entrainement', cartes: 'entrainement', examen: 'entrainement', certificats: 'tableau-de-bord'});
$('#theme').addEventListener('click', () => { S.theme = S.theme === 'clair' ? 'sombre' : 'clair'; save(); theme(); });
theme();
/* application installable : seulement sur notre propre domaine ou en local, jamais dans l'artefact */
if ('serviceWorker' in navigator && /(^|\.)nahkeo\.fr$|^nahkeo\.github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname)) {
  const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.webmanifest'; document.head.append(l);
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
verif(); save(); entete();
A.start();
})();
