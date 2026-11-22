/* Partie Double — contenu pédagogique (plan comptable, modules, lexique). */
(() => {
'use strict';

/* Nature : A actif · P passif · C charge · R produit · AM actif en moins · CM charge en moins · RM produit en moins · X neutre */
const PCG = [
['101','Capital','P'],['1011','Capital souscrit – non appelé','P'],['1012','Capital souscrit – appelé, non versé','P'],
['1013','Capital souscrit – appelé, versé','P'],['1041','Primes d\'émission','P'],['109','Associés – capital souscrit non appelé','A'],['1061','Réserve légale','P'],['1068','Autres réserves','P'],
['110','Report à nouveau (solde créditeur)','P'],['120','Résultat de l\'exercice (bénéfice)','P'],
['1511','Provisions pour litiges','P'],['1515','Provisions pour pertes de change','P'],['164','Emprunts auprès des établissements de crédit','P'],
['1688','Intérêts courus sur emprunts','P'],
['205','Logiciels, brevets, licences','A'],['211','Terrains','A'],['213','Constructions','A'],
['2154','Matériel industriel','A'],['2182','Matériel de transport','A'],
['2183','Matériel de bureau et informatique','A'],['2184','Mobilier','A'],
['2611','Titres de participation','A'],['275','Dépôts et cautionnements versés','A'],
['28154','Amortissements du matériel industriel','AM'],['28182','Amortissements du matériel de transport','AM'],
['28183','Amortissements du matériel de bureau et informatique','AM'],
['31','Stocks de matières premières','A'],['355','Stocks de produits finis','A'],
['37','Stocks de marchandises','A'],['397','Dépréciations des stocks de marchandises','AM'],
['401','Fournisseurs','P'],['404','Fournisseurs d\'immobilisations','P'],
['4081','Fournisseurs – factures non parvenues','P'],['4091','Fournisseurs – avances et acomptes versés','A'],
['411','Clients','A'],['416','Clients douteux ou litigieux','A'],
['4181','Clients – factures à établir','A'],['4191','Clients – avances et acomptes reçus','P'],
['421','Personnel – rémunérations dues','P'],['431','Sécurité sociale (URSSAF)','P'],
['4421','Prélèvement à la source (impôt sur le revenu)','P'],['444','État – impôts sur les bénéfices','P'],
['4452','TVA due intracommunautaire','P'],['445662','TVA déductible intracommunautaire','A'],
['44551','TVA à décaisser','P'],['44562','TVA déductible sur immobilisations','A'],
['44566','TVA déductible sur autres biens et services','A'],['44567','Crédit de TVA à reporter','A'],
['44571','TVA collectée','P'],['44586','TVA sur factures non parvenues','A'],
['44587','TVA sur factures à établir','P'],['455','Associés – comptes courants','P'],
['4561','Associés – comptes d\'apport en société','A'],['4562','Apporteurs – capital appelé, non versé','A'],
['457','Associés – dividendes à payer','P'],['476','Différences de conversion – actif','A'],['477','Différences de conversion – passif','P'],
['486','Charges constatées d\'avance','A'],
['487','Produits constatés d\'avance','P'],['491','Dépréciations des comptes de clients','AM'],
['512','Banque','A'],['530','Caisse','A'],['580','Virements internes','X'],
['601','Achats de matières premières','C'],['6037','Variation des stocks de marchandises','X'],
['6061','Fournitures non stockables (eau, énergie)','C'],['6064','Fournitures administratives','C'],
['607','Achats de marchandises','C'],['6122','Redevances de crédit-bail mobilier','C'],['6097','Rabais, remises et ristournes obtenus sur achats','CM'],
['6132','Locations immobilières','C'],['615','Entretien et réparations','C'],
['616','Primes d\'assurance','C'],['6226','Honoraires','C'],['623','Publicité','C'],
['6241','Transports sur achats','C'],['6251','Voyages et déplacements','C'],
['626','Frais postaux et de télécommunications','C'],['627','Services bancaires','C'],
['63511','Cotisation foncière des entreprises','C'],['641','Rémunérations du personnel','C'],
['645','Cotisations sociales patronales','C'],['654','Pertes sur créances irrécouvrables','C'],
['6611','Intérêts des emprunts','C'],['665','Escomptes accordés','C'],
['6811','Dotations aux amortissements des immobilisations','C'],
['6815','Dotations aux provisions d\'exploitation','C'],
['6817','Dotations aux dépréciations des actifs circulants','C'],['6865','Dotations aux provisions financières','C'],['695','Impôts sur les bénéfices','C'],
['701','Ventes de produits finis','R'],['706','Prestations de services','R'],
['707','Ventes de marchandises','R'],['7097','Rabais, remises et ristournes accordés sur ventes','RM'],
['7135','Variation des stocks de produits','X'],['765','Escomptes obtenus','R'],
['7815','Reprises sur provisions d\'exploitation','R'],
['7817','Reprises sur dépréciations des actifs circulants','R']
];
const L = Object.fromEntries(PCG.map(a => [a[0], a[1]]));
const lab = n => { let k = String(n); while (k && !L[k]) k = k.slice(0, -1); return L[k] || ''; };
const f = n => n ? n.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '';

/* Écriture de journal mise en forme : lignes [compte, débit, crédit] */
const J = (rows, lib) => '<div class="scroll"><table class="jr"><thead><tr><th>Compte</th><th>Intitulé</th><th>Débit</th><th>Crédit</th></tr></thead><tbody>' +
  rows.map(([a, d, c]) => `<tr class="${c ? 'cr' : 'db'}"><td class="n">${a}</td><td class="i">${lab(a)}</td><td class="m">${f(d)}</td><td class="m">${f(c)}</td></tr>`).join('') +
  '</tbody>' + (lib ? `<tfoot><tr><td colspan="4">${lib}</td></tr></tfoot>` : '') + '</table></div>';

/* Compte en T : mouvements [libellé, montant] */
const T = (titre, D, C) => {
  const s = D.reduce((x, y) => x + y[1], 0) - C.reduce((x, y) => x + y[1], 0);
  const col = (k, X) => `<div><small>${k}</small>${X.map(([l, m]) => `<p><span>${l}</span>${f(m)}</p>`).join('')}</div>`;
  return `<div class="tc"><h4>${titre}</h4><div class="g">${col('Débit', D)}${col('Crédit', C)}</div><div class="s">${s === 0 ? 'Compte soldé' : 'Solde ' + (s > 0 ? 'débiteur' : 'créditeur') + ' : <b class="mono">' + f(Math.abs(s)) + '</b>'}</div></div>`;
};
const R = t => `<aside class="retenir"><b>À retenir</b>${t}</aside>`;
const P = t => `<div class="piege"><b>Piège classique.</b> ${t}</div>`;
const W = (k) => `<div data-w="${k}"></div>`;

const NIVEAUX = [
  {n: 1, t: 'Débutant', s: 'Les fondations', d: 'Comprendre ce que raconte la comptabilité avant d\'écrire la moindre ligne.'},
  {n: 2, t: 'Intermédiaire', s: 'Les opérations courantes', d: 'Enregistrer le quotidien : factures, TVA, banque, salaires.'},
  {n: 3, t: 'Avancé', s: 'Les travaux d\'inventaire', d: 'Rattacher à chaque exercice ce qui lui appartient vraiment.'},
  {n: 4, t: 'Confirmé', s: 'Clôturer et analyser', d: 'Arrêter les comptes, puis les faire parler.'}
];

const MODULES = [
/* ───────────── NIVEAU 1 ───────────── */
{id: 'm-pourquoi', niv: 1, t: 'À quoi sert la comptabilité', min: 8,
 chapo: 'Avant les comptes et les numéros, une idée simple : garder la trace de tout ce qui entre et sort de l\'entreprise.',
 h: `
<h2>La mémoire chiffrée de l'entreprise</h2>
<p>La comptabilité enregistre, jour après jour, chaque opération de l'entreprise : un achat, une vente, un salaire, un emprunt. Chaque enregistrement s'appuie sur une <strong>pièce justificative</strong> (facture, relevé bancaire, bulletin de paie). Sans pièce, pas d'écriture.</p>
<p>Elle répond à quatre besoins :</p>
<ul>
<li><strong>Savoir</strong> ce que l'entreprise possède et ce qu'elle doit.</li>
<li><strong>Mesurer</strong> si elle gagne ou perd de l'argent.</li>
<li><strong>Prouver</strong> : c'est une obligation légale (Code de commerce), et la base du calcul des impôts.</li>
<li><strong>Informer</strong> les associés, les banques, les investisseurs.</li>
</ul>
<h2>Deux questions, deux documents</h2>
<p>Le <strong>bilan</strong> répond à « que possède l'entreprise, et comment l'a-t-elle financé ? ». C'est une photo prise à une date précise, en général le dernier jour de l'exercice.</p>
<p>Le <strong>compte de résultat</strong> répond à « l'activité a-t-elle créé de la richesse ? ». C'est un film : il raconte toute la période, le plus souvent douze mois.</p>
<h2>Ressources et emplois</h2>
<p>Tout l'argent d'une entreprise vient de quelque part : c'est une <span class="c">ressource</span>. Et il est utilisé à quelque chose : c'est un <span class="d">emploi</span>. On ne peut pas employer de l'argent qu'on n'a pas reçu, donc <strong>le total des emplois est toujours égal au total des ressources</strong>.</p>
<p>Naelys ouvre un atelier de luminaires, avec un apport de 10 000 € et 5 000 € prêtés par la banque : voilà 15 000 € de ressources. L'atelier achète une machine à 4 000 € et 2 000 € de marchandises ; il reste 9 000 € sur le compte. Machine, marchandises et argent en banque sont ses emplois : 4 000 + 2 000 + 9 000 = 15 000 €.</p>
${R('<p style="margin:0">Une ressource dit <em>d\'où vient</em> l\'argent, un emploi dit <em>où il est allé</em>. Les deux totaux sont égaux, toujours. Toute la comptabilité découle de cette égalité.</p>')}`,
 ex: [
  {t: 'qcm', q: 'Lequel de ces documents est une « photo » de l\'entreprise à une date donnée ?', o: ['Le compte de résultat', 'Le bilan', 'Le relevé bancaire', 'Le journal'], r: 1, e: 'Le bilan décrit le patrimoine à un instant précis. Le compte de résultat, lui, couvre une période.'},
  {t: 'qcm', q: 'Une écriture comptable doit toujours s\'appuyer sur…', o: ['l\'accord oral du dirigeant', 'une estimation prudente', 'une pièce justificative', 'le solde du compte bancaire'], r: 2, e: 'Facture, relevé, bulletin de paie, contrat : chaque écriture renvoie à une pièce qui la prouve.'},
  {t: 'tri', q: 'Ressource (d\'où vient l\'argent) ou emploi (à quoi il sert) ?', cats: ['Ressource', 'Emploi'], items: [['Apport des associés', 0], ['Camion de livraison', 1], ['Emprunt bancaire', 0], ['Stock de marchandises', 1], ['Argent sur le compte en banque', 1], ['Dette envers un fournisseur', 0]], e: 'Un fournisseur qui accepte d\'être payé plus tard vous finance : c\'est bien une ressource.'},
  {t: 'calcul', q: 'Paul apporte 20 000 € à sa société et emprunte 15 000 €. Il achète un local 28 000 € et du matériel 4 000 €. Combien reste-t-il en banque ?', r: 3000, u: '€', h: 'Total des ressources = total des emplois. Le reste en banque est un emploi.', e: 'Ressources : 35 000 €. Emplois hors banque : 32 000 €. Il reste donc 3 000 €.'}
 ]},

{id: 'm-bilan', niv: 1, t: 'Le bilan', min: 10,
 chapo: 'À gauche ce que l\'entreprise possède, à droite ce qui l\'a financé. Et les deux colonnes font toujours le même total.',
 h: `
<h2>L'actif : ce que l'entreprise possède</h2>
<p>L'<span class="d">actif</span> regroupe les emplois. On le lit de haut en bas, du moins liquide au plus liquide.</p>
<ul>
<li><strong>Actif immobilisé</strong> : ce qui sert durablement. Logiciels et brevets (incorporel), terrains, bâtiments, machines, véhicules (corporel), titres et dépôts de garantie (financier).</li>
<li><strong>Actif circulant</strong> : ce qui tourne avec l'activité. Stocks, créances sur les clients, et disponibilités (banque, caisse).</li>
</ul>
<h2>Le passif : d'où vient l'argent</h2>
<p>Le <span class="c">passif</span> regroupe les ressources, de la plus stable à la plus vite exigible.</p>
<ul>
<li><strong>Capitaux propres</strong> : ce qui appartient aux associés. Le capital apporté, les réserves (bénéfices passés conservés) et le résultat de l'exercice.</li>
<li><strong>Dettes</strong> : ce que l'entreprise doit. Emprunts bancaires, fournisseurs, dettes fiscales (TVA, impôts) et sociales (salaires, cotisations).</li>
</ul>
<h2>Le bilan de Naelys</h2>
<div class="scroll"><table class="tb"><thead><tr><th>Actif</th><th class="m">€</th><th>Passif</th><th class="m">€</th></tr></thead>
<tbody><tr><td>Machine</td><td class="m">4 000</td><td>Capital</td><td class="m">10 000</td></tr>
<tr><td>Stock de marchandises</td><td class="m">2 000</td><td>Emprunt bancaire</td><td class="m">5 000</td></tr>
<tr><td>Banque</td><td class="m">9 000</td><td></td><td></td></tr></tbody>
<tfoot><tr><td>Total actif</td><td class="m">15 000</td><td>Total passif</td><td class="m">15 000</td></tr></tfoot></table></div>
<h2>Pourquoi le résultat est au passif</h2>
<p>Un bénéfice est une richesse que l'entreprise a créée et qu'elle doit, au fond, à ses associés. Il augmente donc les capitaux propres. Une perte les diminue : elle s'inscrit au même endroit, en négatif.</p>
${R('<p style="margin:0"><strong>Actif = Passif</strong>, sans exception. Et donc : capitaux propres = actif − dettes. C\'est ce qui resterait aux associés si l\'on vendait tout et remboursait tout.</p>')}
${P('Une créance client est de l\'argent qu\'on vous doit : c\'est un actif. Une dette fournisseur est de l\'argent que vous devez : c\'est un passif.')}`,
 ex: [
  {t: 'tri', q: 'Actif ou passif ?', cats: ['Actif', 'Passif'], items: [['Fourgon de livraison', 0], ['Capital social', 1], ['Créance sur un client', 0], ['Emprunt bancaire', 1], ['Stock de matières premières', 0], ['Dette envers l\'URSSAF', 1], ['Logiciel de gestion', 0], ['Solde positif en banque', 0]], e: 'Ce que l\'entreprise possède ou ce qu\'on lui doit : actif. Ce qu\'elle doit, à ses associés comme à des tiers : passif.'},
  {t: 'tri', q: 'Rangez chaque poste dans la bonne rubrique du bilan.', cats: ['Actif immobilisé', 'Actif circulant', 'Capitaux propres', 'Dettes'], items: [['Bâtiment', 0], ['Réserves', 2], ['Caisse', 1], ['TVA à payer', 3], ['Brevet', 0], ['Stock de marchandises', 1], ['Résultat de l\'exercice', 2], ['Fournisseurs', 3]], e: 'Durable : immobilisé. Lié au cycle d\'activité : circulant. Aux associés : capitaux propres. Aux tiers : dettes.'},
  {t: 'calcul', q: 'Le total de l\'actif est de 180 000 €. Les dettes s\'élèvent à 110 000 €. Quel est le montant des capitaux propres ?', r: 70000, u: '€', h: 'Actif = capitaux propres + dettes.', e: '180 000 − 110 000 = 70 000 €.'},
  {t: 'qcm', q: 'L\'entreprise réalise un bénéfice de 12 000 €. Où le retrouve-t-on au bilan ?', o: ['À l\'actif, dans les disponibilités', 'Au passif, dans les capitaux propres', 'Au passif, dans les dettes', 'Il n\'apparaît pas au bilan'], r: 1, e: 'Le résultat de l\'exercice fait partie des capitaux propres. Un bénéfice ne veut pas dire que l\'argent est en banque : il a pu servir à acheter du stock ou une machine.'}
 ]},

{id: 'm-resultat', niv: 1, t: 'Le compte de résultat', min: 10,
 chapo: 'Ce que l\'activité a consommé, ce qu\'elle a produit, et la différence entre les deux.',
 h: `
<h2>Charges et produits</h2>
<p>Une <strong>charge</strong> est une consommation qui appauvrit l'entreprise : marchandises achetées, loyer, électricité, salaires, intérêts d'emprunt. Un <strong>produit</strong> est ce qui l'enrichit : ventes de marchandises, prestations de services, intérêts reçus.</p>
<p style="font:700 1.2rem var(--f-display)">Résultat = Produits − Charges</p>
<p>Positif, c'est un bénéfice. Négatif, une perte. Ce résultat est exactement celui qui figure au passif du bilan : les deux documents se rejoignent là.</p>
<h2>Trois étages</h2>
<ul>
<li><strong>Exploitation</strong> : le métier lui-même. Ventes, achats, loyers, salaires, amortissements.</li>
<li><strong>Financier</strong> : le coût ou le rendement de l'argent. Intérêts d'emprunt, escomptes, produits de placements.</li>
<li><strong>Exceptionnel</strong> : ce qui sort vraiment de l'ordinaire, comme un sinistre majeur et inhabituel. Depuis la réforme du plan comptable de 2025, cette catégorie est devenue très étroite.</li>
</ul>
<h2>Trois confusions à éviter</h2>
<p><strong>Charge n'est pas dépense.</strong> Une facture d'électricité de décembre payée en janvier est une charge de décembre. La comptabilité enregistre l'opération quand elle a lieu, pas quand l'argent bouge : c'est la <em>comptabilité d'engagement</em>.</p>
<p><strong>Produit n'est pas encaissement.</strong> Une vente livrée et facturée est un produit, même si le client paie dans 45 jours.</p>
<p><strong>Achat durable n'est pas charge.</strong> Une machine à 10 000 € servira dix ans. Elle ne s'inscrit pas en charge mais à l'actif, comme immobilisation. Elle deviendra une charge peu à peu, par l'amortissement (niveau avancé).</p>
${R('<p style="margin:0">Le bilan dit <em>où en est</em> l\'entreprise. Le compte de résultat dit <em>comment elle y est arrivée</em> pendant l\'exercice.</p>')}`,
 ex: [
  {t: 'tri', q: 'Charge ou produit ?', cats: ['Charge', 'Produit'], items: [['Loyer du local', 0], ['Vente de marchandises', 1], ['Salaires', 0], ['Intérêts de l\'emprunt', 0], ['Prestation facturée à un client', 1], ['Prime d\'assurance', 0], ['Intérêts reçus d\'un placement', 1]], e: 'Ce qui est consommé : charge. Ce qui est gagné : produit.'},
  {t: 'tri', q: 'Ce poste se lit-il au bilan ou au compte de résultat ?', cats: ['Bilan', 'Compte de résultat'], items: [['Stock de marchandises', 0], ['Achats de marchandises', 1], ['Emprunt bancaire', 0], ['Intérêts de l\'emprunt', 1], ['Créances clients', 0], ['Chiffre d\'affaires', 1], ['Machine', 0]], e: 'L\'emprunt est une dette (bilan), ses intérêts sont une charge (résultat). Les créances sont un actif, les ventes un produit.'},
  {t: 'calcul', q: 'Ventes : 240 000 €. Achats : 130 000 €. Salaires : 60 000 €. Loyers : 18 000 €. Intérêts d\'emprunt : 2 000 €. Quel est le résultat ?', r: 30000, u: '€', e: '240 000 − (130 000 + 60 000 + 18 000 + 2 000) = 30 000 € de bénéfice.'},
  {t: 'qcm', q: 'L\'entreprise achète une machine 10 000 € qu\'elle utilisera huit ans. Comment l\'enregistrer ?', o: ['En charge, pour 10 000 €', 'À l\'actif du bilan, en immobilisation', 'Au passif, en dette', 'En produit'], r: 1, e: 'Un bien utilisé durablement est une immobilisation. Son coût passera en charge année après année, par l\'amortissement.'},
  {t: 'qcm', q: 'Une vente est livrée et facturée le 20 décembre. Le client paie le 15 janvier. À quel exercice appartient le produit, si l\'on clôture au 31 décembre ?', o: ['À l\'exercice de décembre', 'À l\'exercice suivant', 'Moitié-moitié', 'Au choix de l\'entreprise'], r: 0, e: 'Comptabilité d\'engagement : le produit est acquis à la livraison. Au 31 décembre, il reste simplement une créance client à l\'actif.'}
 ]},

{id: 'm-partie-double', niv: 1, t: 'Débit, crédit et partie double', min: 14,
 chapo: 'Le cœur du métier. Chaque opération s\'écrit deux fois : une fois à gauche, une fois à droite, pour le même montant.',
 h: `
<h2>Le compte en T</h2>
<p>Un compte est un tableau à deux colonnes. La colonne de gauche s'appelle le <span class="d">débit</span>, celle de droite le <span class="c">crédit</span>. Ces mots ne veulent dire ni « bien » ni « mal », ni « plus » ni « moins » : seulement gauche et droite.</p>
<h2>La règle du jeu</h2>
<p>Souvenez-vous : tout emploi a une ressource. La partie double l'écrit ainsi : <strong>on débite l'emploi, on crédite la ressource</strong>.</p>
<div class="scroll"><table class="tb"><thead><tr><th>Type de compte</th><th>Augmente au…</th><th>Diminue au…</th></tr></thead><tbody>
<tr><td>Actif (banque, stocks, clients, machines)</td><td><span class="pill D">Débit</span></td><td><span class="pill C">Crédit</span></td></tr>
<tr><td>Charges (achats, loyers, salaires)</td><td><span class="pill D">Débit</span></td><td><span class="pill C">Crédit</span></td></tr>
<tr><td>Passif (capital, emprunts, fournisseurs)</td><td><span class="pill C">Crédit</span></td><td><span class="pill D">Débit</span></td></tr>
<tr><td>Produits (ventes, prestations)</td><td><span class="pill C">Crédit</span></td><td><span class="pill D">Débit</span></td></tr></tbody></table></div>
<p>Dans toute écriture, <strong>le total des débits est égal au total des crédits</strong>. Si ce n'est pas le cas, l'écriture est fausse.</p>
<h2>Deux opérations de Naelys</h2>
<p>Les associés apportent 10 000 € sur le compte bancaire. La banque (actif) augmente : débit. Le capital (passif) augmente : crédit.</p>
${J([['512', 10000, 0], ['101', 0, 10000]], 'Apport en capital')}
<p>Naelys achète ensuite une machine 4 000 €, payée par virement. La machine (actif) augmente : débit. La banque (actif) diminue : crédit.</p>
${J([['2154', 4000, 0], ['512', 0, 4000]], 'Achat de la machine')}
<p>Voici les comptes après ces deux écritures :</p>
<div class="cols">${T('512 Banque', [['Apport', 10000]], [['Machine', 4000]])}${T('101 Capital', [], [['Apport', 10000]])}${T('2154 Matériel industriel', [['Machine', 4000]], [])}</div>
<p>Le <strong>solde</strong> d'un compte est la différence entre ses deux colonnes. Il est débiteur si les débits l'emportent, créditeur dans le cas contraire.</p>
${P('Votre relevé bancaire affiche « crédit » quand vous recevez de l\'argent. C\'est normal : il est tenu par la banque, pour qui votre argent est une dette envers vous. Dans <em>votre</em> comptabilité, une entrée d\'argent se <strong>débite</strong> au compte 512.')}
${R('<p style="margin:0">Actif et charges augmentent au débit. Passif et produits augmentent au crédit. Total débit = total crédit, à chaque écriture.</p>')}`,
 ex: [
  {t: 'tri', q: 'Ce compte augmente-t-il au débit ou au crédit ?', cats: ['Débit', 'Crédit'], items: [['Banque', 0], ['Capital', 1], ['Achats de marchandises', 0], ['Ventes de marchandises', 1], ['Emprunt bancaire', 1], ['Clients', 0], ['Fournisseurs', 1], ['Salaires', 0]], e: 'Actif et charges : débit. Passif et produits : crédit.'},
  {t: 'ecriture', q: 'Les associés versent 20 000 € sur le compte bancaire de la société à sa création. Passez l\'écriture.', l: [['512', 20000, 0], ['101', 0, 20000]], e: 'La banque (actif) augmente au débit. Le capital (passif) augmente au crédit.'},
  {t: 'ecriture', q: 'La banque accorde un prêt de 15 000 €, versé sur le compte de la société.', l: [['512', 15000, 0], ['164', 0, 15000]], e: 'L\'argent arrive en banque (débit du 512). En contrepartie, une dette naît envers la banque (crédit du 164).'},
  {t: 'ecriture', q: 'Vous retirez 500 € du compte bancaire pour alimenter la caisse.', l: [['530', 500, 0], ['512', 0, 500]], e: 'Deux comptes d\'actif : la caisse augmente (débit), la banque diminue (crédit).'},
  {t: 'calcul', q: 'Le compte Banque a reçu 12 000 € puis 3 000 € au débit, et 4 500 € au crédit. Quel est son solde débiteur ?', r: 10500, u: '€', e: '15 000 − 4 500 = 10 500 €, solde débiteur : il y a de l\'argent sur le compte.'}
 ]},

{id: 'm-plan', niv: 1, t: 'Le plan comptable', min: 9,
 chapo: 'Sept classes de comptes, les mêmes dans toutes les entreprises françaises. Le premier chiffre dit déjà presque tout.',
 h: `
<h2>Une liste commune à tous</h2>
<p>Le <strong>plan comptable général</strong> (PCG) fixe la liste des comptes et leurs numéros. Il est établi par l'Autorité des normes comptables. Grâce à lui, un comptable lit sans effort les comptes de n'importe quelle entreprise.</p>
<div class="scroll"><table class="tb"><thead><tr><th>Classe</th><th>Contenu</th><th>Exemples</th><th>Se lit au…</th></tr></thead><tbody>
<tr><td class="n">1</td><td>Capitaux</td><td>101 Capital, 164 Emprunts</td><td rowspan="5">Bilan</td></tr>
<tr><td class="n">2</td><td>Immobilisations</td><td>2154 Matériel, 2183 Informatique</td></tr>
<tr><td class="n">3</td><td>Stocks</td><td>37 Marchandises</td></tr>
<tr><td class="n">4</td><td>Tiers</td><td>401 Fournisseurs, 411 Clients, 445 TVA</td></tr>
<tr><td class="n">5</td><td>Financiers</td><td>512 Banque, 530 Caisse</td></tr>
<tr><td class="n">6</td><td>Charges</td><td>607 Achats, 641 Salaires</td><td rowspan="2">Compte de résultat</td></tr>
<tr><td class="n">7</td><td>Produits</td><td>707 Ventes, 706 Prestations</td></tr></tbody></table></div>
<h2>Lire un numéro</h2>
<p>Chaque chiffre ajouté précise le précédent. <span class="mono">6</span> : une charge. <span class="mono">60</span> : un achat. <span class="mono">607</span> : un achat de marchandises. Une entreprise peut créer des sous-comptes plus fins, par exemple <span class="mono">6071</span> pour une famille de produits.</p>
<h2>Des repères utiles</h2>
<ul>
<li><span class="mono">40</span> pour les fournisseurs, <span class="mono">41</span> pour les clients.</li>
<li>Charges et produits se répondent : <span class="mono">607</span> achats de marchandises, <span class="mono">707</span> ventes de marchandises.</li>
<li>Les comptes <span class="mono">28</span>, <span class="mono">29</span>, <span class="mono">39</span>, <span class="mono">49</span> viennent en diminution d'un actif (amortissements, dépréciations).</li>
</ul>
<p>Tous les comptes utilisés ici sont dans la rubrique <a href="#plan-comptable">Plan comptable</a>, avec leur sens.</p>
${R('<p style="margin:0">Classes 1 à 5 : le bilan. Classes 6 et 7 : le compte de résultat. Dans un exercice, commencez toujours par vous demander de quelle classe relève chaque élément.</p>')}`,
 ex: [
  {t: 'tri', q: 'À quelle classe appartient chaque élément ?', cats: ['1', '2', '3', '4', '5', '6', '7'], items: [['Emprunt bancaire', 0], ['Camionnette', 1], ['Stock de marchandises', 2], ['Dette envers un fournisseur', 3], ['Compte bancaire', 4], ['Facture d\'électricité', 5], ['Vente à un client', 6], ['Créance sur un client', 3]], e: 'La vente est un produit (7), mais la créance qui en découle est un compte de tiers (4).'},
  {t: 'qcm', q: 'Quel compte enregistre ce que les clients doivent à l\'entreprise ?', o: ['401', '411', '512', '707'], r: 1, e: '411 Clients. Le 401 est son miroir côté fournisseurs.'},
  {t: 'qcm', q: 'Un compte dont le numéro commence par 6…', o: ['figure à l\'actif du bilan', 'figure au passif du bilan', 'est une charge du compte de résultat', 'est un produit du compte de résultat'], r: 2, e: 'Classe 6 : charges. Classe 7 : produits.'},
  {t: 'qcm', q: 'Le compte 2183 désigne le matériel de bureau et informatique. À quelle famille appartient-il ?', o: ['Charges', 'Immobilisations', 'Stocks', 'Tiers'], r: 1, e: 'Classe 2 : les biens durables de l\'entreprise.'}
 ]},

/* ───────────── NIVEAU 2 ───────────── */
{id: 'm-journal', niv: 2, t: 'Journal, grand livre, balance', min: 9,
 chapo: 'De la facture au bilan, l\'information suit toujours le même chemin.',
 h: `
<h2>La chaîne comptable</h2>
<ol>
<li><strong>La pièce</strong> : facture, relevé, bulletin. Elle déclenche et justifie l'écriture.</li>
<li><strong>Le journal</strong> : toutes les écritures, dans l'ordre chronologique. En pratique il est découpé en journaux spécialisés : achats, ventes, banque, opérations diverses.</li>
<li><strong>Le grand livre</strong> : les mêmes écritures, reclassées compte par compte. C'est l'ensemble des comptes en T.</li>
<li><strong>La balance</strong> : la liste de tous les comptes avec leurs totaux et leur solde. Elle sert de contrôle : total des débits = total des crédits, total des soldes débiteurs = total des soldes créditeurs.</li>
<li><strong>Les comptes annuels</strong> : bilan, compte de résultat et annexe, construits à partir de la balance.</li>
</ol>
<h2>Une écriture complète</h2>
<p>Une écriture comporte une date, les comptes débités et crédités, un libellé clair et la référence de la pièce. Les logiciels refusent une écriture déséquilibrée.</p>
<h2>On ne gomme pas</h2>
<p>Une écriture validée est définitive. Pour corriger une erreur, on passe l'écriture inverse (une <strong>contre-passation</strong>), puis la bonne. La piste d'audit reste intacte. L'administration peut demander le <strong>fichier des écritures comptables</strong> (FEC), qui retrace tout.</p>
<h2>Le lettrage</h2>
<p>Lettrer un compte client ou fournisseur, c'est rapprocher chaque facture de son règlement en leur donnant la même lettre. Ce qui reste non lettré, c'est ce qui reste dû.</p>
${R('<p style="margin:0">Journal : par date. Grand livre : par compte. Balance : les soldes. Une balance équilibrée ne prouve pas que tout est juste, seulement que chaque écriture était équilibrée.</p>')}
<p><a class="btn sec" href="#atelier">Voir la chaîne en action dans l'Atelier</a></p>`,
 ex: [
  {t: 'qcm', q: 'Quel document présente les écritures dans l\'ordre chronologique ?', o: ['Le grand livre', 'La balance', 'Le journal', 'Le bilan'], r: 2, e: 'Le journal suit le calendrier. Le grand livre reclasse par compte.'},
  {t: 'qcm', q: 'Vous avez enregistré hier une facture dans le mauvais compte de charge. Que faites-vous ?', o: ['Je supprime l\'écriture', 'Je modifie le montant', 'Je contre-passe l\'écriture puis je passe la bonne', 'J\'attends la clôture'], r: 2, e: 'On annule par une écriture inverse, puis on enregistre correctement. Rien ne disparaît.'},
  {t: 'qcm', q: 'La balance est équilibrée. Que peut-on en conclure ?', o: ['Il n\'y a aucune erreur', 'Chaque écriture a été passée pour le même total au débit et au crédit', 'Le résultat est bénéficiaire', 'La TVA est juste'], r: 1, e: 'Une facture oubliée ou imputée au mauvais compte laisse la balance parfaitement équilibrée.'},
  {t: 'qcm', q: 'Dans le compte d\'un client, une facture de 1 200 € n\'est pas lettrée. Cela signifie que…', o: ['elle est fausse', 'elle n\'a pas été rapprochée d\'un règlement', 'elle a été payée deux fois', 'la TVA est manquante'], r: 1, e: 'Non lettrée : aucun règlement ne lui a été associé. Elle reste, a priori, à encaisser.'}
 ]},

{id: 'm-tva', niv: 2, t: 'La TVA', min: 12,
 chapo: 'L\'entreprise la collecte sur ses ventes, la récupère sur ses achats et reverse la différence. Pour elle, ce n\'est ni une charge ni un produit.',
 h: `
<h2>Le mécanisme</h2>
<p>La TVA est payée par le consommateur final. L'entreprise joue le rôle de collecteur :</p>
<ul>
<li>sur ses ventes, elle facture de la <span class="c">TVA collectée</span>, qu'elle doit à l'État (compte 44571, une dette) ;</li>
<li>sur ses achats, elle paie de la <span class="d">TVA déductible</span>, que l'État lui doit (comptes 44566 et 44562, des créances).</li>
</ul>
<p>Les charges et les produits s'enregistrent donc <strong>hors taxes</strong>. La TVA vit en classe 4, avec les tiers.</p>
<h2>Les taux et le calcul</h2>
<p>Taux normal : 20 %. Taux intermédiaire : 10 % (restauration, travaux de rénovation). Taux réduit : 5,5 % (alimentation, livres). Taux particulier : 2,1 % (presse, certains médicaments).</p>
<p class="mono">TTC = HT × (1 + taux) &nbsp;·&nbsp; HT = TTC ÷ (1 + taux)</p>
${W('tva')}
${P('Pour retrouver le HT à partir du TTC, on ne retire pas 20 % : on divise par 1,20. Sur 120 € TTC, la TVA est de 20 €, pas de 24 €.')}
<h2>La déclaration</h2>
<p>Chaque mois ou trimestre : TVA à payer = TVA collectée − TVA déductible. On solde les comptes de TVA et on constate la dette.</p>
${J([['44571', 8000, 0], ['44566', 0, 5000], ['44562', 0, 1000], ['44551', 0, 2000]], 'Déclaration de TVA du mois')}
<p>Si la TVA déductible dépasse la collectée, l'entreprise détient un <strong>crédit de TVA</strong> (compte 44567, au débit), reportable ou remboursable.</p>
<h2>Quand est-elle due ?</h2>
<p>Pour les ventes de biens, à la livraison. Pour les prestations de services, à l'encaissement du prix, sauf option pour les débits.</p>
${R('<p style="margin:0">44571 collectée : au crédit. 4456 déductible : au débit. La TVA ne touche pas le résultat d\'une entreprise qui la récupère.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Un article coûte 850 € HT, TVA à 20 %. Quel est son prix TTC ?', r: 1020, u: '€', e: '850 × 1,20 = 1 020 €.'},
  {t: 'calcul', q: 'Une note de restaurant s\'élève à 1 320 € TTC, TVA à 10 %. Quel est le montant HT ?', r: 1200, u: '€', h: 'Divisez par 1,10.', e: '1 320 ÷ 1,10 = 1 200 € HT, soit 120 € de TVA.'},
  {t: 'qcm', q: 'Pour une entreprise qui récupère la TVA, la TVA payée sur un achat est…', o: ['une charge', 'un produit', 'une créance sur l\'État', 'une dette envers le fournisseur uniquement'], r: 2, e: 'Elle sera déduite de la TVA collectée. C\'est un compte de tiers, pas une charge.'},
  {t: 'calcul', q: 'Sur le mois : TVA collectée 12 400 €, TVA déductible sur biens et services 7 900 €, sur immobilisations 1 500 €. Quelle est la TVA à décaisser ?', r: 3000, u: '€', e: '12 400 − 7 900 − 1 500 = 3 000 €.'},
  {t: 'ecriture', q: 'Passez l\'écriture de déclaration : TVA collectée 6 000 €, TVA déductible sur biens et services 3 500 €, TVA déductible sur immobilisations 500 €.', l: [['44571', 6000, 0], ['44566', 0, 3500], ['44562', 0, 500], ['44551', 0, 2000]], e: 'On solde chaque compte de TVA par le sens inverse de son solde. La différence, 2 000 €, devient une dette au 44551.'},
  {t: 'ecriture', q: 'Vous payez cette TVA de 2 000 € par télérèglement.', l: [['44551', 2000, 0], ['512', 0, 2000]], e: 'La dette s\'éteint (débit), la banque diminue (crédit).'}
 ]},

{id: 'm-achats-ventes', niv: 2, t: 'Achats et ventes', min: 14,
 chapo: 'La facture est la pièce la plus fréquente. Deux schémas à connaître par cœur, et quelques variantes.',
 h: `
<h2>La facture d'achat</h2>
<p>Une facture de marchandises de 2 000 € HT, TVA 20 % : la charge pour le HT, la TVA déductible à part, et la dette fournisseur pour le TTC.</p>
${J([['607', 2000, 0], ['44566', 400, 0], ['401', 0, 2400]], 'Facture fournisseur')}
<p>Le compte de charge change selon la nature de l'achat : 601 matières premières, 6061 électricité, 6132 loyer, 616 assurance, 6226 honoraires…</p>
<h2>La facture de vente</h2>
<p>Schéma miroir : la créance client pour le TTC, le produit pour le HT, la TVA collectée.</p>
${J([['411', 6000, 0], ['707', 0, 5000], ['44571', 0, 1000]], 'Facture client')}
<h2>Les réductions</h2>
<ul>
<li><strong>Réductions commerciales</strong> (rabais, remise, ristourne) figurant sur la facture : on enregistre directement le <em>net commercial</em>. La remise n'apparaît dans aucun compte.</li>
<li>Accordées <strong>après coup</strong>, sur une facture d'avoir : comptes 609 (obtenues) et 709 (accordées).</li>
<li><strong>Escompte</strong> pour paiement anticipé : c'est une opération financière. 765 escomptes obtenus, 665 escomptes accordés.</li>
</ul>
<h2>L'avoir</h2>
<p>Un client retourne des marchandises : on passe l'écriture inverse de la vente, pour le montant retourné.</p>
${J([['707', 500, 0], ['44571', 100, 0], ['411', 0, 600]], 'Avoir sur retour de marchandises')}
<h2>L'achat d'une immobilisation</h2>
<p>Trois différences avec un achat courant : un compte de classe 2 au lieu d'une charge, la TVA au 44562, et le fournisseur au 404.</p>
${J([['2183', 1500, 0], ['44562', 300, 0], ['404', 0, 1800]], 'Achat d\'un ordinateur')}
${R('<p style="margin:0">Achat : débit charge HT + débit TVA déductible, crédit fournisseur TTC. Vente : débit client TTC, crédit produit HT + crédit TVA collectée.</p>')}`,
 ex: [
  {t: 'ecriture', q: 'Vous recevez une facture d\'achat de marchandises : 3 000 € HT, TVA 20 %.', l: [['607', 3000, 0], ['44566', 600, 0], ['401', 0, 3600]], e: 'Charge HT et TVA déductible au débit, dette fournisseur TTC au crédit.'},
  {t: 'ecriture', q: 'Vous facturez à un client des marchandises pour 5 500 € HT, TVA 20 %.', l: [['411', 6600, 0], ['707', 0, 5500], ['44571', 0, 1100]], e: 'Créance TTC au débit, produit HT et TVA collectée au crédit.'},
  {t: 'ecriture', q: 'Facture d\'achat de marchandises : prix brut 1 000 € HT, remise de 10 % sur facture, TVA 20 %.', l: [['607', 900, 0], ['44566', 180, 0], ['401', 0, 1080]], e: 'On enregistre le net commercial : 900 € HT. La TVA se calcule sur ce net.'},
  {t: 'ecriture', q: 'Vous recevez la facture d\'électricité : 300 € HT, TVA 20 %.', l: [['6061', 300, 0], ['44566', 60, 0], ['401', 0, 360]], e: 'Même schéma que tout achat, avec le compte de charge adapté.'},
  {t: 'ecriture', q: 'Un client vous retourne des marchandises facturées 800 € HT (TVA 20 %). Vous établissez l\'avoir.', l: [['707', 800, 0], ['44571', 160, 0], ['411', 0, 960]], e: 'L\'écriture de vente, à l\'envers : la créance diminue de 960 € TTC.'},
  {t: 'ecriture', q: 'Vous achetez une camionnette : 22 000 € HT, TVA 20 % récupérable.', l: [['2182', 22000, 0], ['44562', 4400, 0], ['404', 0, 26400]], e: 'Immobilisation en classe 2, TVA sur immobilisations, fournisseur d\'immobilisations.'},
  {t: 'qcm', q: 'Votre fournisseur vous accorde 2 % pour paiement comptant. Dans quel compte enregistrer cet escompte ?', o: ['609 – RRR obtenus', '765 – Escomptes obtenus', '707 – Ventes', '665 – Escomptes accordés'], r: 1, e: 'L\'escompte rémunère un paiement anticipé : c\'est un produit financier.'}
 ]},

{id: 'm-banque', niv: 2, t: 'Règlements et rapprochement bancaire', min: 11,
 chapo: 'Payer, encaisser, puis vérifier que la banque et la comptabilité racontent la même histoire.',
 h: `
<h2>Encaisser et payer</h2>
<p>Le client règle sa facture : la banque augmente, la créance s'éteint.</p>
${J([['512', 6000, 0], ['411', 0, 6000]], 'Règlement du client')}
<p>Vous payez un fournisseur : la dette s'éteint, la banque diminue.</p>
${J([['401', 2400, 0], ['512', 0, 2400]], 'Paiement du fournisseur')}
<p>Remarquez qu'aucun compte de charge ou de produit ne bouge : le résultat a été touché à la facture, pas au règlement. Un acompte versé avant la facture passe par le 4091 (versé à un fournisseur) ou le 4191 (reçu d'un client).</p>
<h2>Le rapprochement bancaire</h2>
<p>À une date donnée, le solde du compte 512 et celui du relevé diffèrent presque toujours. Deux raisons :</p>
<ul>
<li><strong>Des décalages de temps</strong> : un chèque que vous avez émis mais que le bénéficiaire n'a pas encore déposé, une remise que la banque n'a pas encore créditée.</li>
<li><strong>Des opérations que vous ignoriez</strong> : frais bancaires, agios, virements reçus, prélèvements. Elles sont sur le relevé, pas encore dans vos comptes.</li>
</ul>
<p>L'<strong>état de rapprochement</strong> corrige chaque solde de ce qui lui manque. Les deux soldes corrigés doivent être identiques. Puis on enregistre les opérations découvertes sur le relevé.</p>
${J([['627', 50, 0], ['44566', 10, 0], ['512', 0, 60]], 'Frais de tenue de compte')}
${R('<p style="margin:0">Un règlement ne crée ni charge ni produit : il solde une créance ou une dette. Le rapprochement se fait au moins une fois par mois.</p>')}`,
 ex: [
  {t: 'ecriture', q: 'Un client vous règle par virement sa facture de 3 600 €.', l: [['512', 3600, 0], ['411', 0, 3600]], e: 'La banque augmente au débit, la créance client disparaît au crédit.'},
  {t: 'ecriture', q: 'Vous payez par virement une facture fournisseur de 1 080 €.', l: [['401', 1080, 0], ['512', 0, 1080]], e: 'La dette s\'éteint au débit, la banque diminue au crédit.'},
  {t: 'ecriture', q: 'Le relevé fait apparaître une commission bancaire : 40 € HT, TVA 20 %.', l: [['627', 40, 0], ['44566', 8, 0], ['512', 0, 48]], e: 'Les services bancaires sont une charge, ici soumise à TVA.'},
  {t: 'calcul', q: 'Le relevé bancaire affiche 13 150 €. Un chèque de 1 000 € que vous avez émis n\'est pas encore débité, et une remise de chèques de 200 € n\'est pas encore créditée. Quel est le solde bancaire corrigé ?', r: 12350, u: '€', h: 'Le chèque émis fera baisser le solde, la remise le fera monter.', e: '13 150 − 1 000 + 200 = 12 350 €.'},
  {t: 'calcul', q: 'Dans le même cas, votre compte 512 affiche 12 400 €. Le relevé contient des frais de 50 € que vous n\'avez pas enregistrés. Quel est le solde comptable corrigé ?', r: 12350, u: '€', e: '12 400 − 50 = 12 350 €. Les deux soldes corrigés concordent : le rapprochement est bouclé.'},
  {t: 'qcm', q: 'Vous versez un acompte de 2 000 € à un fournisseur avant toute facture. Quel compte débiter ?', o: ['607 – Achats', '401 – Fournisseurs', '4091 – Avances et acomptes versés', '4191 – Avances et acomptes reçus'], r: 2, e: 'Tant que rien n\'est livré ni facturé, l\'acompte est une créance sur le fournisseur.'}
 ]},

{id: 'm-paie', niv: 2, t: 'La paie', min: 18,
 chapo: 'Lire une fiche de paie bloc par bloc, puis la passer en comptabilité : ce que gagne le salarié, ce que cela coûte en plus à l\'employeur, et les paiements.',
 h: `
<h2>Du brut au net</h2>
<p>Le <strong>salaire brut</strong> est le montant convenu au contrat. On en retire les <strong>cotisations salariales</strong>, puis le <strong>prélèvement à la source</strong> de l'impôt sur le revenu. Reste le <strong>net à payer</strong>.</p>
<p>L'employeur verse en plus des <strong>cotisations patronales</strong>. Le coût total d'un salarié est donc : brut + cotisations patronales.</p>
${W('paie')}
<p style="font-size:.85rem;color:var(--muted)">Les taux sont arrondis pour l'exemple. Les vrais taux varient selon le statut, le niveau de salaire et les allègements.</p>
<h2>Lire une fiche de paie</h2>
<p>Beaucoup de salariés regardent seulement la dernière ligne. Pourtant, une fiche de paie se lit en <strong>8 blocs</strong>, toujours dans le même ordre, et chacun répond à une question simple. Suivez la visite guidée : Naelys vous explique chaque bloc du bulletin de Sami, monteur chez Atelier Lumen.</p>
${W('bulletin')}
${R('<p style="margin:0">Brut − cotisations salariales = <strong>net à payer avant impôt</strong>. Moins le prélèvement à la source = <strong>net à payer</strong>, ce qui arrive sur le compte. Côté employeur : brut + cotisations patronales − allègements = <strong>coût total</strong>.</p>')}
<h2>Les écritures</h2>
<p>Brut de 3 000 €, cotisations salariales 660 €, prélèvement à la source 90 €.</p>
${J([['641', 3000, 0], ['431', 0, 660], ['4421', 0, 90], ['421', 0, 2250]], 'Bulletin de paie')}
<p>Cotisations patronales de 1 200 € :</p>
${J([['645', 1200, 0], ['431', 0, 1200]], 'Charges patronales')}
<p>Puis les paiements : le salarié en fin de mois, les organismes le mois suivant.</p>
${J([['421', 2250, 0], ['512', 0, 2250]], 'Virement du salaire')}
${R('<p style="margin:0">La charge de personnel, c\'est le brut (641) plus les cotisations patronales (645). Les cotisations salariales ne sont pas une charge en plus : elles sont déjà dans le brut.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Brut : 2 500 €. Cotisations salariales : 550 €. Prélèvement à la source : 75 €. Quel est le net à payer ?', r: 1875, u: '€', e: '2 500 − 550 − 75 = 1 875 €.'},
  {t: 'calcul', q: 'Pour ce même salarié, les cotisations patronales sont de 1 000 €. Quel est le coût total pour l\'employeur ?', r: 3500, u: '€', h: 'Les cotisations salariales sont déjà comprises dans le brut.', e: 'Brut 2 500 + cotisations patronales 1 000 = 3 500 €.'},
  {t: 'ecriture', q: 'Enregistrez ce bulletin : brut 2 500 €, cotisations salariales 550 €, prélèvement à la source 75 €.', l: [['641', 2500, 0], ['431', 0, 550], ['4421', 0, 75], ['421', 0, 1875]], e: 'Le brut en charge, réparti entre trois dettes : organismes sociaux, État, salarié.'},
  {t: 'ecriture', q: 'Enregistrez les cotisations patronales de 1 000 €.', l: [['645', 1000, 0], ['431', 0, 1000]], e: 'Une charge supplémentaire, due à l\'URSSAF.'},
  {t: 'ecriture', q: 'Vous virez au salarié son net à payer de 1 875 €.', l: [['421', 1875, 0], ['512', 0, 1875]], e: 'La dette envers le salarié s\'éteint.'},
  {t: 'qcm', q: 'Avant le versement du salaire, le compte 421 représente…', o: ['une créance sur le salarié', 'une dette envers le salarié', 'une charge', 'un produit'], r: 1, e: 'Le salaire est dû dès que le travail est fait : c\'est une dette, au passif, jusqu\'au virement.'},
  {t: 'qcm', q: 'Sur une fiche de paie, quelle ligne correspond à la somme qui arrive sur le compte bancaire du salarié ?', o: ['Le salaire brut', 'Le net imposable', 'Le net à payer avant impôt', 'Le net à payer'], r: 3, e: 'Le net à payer, en bas et encadré, est versé après le prélèvement à la source. Le net imposable sert seulement à calculer l\'impôt.'},
  {t: 'tri', q: 'Qui paie cette cotisation ?', cats: ['Salarié et employeur', 'Employeur seulement'], items: [['Retraite de base (Sécurité sociale)', 0], ['Retraite complémentaire', 0], ['Assurance chômage', 1], ['Allocations familiales', 1], ['Accidents du travail', 1], ['CSG et CRDS', 0]], e: 'Depuis 2018, le salarié ne cotise plus à l\'assurance chômage. La CSG et la CRDS sont, elles, prélevées sur le salaire.'},
  {t: 'qcm', q: 'Pourquoi le net imposable est-il plus élevé que le net à payer avant impôt ?', o: ['Parce qu\'il inclut les heures supplémentaires', 'Parce qu\'on y rajoute la CSG non déductible, la CRDS et la part employeur de la mutuelle', 'Parce qu\'il est calculé avant toutes les cotisations', 'Ce n\'est jamais le cas'], r: 1, e: 'Une partie de ce qui a été prélevé reste imposable : la CSG non déductible et la CRDS. La part de mutuelle payée par l\'employeur est aussi un avantage imposable.'}
 ]},

/* ───────────── NIVEAU 3 ───────────── */
{id: 'm-amortissements', niv: 3, t: 'Immobilisations et amortissements', min: 13,
 chapo: 'Une machine sert plusieurs années. Son coût se répartit sur toute sa durée d\'utilisation.',
 h: `
<h2>Qu'est-ce qu'une immobilisation ?</h2>
<p>Un bien que l'entreprise contrôle et utilisera au-delà de l'exercice en cours. Il s'inscrit à l'actif pour son coût d'acquisition : prix d'achat HT plus les frais nécessaires à sa mise en service (transport, installation). Par tolérance fiscale, le petit matériel de moins de 500 € HT peut passer directement en charge.</p>
<h2>Amortir, c'est répartir</h2>
<p>L'amortissement constate, chaque année, la part du bien « consommée » par l'usage. Méthode la plus courante, le <strong>linéaire</strong> :</p>
<p class="mono">Annuité = base amortissable ÷ durée d'utilisation</p>
<p>La première année, on compte seulement depuis la date de mise en service : c'est le <em>prorata temporis</em>, calculé sur une année de 360 jours, soit 30 jours par mois.</p>
${W('amort')}
<h2>L'écriture de dotation</h2>
<p>Machine de 24 000 € amortie sur 5 ans, mise en service le 1<sup>er</sup> avril : 24 000 ÷ 5 × 9/12 = 3 600 € la première année.</p>
${J([['6811', 3600, 0], ['28154', 0, 3600]], 'Dotation de l\'exercice')}
<p>Le compte 28 vient en déduction de l'immobilisation au bilan. On y lit trois colonnes : valeur brute, amortissements cumulés, et <strong>valeur nette comptable</strong> (VNC).</p>
<h2>Une charge sans sortie d'argent</h2>
<p>La dotation réduit le résultat, mais rien ne sort de la banque : l'argent est sorti le jour de l'achat. On parle de <em>charge calculée</em>. C'est ce qui explique l'écart entre résultat et trésorerie, que vous retrouverez avec la capacité d'autofinancement.</p>
<p>Pour aller plus loin : l'amortissement dégressif (avantage fiscal sur certains biens neufs) et l'amortissement par composants (un immeuble se décompose en structure, toiture, installations).</p>
${R('<p style="margin:0">Débit 6811, crédit 28… chaque année. VNC = valeur brute − amortissements cumulés. Un terrain ne s\'amortit pas : il ne s\'use pas.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Un véhicule de 30 000 € HT est amorti en linéaire sur 5 ans. Quelle est l\'annuité complète ?', r: 6000, u: '€', e: '30 000 ÷ 5 = 6 000 € par an.'},
  {t: 'calcul', q: 'Une machine de 24 000 € HT, amortie sur 5 ans, est mise en service le 1er avril. Quelle est la dotation de la première année (clôture au 31 décembre) ?', r: 3600, u: '€', h: 'D\'avril à décembre : 9 mois.', e: '4 800 × 9/12 = 3 600 €.'},
  {t: 'ecriture', q: 'Passez l\'écriture de cette dotation de 3 600 € sur le matériel industriel.', l: [['6811', 3600, 0], ['28154', 0, 3600]], e: 'Charge au débit, amortissement cumulé au crédit.'},
  {t: 'calcul', q: 'Quelle est la valeur nette comptable de cette machine à la fin de la deuxième année ?', r: 15600, u: '€', e: '24 000 − 3 600 − 4 800 = 15 600 €.'},
  {t: 'qcm', q: 'Quel est l\'effet d\'une dotation aux amortissements sur la trésorerie ?', o: ['Elle la diminue du montant de la dotation', 'Elle l\'augmente', 'Aucun effet direct', 'Elle la diminue de la TVA'], r: 2, e: 'C\'est une charge calculée : elle réduit le résultat sans sortie d\'argent.'},
  {t: 'ecriture', q: 'Un ordinateur de 1 800 € HT, acquis le 1er juillet, est amorti sur 3 ans. Passez la dotation de la première année.', l: [['6811', 300, 0], ['28183', 0, 300]], e: '1 800 ÷ 3 × 6/12 = 300 €.'}
 ]},

{id: 'm-depreciations', niv: 3, t: 'Dépréciations et provisions', min: 12,
 chapo: 'Le principe de prudence : une perte probable se constate tout de suite, un gain seulement quand il est certain.',
 h: `
<h2>Deux notions à ne pas confondre</h2>
<ul>
<li>Une <strong>dépréciation</strong> constate qu'un <em>actif</em> vaut probablement moins que sa valeur comptable : un client en difficulté, un stock démodé. Elle est réversible.</li>
<li>Une <strong>provision</strong> constate un <em>passif</em> dont l'échéance ou le montant est incertain : un procès en cours, une garantie donnée aux clients.</li>
</ul>
<h2>Le client douteux</h2>
<p>Un client doit 6 000 € TTC (5 000 € HT) et rencontre de graves difficultés. D'abord, on isole la créance :</p>
${J([['416', 6000, 0], ['411', 0, 6000]], 'Reclassement en client douteux')}
<p>Puis on déprécie la perte probable, calculée sur le <strong>hors taxes</strong> : si la créance devient irrécouvrable, la TVA sera récupérée. Ici on estime la perte à 40 %.</p>
${J([['6817', 2000, 0], ['491', 0, 2000]], 'Dépréciation de la créance')}
<p>Chaque année, on ajuste. Si le risque disparaît, on reprend la dépréciation : débit 491, crédit 7817. Si la perte devient définitive, on solde la créance (débit 654 pour le HT, 44571 pour la TVA, crédit 416) et on reprend la dépréciation devenue sans objet.</p>
<h2>La provision pour litige</h2>
<p>Un ancien salarié réclame 15 000 € aux prud'hommes ; l'avocat estime le risque à 8 000 €.</p>
${J([['6815', 8000, 0], ['1511', 0, 8000]], 'Provision pour litige')}
<p>Trois conditions pour provisionner : une obligation existe à la clôture, une sortie de ressources est probable, et le montant peut être estimé de façon fiable.</p>
${R('<p style="margin:0">Dépréciation : compte en 29, 39 ou 49, en moins d\'un actif. Provision : compte en 15, au passif. Dans les deux cas, une dotation en 68 et, plus tard, une reprise en 78.</p>')}`,
 ex: [
  {t: 'qcm', q: 'Un procès est en cours contre l\'entreprise et son issue est probablement défavorable. Que constate-t-on ?', o: ['Une dépréciation', 'Une provision', 'Une charge constatée d\'avance', 'Rien avant le jugement'], r: 1, e: 'Passif probable au montant incertain : c\'est une provision. La dépréciation ne concerne que les actifs.'},
  {t: 'ecriture', q: 'Un client qui vous doit 3 600 € TTC est placé en redressement judiciaire. Reclassez sa créance.', l: [['416', 3600, 0], ['411', 0, 3600]], e: 'On transfère la créance, pour son montant TTC, du 411 vers le 416.'},
  {t: 'calcul', q: 'Vous estimez perdre 60 % de cette créance de 3 600 € TTC (TVA 20 %). Quel est le montant de la dépréciation ?', r: 1800, u: '€', h: 'La dépréciation se calcule sur le montant hors taxes.', e: 'HT : 3 600 ÷ 1,20 = 3 000 €. Dépréciation : 3 000 × 60 % = 1 800 €.'},
  {t: 'ecriture', q: 'Enregistrez cette dépréciation de 1 800 €.', l: [['6817', 1800, 0], ['491', 0, 1800]], e: 'Dotation en charge, dépréciation en diminution des créances clients.'},
  {t: 'ecriture', q: 'L\'année suivante, le client paie intégralement. Reprenez la dépréciation de 1 800 €.', l: [['491', 1800, 0], ['7817', 0, 1800]], e: 'La dépréciation n\'a plus d\'objet : on la solde par un produit de reprise.'},
  {t: 'ecriture', q: 'Un litige prud\'homal fait peser un risque estimé à 12 000 €. Constituez la provision.', l: [['6815', 12000, 0], ['1511', 0, 12000]], e: 'Dotation en charge d\'exploitation, provision au passif.'}
 ]},

{id: 'm-regularisations', niv: 3, t: 'Les régularisations de fin d\'exercice', min: 13,
 chapo: 'Chaque exercice doit porter ses charges et ses produits, tous, et seulement les siens.',
 h: `
<h2>L'indépendance des exercices</h2>
<p>Les factures ne tombent pas toujours du bon côté du 31 décembre. À la clôture, on corrige ces décalages. Il existe quatre cas, selon que la facture est déjà enregistrée ou pas encore.</p>
<div class="scroll"><table class="tb"><thead><tr><th>Situation à la clôture</th><th>Régularisation</th><th>Compte</th></tr></thead><tbody>
<tr><td>Charge enregistrée, qui concerne en partie l'exercice suivant</td><td>Charge constatée d'avance</td><td class="n">486</td></tr>
<tr><td>Produit enregistré, qui concerne en partie l'exercice suivant</td><td>Produit constaté d'avance</td><td class="n">487</td></tr>
<tr><td>Bien ou service reçu, facture pas encore arrivée</td><td>Facture non parvenue</td><td class="n">4081</td></tr>
<tr><td>Bien livré ou service rendu, facture pas encore émise</td><td>Facture à établir</td><td class="n">4181</td></tr></tbody></table></div>
<h2>Charge constatée d'avance</h2>
<p>Le 1<sup>er</sup> octobre, vous payez 1 200 € d'assurance pour douze mois. Neuf mois concernent l'année suivante : 1 200 × 9/12 = 900 €.</p>
${J([['486', 900, 0], ['616', 0, 900]], 'Assurance : part de l\'exercice suivant')}
<h2>Facture non parvenue</h2>
<p>Des marchandises reçues le 28 décembre pour 2 000 € HT, la facture arrivera en janvier. La charge appartient à l'exercice.</p>
${J([['607', 2000, 0], ['44586', 400, 0], ['4081', 0, 2400]], 'Facture non parvenue')}
<h2>Produit constaté d'avance et facture à établir</h2>
<p>Un abonnement annuel facturé 3 600 € HT le 1<sup>er</sup> novembre : dix mois sur douze reviennent à l'exercice suivant.</p>
${J([['706', 3000, 0], ['487', 0, 3000]], 'Abonnement : part de l\'exercice suivant')}
<p>Une prestation de 1 000 € HT terminée en décembre, facturée en janvier :</p>
${J([['4181', 1200, 0], ['706', 0, 1000], ['44587', 0, 200]], 'Facture à établir')}
<h2>L'extourne</h2>
<p>Au premier jour de l'exercice suivant, on passe toutes ces écritures à l'envers. Ainsi, quand la vraie facture arrive, elle s'enregistre normalement et l'effet sur le nouveau résultat est nul.</p>
${R('<p style="margin:0">Les charges et produits constatés d\'avance se calculent hors taxes et retirent du résultat. Les factures non parvenues et à établir ajoutent au résultat, avec une TVA « en attente ».</p>')}`,
 ex: [
  {t: 'qcm', q: 'Vous avez reçu en décembre une prestation de maintenance, mais la facture n\'arrivera qu\'en janvier. Quelle régularisation ?', o: ['Charge constatée d\'avance', 'Produit constaté d\'avance', 'Facture non parvenue', 'Facture à établir'], r: 2, e: 'Le service est consommé, la charge est due : on l\'enregistre sans attendre la facture.'},
  {t: 'calcul', q: 'Le 1er septembre, vous payez un loyer annuel de 6 000 € HT couvrant douze mois. Quel montant constater d\'avance au 31 décembre ?', r: 4000, u: '€', h: 'Huit mois concernent l\'exercice suivant.', e: '6 000 × 8/12 = 4 000 €.'},
  {t: 'ecriture', q: 'Passez l\'écriture de cette charge constatée d\'avance de 4 000 € sur le loyer.', l: [['486', 4000, 0], ['6132', 0, 4000]], e: 'On retire 4 000 € des charges de l\'exercice et on les porte à l\'actif.'},
  {t: 'ecriture', q: 'Marchandises reçues le 29 décembre pour 1 500 € HT (TVA 20 %), facture non parvenue à la clôture.', l: [['607', 1500, 0], ['44586', 300, 0], ['4081', 0, 1800]], e: 'Comme une facture d\'achat, avec les comptes d\'attente 44586 et 4081.'},
  {t: 'ecriture', q: 'Vous avez facturé le 1er décembre un contrat de maintenance de 2 400 € HT couvrant douze mois. Régularisez au 31 décembre.', l: [['706', 2200, 0], ['487', 0, 2200]], e: 'Onze mois sur douze concernent l\'exercice suivant : 2 400 × 11/12 = 2 200 €.'},
  {t: 'ecriture', q: 'Une mission de conseil de 3 000 € HT (TVA 20 %) est achevée le 20 décembre ; la facture partira en janvier.', l: [['4181', 3600, 0], ['706', 0, 3000], ['44587', 0, 600]], e: 'Le produit est acquis : on le constate avec une créance « à facturer ».'}
 ]},

{id: 'm-stocks', niv: 3, t: 'Les stocks', min: 10,
 chapo: 'Ce qui a été acheté mais pas encore vendu n\'est pas une charge de l\'exercice.',
 h: `
<h2>L'inventaire</h2>
<p>En cours d'année, les achats passent en charge (607, 601) et les comptes de stock ne bougent pas. À la clôture, on compte physiquement ce qui reste : c'est l'<strong>inventaire</strong>. Deux écritures mettent alors les stocks à jour.</p>
<p>On annule le stock de début d'exercice (8 000 €) :</p>
${J([['6037', 8000, 0], ['37', 0, 8000]], 'Annulation du stock initial')}
<p>Et on constate le stock de fin d'exercice (11 000 €) :</p>
${J([['37', 11000, 0], ['6037', 0, 11000]], 'Constatation du stock final')}
<h2>L'effet sur le résultat</h2>
<p>Le compte 6037 corrige les achats pour ne garder en charge que ce qui a été réellement vendu :</p>
<p class="mono">Coût d'achat des marchandises vendues = achats + stock initial − stock final</p>
<p>Si le stock augmente, les charges diminuent : une partie des achats n'a pas été consommée. Pour les produits fabriqués, la logique est la même côté produits, avec le compte 7135 (production stockée = stock final − stock initial).</p>
<h2>Combien vaut le stock ?</h2>
<p>Les articles entrent à leur coût d'achat ou de production. Quand les prix varient, deux méthodes sont admises : le <strong>coût moyen pondéré</strong> (CMUP) et le <strong>premier entré, premier sorti</strong> (PEPS, ou FIFO).</p>
<p>Si un article vaut moins que son coût (abîmé, démodé), on le déprécie : débit 6817, crédit 397.</p>
${R('<p style="margin:0">Stock initial : débit 6037, crédit 37. Stock final : débit 37, crédit 6037. Un stock final surévalué gonfle le résultat : c\'est un point très surveillé par les auditeurs.</p>')}`,
 ex: [
  {t: 'ecriture', q: 'À la clôture, annulez le stock initial de marchandises : 14 000 €.', l: [['6037', 14000, 0], ['37', 0, 14000]], e: 'Le stock de début d\'année est réputé consommé : il passe en charge.'},
  {t: 'ecriture', q: 'L\'inventaire donne un stock final de 9 500 €. Constatez-le.', l: [['37', 9500, 0], ['6037', 0, 9500]], e: 'Ce qui reste en stock est retiré des charges et porté à l\'actif.'},
  {t: 'calcul', q: 'Achats de l\'exercice : 120 000 €. Stock initial : 14 000 €. Stock final : 9 500 €. Quel est le coût d\'achat des marchandises vendues ?', r: 124500, u: '€', e: '120 000 + 14 000 − 9 500 = 124 500 €. Le stock a baissé : on a vendu plus qu\'on n\'a acheté.'},
  {t: 'qcm', q: 'Le stock final est plus élevé que le stock initial. Quel effet sur les charges de l\'exercice ?', o: ['Elles augmentent', 'Elles diminuent', 'Aucun effet', 'Cela dépend de la TVA'], r: 1, e: 'Une partie des achats est restée en stock : elle sort des charges.'},
  {t: 'calcul', q: 'Vous avez 100 unités à 10 € en stock, puis vous en achetez 300 à 12 €. Quel est le coût moyen pondéré d\'une unité ?', r: 11.5, u: '€', e: '(100 × 10 + 300 × 12) ÷ 400 = 4 600 ÷ 400 = 11,50 €.'}
 ]},

{id: 'm-emprunts', niv: 3, t: 'Les emprunts', min: 9,
 chapo: 'Dans une échéance, seuls les intérêts sont une charge. Le capital remboursé réduit simplement la dette.',
 h: `
<h2>La vie d'un emprunt</h2>
<p>À la mise à disposition des fonds :</p>
${J([['512', 50000, 0], ['164', 0, 50000]], 'Déblocage de l\'emprunt')}
<p>Chaque échéance contient deux parts. Le <strong>capital</strong> remboursé diminue la dette au bilan. Les <strong>intérêts</strong> sont le prix de l'argent : une charge financière. Pour une échéance de 1 000 € dont 150 € d'intérêts :</p>
${J([['164', 850, 0], ['6611', 150, 0], ['512', 0, 1000]], 'Échéance de prêt')}
<h2>Le tableau d'amortissement</h2>
<p>La banque fournit un échéancier. Avec des mensualités constantes, les intérêts pèsent lourd au début, puis diminuent à mesure que le capital restant dû baisse.</p>
${W('emprunt')}
<h2>Les intérêts courus</h2>
<p>Si la clôture tombe entre deux échéances, les intérêts déjà « consommés » depuis la dernière échéance sont une charge de l'exercice, même s'ils ne seront payés que plus tard.</p>
${J([['6611', 600, 0], ['1688', 0, 600]], 'Intérêts courus non échus')}
${R('<p style="margin:0">Rembourser un emprunt n\'est pas une charge. Seuls les intérêts passent au compte de résultat. C\'est pourquoi une entreprise bénéficiaire peut manquer de trésorerie.</p>')}`,
 ex: [
  {t: 'ecriture', q: 'La banque débloque un emprunt de 80 000 € sur votre compte.', l: [['512', 80000, 0], ['164', 0, 80000]], e: 'Entrée en banque au débit, dette financière au crédit.'},
  {t: 'ecriture', q: 'Vous payez une mensualité de 1 500 €, dont 320 € d\'intérêts.', l: [['164', 1180, 0], ['6611', 320, 0], ['512', 0, 1500]], e: 'Capital remboursé : 1 500 − 320 = 1 180 €. Seuls les 320 € sont une charge.'},
  {t: 'qcm', q: 'Quelle part d\'une échéance d\'emprunt réduit le résultat ?', o: ['Toute l\'échéance', 'Le capital remboursé', 'Les intérêts', 'Aucune'], r: 2, e: 'Le capital remboursé diminue une dette, ce qui ne change pas le résultat.'},
  {t: 'calcul', q: 'Un emprunt de 60 000 € à 4 % l\'an est remboursé par échéances annuelles le 30 septembre. Quel montant d\'intérêts courus constater au 31 décembre ?', r: 600, u: '€', h: 'Trois mois se sont écoulés depuis la dernière échéance.', e: '60 000 × 4 % × 3/12 = 600 €.'},
  {t: 'ecriture', q: 'Passez l\'écriture de ces intérêts courus de 600 €.', l: [['6611', 600, 0], ['1688', 0, 600]], e: 'La charge est rattachée à l\'exercice, avec une dette d\'intérêts au passif.'}
 ]},

/* ───────────── NIVEAU 4 ───────────── */
{id: 'm-cloture', niv: 4, t: 'Clôture, impôt et affectation du résultat', min: 13,
 chapo: 'Arrêter les comptes, calculer l\'impôt, puis décider de ce que devient le bénéfice.',
 h: `
<h2>Le déroulé d'une clôture</h2>
<ol>
<li><strong>Justifier les comptes</strong> : rapprochements bancaires, lettrage des tiers, contrôle de la TVA et des charges sociales.</li>
<li><strong>Inventorier</strong> : stocks, immobilisations, créances douteuses, litiges.</li>
<li><strong>Passer les écritures d'inventaire</strong> : amortissements, dépréciations, provisions, régularisations, variation des stocks.</li>
<li><strong>Calculer l'impôt</strong> sur les bénéfices.</li>
<li><strong>Établir les comptes annuels</strong> : bilan, compte de résultat, annexe.</li>
<li><strong>Faire approuver</strong> les comptes par les associés dans les six mois, puis les déposer au greffe.</li>
</ol>
<h2>L'impôt sur les sociétés</h2>
<p>L'impôt se calcule sur le <strong>résultat fiscal</strong> : le résultat comptable corrigé de réintégrations (charges non déductibles, comme les amendes) et de déductions. Le taux normal est de 25 %. Les PME peuvent, sous conditions, bénéficier d'un taux réduit de 15 % sur les premiers 42 500 € de bénéfice.</p>
${J([['695', 20000, 0], ['444', 0, 20000]], 'Impôt sur les sociétés de l\'exercice')}
<p>Les acomptes versés en cours d'année ont été débités au 444 : le solde du compte donne ce qui reste à payer, ou ce que l'État doit rembourser.</p>
<h2>L'affectation du résultat</h2>
<p>Après approbation, le bénéfice est réparti. Dans les SARL et les sociétés par actions, on dote d'abord la <strong>réserve légale</strong> : 5 % du bénéfice, jusqu'à ce qu'elle atteigne 10 % du capital. Le reste peut être distribué en dividendes, mis en réserve ou laissé en report à nouveau.</p>
${J([['120', 50000, 0], ['1061', 0, 2500], ['457', 0, 30000], ['110', 0, 17500]], 'Affectation du bénéfice')}
${R('<p style="margin:0">L\'impôt est une charge de l\'exercice (695). L\'affectation, elle, ne touche pas le compte de résultat : elle déplace le bénéfice à l\'intérieur du passif.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Le résultat fiscal est de 80 000 €, sans taux réduit. Quel est l\'impôt sur les sociétés au taux de 25 % ?', r: 20000, u: '€', e: '80 000 × 25 % = 20 000 €.'},
  {t: 'calcul', q: 'Une PME éligible au taux réduit dégage un résultat fiscal de 100 000 €. Quel est son impôt ?', r: 20750, u: '€', h: '15 % sur les premiers 42 500 €, 25 % au-delà.', e: '42 500 × 15 % = 6 375 €. 57 500 × 25 % = 14 375 €. Total : 20 750 €.'},
  {t: 'ecriture', q: 'Enregistrez un impôt sur les sociétés de 20 750 €.', l: [['695', 20750, 0], ['444', 0, 20750]], e: 'Charge d\'impôt au débit, dette envers l\'État au crédit.'},
  {t: 'calcul', q: 'Bénéfice : 40 000 €. Capital : 100 000 €. La réserve légale est déjà de 9 000 €. Quelle dotation minimale à la réserve légale ?', r: 1000, u: '€', h: 'Le plafond est de 10 % du capital.', e: '5 % du bénéfice ferait 2 000 €, mais il ne manque que 1 000 € pour atteindre le plafond de 10 000 €.'},
  {t: 'ecriture', q: 'Affectez un bénéfice de 60 000 € : 3 000 € en réserve légale, 40 000 € de dividendes, le reste en report à nouveau.', l: [['120', 60000, 0], ['1061', 0, 3000], ['457', 0, 40000], ['110', 0, 17000]], e: 'On solde le compte 120 et on répartit : 60 000 − 3 000 − 40 000 = 17 000 € en report à nouveau.'},
  {t: 'qcm', q: 'Une amende de 1 500 € figure dans les charges. Quelle conséquence pour le résultat fiscal ?', o: ['Aucune', 'Elle est réintégrée : le résultat fiscal augmente', 'Elle est déduite une seconde fois', 'Elle est reportée à l\'exercice suivant'], r: 1, e: 'Les amendes ne sont pas déductibles. On les ajoute au résultat comptable pour calculer l\'impôt.'}
 ]},

{id: 'm-sig', niv: 4, t: 'Soldes intermédiaires de gestion', min: 12,
 chapo: 'Le résultat net ne dit pas d\'où vient la performance. Les soldes intermédiaires découpent sa formation, étage par étage.',
 h: `
<h2>La cascade</h2>
<ul>
<li><strong>Marge commerciale</strong> = ventes de marchandises − coût d'achat des marchandises vendues. Le cœur d'une activité de négoce.</li>
<li><strong>Valeur ajoutée</strong> = marge commerciale + production − consommations en provenance des tiers (achats, loyers, sous-traitance, honoraires). La richesse créée par l'entreprise.</li>
<li><strong>Excédent brut d'exploitation</strong> (EBE) = valeur ajoutée − impôts et taxes − charges de personnel. Ce que dégage l'exploitation, avant toute politique d'investissement et de financement.</li>
<li><strong>Résultat d'exploitation</strong> = EBE − dotations + reprises ± autres charges et produits de gestion.</li>
<li><strong>Résultat courant avant impôt</strong> = résultat d'exploitation + résultat financier.</li>
<li><strong>Résultat net</strong> = résultat courant + résultat exceptionnel − participation − impôt sur les bénéfices.</li>
</ul>
${W('sig')}
<h2>La capacité d'autofinancement</h2>
<p>La <strong>CAF</strong> mesure l'argent que l'activité a réellement généré. On repart du résultat net et on neutralise ce qui n'a pas touché la trésorerie :</p>
<p class="mono">CAF = résultat net + dotations − reprises − plus-values de cession</p>
<p>Elle sert à rembourser les emprunts, financer les investissements et verser les dividendes.</p>
<h2>Lire les soldes</h2>
<p>On les rapporte au chiffre d'affaires pour comparer d'une année ou d'une entreprise à l'autre : taux de marge commerciale, taux de valeur ajoutée, EBE sur chiffre d'affaires. Un EBE négatif signale un métier qui perd de l'argent avant même d'avoir payé ses machines et ses banquiers.</p>
${R('<p style="margin:0">L\'EBE est l\'indicateur de performance le plus comparable : il ne dépend ni des choix d\'amortissement, ni de l\'endettement, ni de l\'impôt.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Ventes de marchandises : 400 000 €. Achats : 250 000 €. Stock initial : 30 000 €. Stock final : 40 000 €. Quelle est la marge commerciale ?', r: 160000, u: '€', h: 'Calculez d\'abord le coût d\'achat des marchandises vendues.', e: 'Coût d\'achat des marchandises vendues : 250 000 + 30 000 − 40 000 = 240 000 €. Marge : 160 000 €.'},
  {t: 'calcul', q: 'Marge commerciale : 160 000 €. Production vendue : 60 000 €. Consommations en provenance des tiers : 70 000 €. Quelle est la valeur ajoutée ?', r: 150000, u: '€', e: '160 000 + 60 000 − 70 000 = 150 000 €.'},
  {t: 'calcul', q: 'Valeur ajoutée : 150 000 €. Impôts et taxes : 8 000 €. Charges de personnel : 95 000 €. Quel est l\'EBE ?', r: 47000, u: '€', e: '150 000 − 8 000 − 95 000 = 47 000 €.'},
  {t: 'calcul', q: 'Résultat net : 30 000 €. Dotations aux amortissements : 25 000 €. Reprises sur provisions : 5 000 €. Quelle est la CAF ?', r: 50000, u: '€', e: '30 000 + 25 000 − 5 000 = 50 000 €.'},
  {t: 'qcm', q: 'Deux entreprises ont le même EBE. L\'une a un résultat net bien plus faible. Quelle explication est la plus plausible ?', o: ['Elle vend moins', 'Elle paie plus de salaires', 'Elle est plus endettée ou amortit davantage', 'Elle a une marge commerciale plus faible'], r: 2, e: 'Ventes, marge et salaires sont déjà dans l\'EBE. L\'écart naît après : dotations, intérêts, impôt.'}
 ]},

{id: 'm-analyse', niv: 4, t: 'Analyser le bilan', min: 13,
 chapo: 'Fonds de roulement, besoin en fonds de roulement, trésorerie : trois chiffres pour juger de l\'équilibre financier.',
 h: `
<h2>Le bilan fonctionnel</h2>
<p>On reclasse le bilan en trois étages, selon le cycle auquel chaque poste appartient :</p>
<ul>
<li><strong>Le long terme</strong> : ressources stables (capitaux propres, amortissements, emprunts) face aux emplois stables (immobilisations brutes).</li>
<li><strong>L'exploitation</strong> : stocks et créances face aux dettes fournisseurs, fiscales et sociales.</li>
<li><strong>La trésorerie</strong> : disponibilités face aux découverts.</li>
</ul>
<h2>Trois indicateurs liés</h2>
<p><strong>Fonds de roulement</strong> (FR) = ressources stables − emplois stables. C'est le matelas de financement long qui reste après avoir payé les immobilisations.</p>
<p><strong>Besoin en fonds de roulement</strong> (BFR) = stocks + créances − dettes d'exploitation. C'est l'argent immobilisé par le décalage entre ce qu'on paie et ce qu'on encaisse.</p>
<p><strong>Trésorerie nette</strong> = FR − BFR.</p>
${W('frbfr')}
<h2>Les ratios à connaître</h2>
<ul>
<li><strong>Délai clients</strong> = créances clients TTC ÷ chiffre d'affaires TTC × 360 jours.</li>
<li><strong>Délai fournisseurs</strong> = dettes fournisseurs TTC ÷ achats TTC × 360 jours.</li>
<li><strong>Rotation des stocks</strong> = stock moyen ÷ coût d'achat des marchandises vendues × 360 jours.</li>
<li><strong>Autonomie financière</strong> = capitaux propres ÷ total du bilan.</li>
<li><strong>Capacité de remboursement</strong> = dettes financières ÷ CAF. Les banques aiment la voir sous 3 à 4 ans.</li>
</ul>
${P('Une entreprise en forte croissance voit son BFR grimper : plus de stocks, plus de créances. Si le fonds de roulement ne suit pas, la trésorerie plonge alors même que les ventes et les bénéfices augmentent.')}
${R('<p style="margin:0">Trésorerie nette = FR − BFR. Pour l\'améliorer : renforcer les ressources stables, ou réduire le BFR en encaissant plus vite, en stockant moins, en négociant ses délais fournisseurs.</p>')}`,
 ex: [
  {t: 'calcul', q: 'Capitaux propres : 150 000 €. Emprunts : 90 000 €. Immobilisations : 200 000 €. Quel est le fonds de roulement ?', r: 40000, u: '€', e: '(150 000 + 90 000) − 200 000 = 40 000 €.'},
  {t: 'calcul', q: 'Stocks : 50 000 €. Créances clients : 80 000 €. Dettes fournisseurs, fiscales et sociales : 70 000 €. Quel est le BFR ?', r: 60000, u: '€', e: '50 000 + 80 000 − 70 000 = 60 000 €.'},
  {t: 'calcul', q: 'Avec un fonds de roulement de 40 000 € et un BFR de 60 000 €, quelle est la trésorerie nette ? (Indiquez le signe.)', r: -20000, u: '€', e: '40 000 − 60 000 = −20 000 €. L\'entreprise finance une partie de son exploitation par du découvert.'},
  {t: 'calcul', q: 'Créances clients : 60 000 € TTC. Chiffre d\'affaires annuel : 720 000 € TTC. Quel est le délai moyen de règlement des clients, en jours ?', r: 30, u: 'jours', e: '60 000 ÷ 720 000 × 360 = 30 jours.'},
  {t: 'qcm', q: 'Le chiffre d\'affaires bondit de 40 % et les délais de paiement restent les mêmes. Que devient le BFR ?', o: ['Il diminue', 'Il reste stable', 'Il augmente à peu près dans la même proportion', 'Il devient négatif'], r: 2, e: 'Stocks, créances et dettes d\'exploitation suivent l\'activité. C\'est le piège de la croissance mal financée.'},
  {t: 'qcm', q: 'Dettes financières : 300 000 €. CAF : 50 000 €. Comment un banquier lira-t-il ce ratio ?', o: ['Excellent : 6 ans de CAF', 'Tendu : il faudrait 6 ans de CAF pour rembourser', 'Sans intérêt', 'Signe d\'un BFR négatif'], r: 1, e: '300 000 ÷ 50 000 = 6 ans, au-delà du repère habituel de 3 à 4 ans.'}
 ]},

{id: 'm-liasse', niv: 4, t: 'La liasse fiscale', min: 13,
 chapo: "Les comptes annuels parlent aux associés. La liasse fiscale les traduit pour l'administration, et en tire l'impôt.",
 h: `
<h2>Un jeu de formulaires normalisés</h2>
<p>Chaque année, la société transmet à l'administration une <strong>liasse fiscale</strong> : des tableaux numérotés qui reprennent les comptes et en déduisent le résultat imposable. Le jeu dépend du régime d'imposition.</p>
<ul>
<li><strong>Régime réel normal</strong> : tableaux 2050 à 2059.</li>
<li><strong>Régime simplifié</strong> : tableaux 2033-A à 2033-G, plus courts.</li>
</ul>
<div class="scroll"><table class="tb"><thead><tr><th>Tableau</th><th>Contenu</th></tr></thead><tbody>
<tr><td class="n">2050 · 2051</td><td>Bilan actif, bilan passif</td></tr>
<tr><td class="n">2052 · 2053</td><td>Compte de résultat</td></tr>
<tr><td class="n">2054 à 2056</td><td>Immobilisations, amortissements, provisions</td></tr>
<tr><td class="n">2058-A</td><td>Détermination du résultat fiscal</td></tr>
<tr><td class="n">2058-B</td><td>Suivi des déficits</td></tr>
<tr><td class="n">2059</td><td>Plus et moins-values</td></tr></tbody></table></div>
<p>Pour un exercice clos le 31 décembre, la liasse est due au plus tard le deuxième jour ouvré qui suit le 1<sup>er</sup> mai. La télétransmission ajoute quinze jours de délai.</p>
<h2>Du résultat comptable au résultat fiscal</h2>
<p>Le tableau 2058-A part du résultat comptable et le corrige, car le droit fiscal ne retient pas toutes les charges ni tous les produits.</p>
<ul>
<li><strong>Réintégrations</strong> : charges comptabilisées mais non déductibles. L'impôt sur les sociétés lui-même, les amendes et pénalités, la part d'amortissement d'un véhicule de tourisme au-delà du plafond fiscal, les dépenses somptuaires (chasse, yacht).</li>
<li><strong>Déductions</strong> : produits comptabilisés mais non imposables, ou avantages fiscaux. Les dividendes reçus d'une filiale sous le régime mère-fille (sauf une quote-part de 5 % qui reste imposée), l'imputation des déficits antérieurs.</li>
</ul>
<p class="mono">Résultat fiscal = résultat comptable + réintégrations − déductions</p>
${P("L'impôt sur les sociétés est une charge du compte 695, mais il n'est pas déductible de sa propre base. On le réintègre toujours.")}
<h2>Les déficits</h2>
<p>Une perte fiscale n'est pas perdue. Elle se <strong>reporte en avant</strong> sur les bénéfices suivants, sans limite de durée, dans la limite d'un million d'euros par an plus 50 % du bénéfice au-delà. Sur option, elle peut aussi être <strong>reportée en arrière</strong> sur le bénéfice de l'exercice précédent, dans la limite d'un million d'euros : la société obtient alors une créance sur l'État.</p>
<h2>Payer l'impôt</h2>
<p>Pour un exercice calendaire, l'impôt se paie par quatre <strong>acomptes</strong> (15 mars, 15 juin, 15 septembre, 15 décembre), calculés sur le résultat de l'année précédente. Le <strong>solde</strong> est réglé au plus tard le 15 mai suivant. Si les acomptes dépassent l'impôt dû, l'État rembourse l'excédent.</p>
${R('<p style="margin:0">Liasse = comptes annuels + passage au résultat fiscal. Réintégrer ce qui n\'est pas déductible, déduire ce qui n\'est pas imposable, puis imputer les déficits.</p>')}`,
 ex: [
  {t: 'tri', q: 'Dans quel tableau du régime réel normal trouve-t-on chaque information ?', cats: ['2050', '2052', '2058-A', '2058-B'], items: [['Bilan actif', 0], ['Chiffre d\'affaires de l\'exercice', 1], ['Réintégration des amendes', 2], ['Déficits restant à reporter', 3], ['Créances clients', 0], ['Résultat fiscal', 2]], e: 'Bilan : 2050-2051. Compte de résultat : 2052-2053. Passage au résultat fiscal : 2058-A. Déficits : 2058-B.'},
  {t: 'tri', q: 'Réintégration ou déduction pour calculer le résultat fiscal ?', cats: ['Réintégration', 'Déduction'], items: [['Amende pour excès de vitesse payée par la société', 0], ['Impôt sur les sociétés comptabilisé', 0], ['Amortissement d\'une voiture au-delà du plafond fiscal', 0], ['Déficit d\'un exercice antérieur', 1], ['Dividende reçu d\'une filiale (régime mère-fille), hors quote-part', 1], ['Location d\'une chasse pour des clients', 0]], e: 'Charge non déductible : on la rajoute. Produit non imposable ou déficit à imputer : on le retire.'},
  {t: 'calcul', q: 'Résultat comptable : 50 000 €. Il intègre 10 000 € d\'impôt sur les sociétés et 2 000 € d\'amendes. Quel est le résultat fiscal ?', r: 62000, u: '€', h: 'Les deux charges sont non déductibles.', e: '50 000 + 10 000 + 2 000 = 62 000 €.'},
  {t: 'calcul', q: 'Le résultat fiscal de l\'exercice est de 80 000 €. La société a un déficit antérieur de 30 000 €. Quel est le résultat imposable ?', r: 50000, u: '€', e: 'Le déficit s\'impute en entier, bien en dessous du plafond d\'un million : 80 000 − 30 000 = 50 000 €.'},
  {t: 'calcul', q: 'L\'impôt dû pour l\'exercice est de 20 000 €. La société a versé quatre acomptes de 3 750 €. Quel solde reste-t-il à payer au 15 mai ?', r: 5000, u: '€', e: 'Acomptes : 4 × 3 750 = 15 000 €. Solde : 20 000 − 15 000 = 5 000 €.'},
  {t: 'qcm', q: 'Une société a fait 40 000 € de bénéfice l\'an dernier et 25 000 € de perte cette année. Que permet le report en arrière ?', o: ['Annuler l\'impôt de cette année', 'Imputer la perte sur le bénéfice de l\'an dernier et obtenir une créance sur l\'État', 'Déduire la perte de la TVA', 'Rien, la perte est définitivement perdue'], r: 1, e: 'Le carry-back crée une créance égale à l\'impôt déjà payé sur la part de bénéfice effacée. Elle s\'impute sur l\'impôt des années suivantes, ou est remboursée au bout de cinq ans.'}
 ]},

{id: 'm-societes', niv: 4, t: 'La comptabilité des sociétés', min: 14,
 chapo: "Constituer une société, augmenter son capital, rémunérer ses associés : les opérations qui ne concernent que les capitaux propres.",
 h: `
<h2>La constitution</h2>
<p>Les associés <strong>souscrivent</strong> le capital : ils s'engagent à l'apporter. Tout n'est pas forcément versé tout de suite. Dans une SAS, la moitié au moins des apports en argent doit être libérée à la création ; dans une SARL, un cinquième. Le reste doit l'être dans les cinq ans.</p>
<p>Le plan comptable suit ce cheminement avec des sous-comptes du capital. Pour 10 000 € souscrits, dont la moitié appelée et versée :</p>
${J([['4561', 10000, 0], ['1011', 0, 10000]], 'Souscription : promesse d\'apport')}
${J([['4562', 5000, 0], ['4561', 0, 5000]], 'Appel de la moitié du capital')}
${J([['512', 5000, 0], ['4562', 0, 5000]], 'Versement des fonds')}
${J([['109', 5000, 0], ['4561', 0, 5000]], 'Part souscrite non encore appelée')}
<p>Les sous-comptes du capital (1011, 1012, 1013) sont ensuite ajustés à chaque étape. Au bilan, le capital apparaît pour 10 000 €, et la part non appelée figure en tête de l'actif.</p>
<p>Un apport peut aussi être <strong>en nature</strong> : un véhicule, un fonds de commerce. Il entre à l'actif pour sa valeur d'apport, au crédit du compte d'apport de l'associé.</p>
<h2>Augmenter le capital</h2>
<p><strong>En numéraire.</strong> Quand la société vaut plus que son capital, les nouvelles actions sont émises au-dessus de leur valeur nominale. L'écart est une <strong>prime d'émission</strong> : elle protège les anciens associés contre la dilution de leurs réserves. 1 000 actions de nominal 10 €, émises à 15 € :</p>
${J([['512', 15000, 0], ['101', 0, 10000], ['1041', 0, 5000]], 'Augmentation de capital avec prime')}
<p><strong>Par incorporation de réserves.</strong> Aucun argent n'entre : on fait passer des réserves dans le capital, souvent par attribution d'actions gratuites.</p>
${J([['1068', 20000, 0], ['101', 0, 20000]], 'Incorporation de réserves')}
<h2>Les comptes courants d'associés</h2>
<p>Un associé peut prêter de l'argent à la société sans augmenter le capital : c'est un <strong>apport en compte courant</strong>, une dette de la société envers lui (compte 455). Il pourra être remboursé ou rémunéré par des intérêts.</p>
${J([['512', 8000, 0], ['455', 0, 8000]], 'Apport en compte courant')}
<h2>Les dividendes</h2>
<p>Après l'affectation du résultat (niveau Confirmé, module Clôture), les dividendes votés sont une dette envers les associés (compte 457). Leur paiement la solde. La société prélève, pour les associés personnes physiques, l'acompte d'impôt et les prélèvements sociaux, qu'elle reverse à l'État.</p>
${R('<p style="margin:0">Souscrire n\'est pas verser. Une augmentation en numéraire fait entrer de l\'argent (et souvent une prime) ; une incorporation de réserves ne fait que reclasser les capitaux propres.</p>')}`,
 ex: [
  {t: 'qcm', q: 'Une SAS est créée avec 20 000 € de capital en numéraire. Quel montant minimum doit être versé à la création ?', o: ['4 000 €', '10 000 €', '20 000 €', 'Aucun'], r: 1, e: 'Dans une SAS, la moitié au moins des apports en numéraire est libérée à la constitution. Dans une SARL, ce serait un cinquième, soit 4 000 €.'},
  {t: 'calcul', q: '2 000 actions nouvelles de nominal 20 € sont émises au prix de 25 €. Quel est le montant de la prime d\'émission ?', r: 10000, u: '€', e: '(25 − 20) × 2 000 = 10 000 €.'},
  {t: 'ecriture', q: 'Enregistrez cette augmentation de capital, entièrement versée en banque : 2 000 actions de nominal 20 € émises à 25 €.', l: [['512', 50000, 0], ['101', 0, 40000], ['1041', 0, 10000]], e: 'La banque reçoit 50 000 €. Le capital augmente du nominal (40 000 €), la prime d\'émission de 10 000 €.'},
  {t: 'ecriture', q: 'L\'assemblée décide d\'incorporer 30 000 € de réserves au capital.', l: [['1068', 30000, 0], ['101', 0, 30000]], e: 'Un simple reclassement à l\'intérieur des capitaux propres : aucun argent ne bouge.'},
  {t: 'ecriture', q: 'Un associé prête 12 000 € à la société en les versant sur son compte bancaire.', l: [['512', 12000, 0], ['455', 0, 12000]], e: 'Un apport en compte courant est une dette envers l\'associé, pas du capital.'},
  {t: 'ecriture', q: 'La société verse par virement les dividendes de 18 000 € votés le mois dernier.', l: [['457', 18000, 0], ['512', 0, 18000]], e: 'La dette envers les associés, constatée à l\'affectation du résultat, s\'éteint.'}
 ]},

{id: 'm-consolidation', niv: 4, t: 'La consolidation', min: 14,
 chapo: "Quand une société en contrôle d'autres, on présente aussi les comptes du groupe comme s'il ne formait qu'une seule entreprise.",
 h: `
<h2>Pourquoi consolider</h2>
<p>Une société mère qui détient des filiales ne montre, dans ses propres comptes, que des <strong>titres de participation</strong> (compte 2611). On ne voit ni les usines, ni les dettes, ni le chiffre d'affaires des filiales. Les <strong>comptes consolidés</strong> réunissent tout le groupe en un seul ensemble.</p>
<p>Les sociétés commerciales qui contrôlent d'autres entreprises doivent les établir, sauf les petits groupes sous des seuils fixés par décret. Les groupes cotés appliquent les normes internationales IFRS ; les autres, le règlement français ANC 2020-01.</p>
<h2>Contrôle, influence et méthode</h2>
<div class="scroll"><table class="tb"><thead><tr><th>Lien avec la société</th><th>Repère usuel</th><th>Méthode</th></tr></thead><tbody>
<tr><td>Contrôle exclusif</td><td>plus de 50 % des droits de vote</td><td>Intégration globale</td></tr>
<tr><td>Contrôle conjoint</td><td>pouvoir partagé avec d'autres associés</td><td>Intégration proportionnelle (règles françaises)</td></tr>
<tr><td>Influence notable</td><td>à partir de 20 % des droits de vote</td><td>Mise en équivalence</td></tr></tbody></table></div>
<p><strong>L'intégration globale</strong> reprend 100 % des actifs, dettes, charges et produits de la filiale, puis isole la part qui revient aux autres associés : les <strong>intérêts minoritaires</strong>, appelés aussi intérêts ne donnant pas le contrôle.</p>
<p><strong>La mise en équivalence</strong> ne reprend rien ligne à ligne : elle remplace la valeur des titres par la quote-part de capitaux propres de la société détenue.</p>
<h2>Pourcentage de contrôle et pourcentage d'intérêt</h2>
<p>La mère M détient 80 % de A, qui détient 60 % de B. M contrôle B à travers A : son <strong>pourcentage de contrôle</strong> sur B est de 60 %, et B est intégrée globalement. Mais M ne profite que de 80 % × 60 % = <strong>48 %</strong> des résultats de B : c'est son <strong>pourcentage d'intérêt</strong>, qui sert à partager les capitaux propres et le résultat.</p>
<h2>Les étapes</h2>
<ol>
<li><strong>Homogénéiser</strong> : appliquer les mêmes méthodes comptables dans toutes les sociétés.</li>
<li><strong>Cumuler</strong> les comptes des sociétés intégrées.</li>
<li><strong>Éliminer les opérations réciproques</strong> : ventes et achats entre sociétés du groupe, créances et dettes internes, dividendes versés à la mère, marges internes encore dans les stocks. Un groupe ne peut pas se vendre quelque chose à lui-même.</li>
<li><strong>Éliminer les titres</strong> et partager les capitaux propres entre le groupe et les minoritaires.</li>
</ol>
<h2>L'écart d'acquisition</h2>
<p>Quand la mère paie une filiale plus cher que la quote-part de ses capitaux propres réévalués, l'excédent est un <strong>écart d'acquisition</strong> (goodwill) : il rémunère la clientèle, le savoir-faire, les synergies attendues. La mère paie 900 000 € pour 80 % d'une société dont les capitaux propres réévalués valent 1 000 000 € : écart d'acquisition = 900 000 − 800 000 = 100 000 €.</p>
${R('<p style="margin:0">Contrôle exclusif : intégration globale. Influence notable : mise en équivalence. Le pourcentage de contrôle choisit la méthode ; le pourcentage d\'intérêt partage le résultat.</p>')}`,
 ex: [
  {t: 'tri', q: 'Quelle méthode appliquer selon le lien de la mère avec chaque société ?', cats: ['Intégration globale', 'Mise en équivalence', 'Hors consolidation'], items: [['Détenue à 75 %, sans autre actionnaire important', 0], ['Détenue à 30 %, avec un siège au conseil', 1], ['Détenue à 5 %, simple placement', 2], ['Détenue à 100 %', 0], ['Détenue à 25 %, influence sur les décisions', 1]], e: 'Plus de 50 % : contrôle exclusif. À partir de 20 % : influence notable présumée. En dessous, et sans influence : simple placement.'},
  {t: 'calcul', q: 'M détient 80 % de A, qui détient 60 % de B. Quel est le pourcentage d\'intérêt de M dans B ?', r: 48, u: '%', e: '80 % × 60 % = 48 %. Le pourcentage de contrôle, lui, est de 60 %.'},
  {t: 'calcul', q: 'Une filiale détenue à 80 % a des capitaux propres de 500 000 €. Quelle est la part des intérêts minoritaires ?', r: 100000, u: '€', e: '20 % × 500 000 = 100 000 €.'},
  {t: 'calcul', q: 'La mère achète 70 % d\'une société pour 1 200 000 €. Les capitaux propres réévalués de la cible valent 1 500 000 €. Quel est l\'écart d\'acquisition ?', r: 150000, u: '€', h: 'Comparez le prix payé à la quote-part acquise.', e: 'Quote-part : 70 % × 1 500 000 = 1 050 000 €. Écart : 1 200 000 − 1 050 000 = 150 000 €.'},
  {t: 'tri', q: 'Cette opération doit-elle être éliminée dans les comptes consolidés ?', cats: ['À éliminer', 'À garder'], items: [['Vente de la mère à sa filiale intégrée', 0], ['Vente de la filiale à un client extérieur', 1], ['Dividende versé par la filiale à la mère', 0], ['Prêt bancaire obtenu par la filiale', 1], ['Créance de la mère sur sa filiale', 0]], e: 'Seules les opérations entre sociétés du groupe disparaissent. Ce qui concerne des tiers reste.'},
  {t: 'qcm', q: 'Pourquoi élimine-t-on la marge réalisée par la mère sur des produits vendus à sa filiale et encore en stock chez elle ?', o: ['Pour réduire l\'impôt', 'Parce que le groupe ne peut pas faire de bénéfice en se vendant à lui-même', 'Parce que la TVA n\'est pas récupérable', 'Ce n\'est pas nécessaire'], r: 1, e: 'Tant que le produit n\'est pas vendu à l\'extérieur, la marge interne n\'est pas réalisée pour le groupe.'}
 ]},

{id: 'm-avance', niv: 4, t: 'Opérations avancées', min: 14,
 chapo: "Trois situations qu'on croise vite en entreprise : le crédit-bail, les opérations en devises et les achats dans l'Union européenne.",
 h: `
<h2>Le crédit-bail</h2>
<p>Avec un crédit-bail, l'entreprise utilise un bien (machine, véhicule) qui reste la propriété du bailleur. Elle paie des <strong>redevances</strong> et peut, à la fin du contrat, lever une <strong>option d'achat</strong> pour un prix résiduel.</p>
<p>Dans les comptes individuels français, le bien n'est pas inscrit à l'actif : les redevances sont des charges.</p>
${J([['6122', 1200, 0], ['44566', 240, 0], ['512', 0, 1440]], 'Redevance trimestrielle de crédit-bail')}
<p>Si l'option est levée, le bien entre à l'actif pour son prix de rachat et s'amortit sur sa durée d'utilisation restante. L'annexe doit détailler les engagements de crédit-bail. Les comptes consolidés en normes IFRS, eux, inscrivent le bien à l'actif et la dette au passif.</p>
<h2>Les opérations en devises</h2>
<p>Une facture en dollars s'enregistre en euros, au cours du jour de l'opération. Achat de 10 000 $ quand 1 $ vaut 0,90 € : dette de 9 000 €.</p>
<p>À la clôture, on convertit la dette au cours du jour. Si le dollar vaut 0,95 €, la dette vaut 9 500 € : une <strong>perte latente</strong> de 500 €. On ajuste la dette en passant par un compte d'écart de conversion, sans toucher au résultat :</p>
${J([['476', 500, 0], ['401', 0, 500]], 'Écart de conversion – actif')}
<p>La prudence impose de couvrir cette perte latente par une provision :</p>
${J([['6865', 500, 0], ['1515', 0, 500]], 'Provision pour perte de change')}
<p>Si le dollar avait baissé, le <strong>gain latent</strong> irait au compte 477 (écart de conversion – passif), sans aucun produit : on ne constate un gain que lorsqu'il est réalisé.</p>
<p>Au début de l'exercice suivant, les écarts de conversion sont extournés. La vraie perte ou le vrai gain se constate au règlement.</p>
<h2>Les achats dans l'Union européenne</h2>
<p>Quand une entreprise française achète des biens à un fournisseur d'un autre pays de l'Union, la facture arrive <strong>hors taxe</strong>. C'est l'acheteur qui déclare la TVA française : il la doit et, s'il a droit à déduction, la déduit en même temps. C'est l'<strong>autoliquidation</strong>.</p>
${J([['607', 5000, 0], ['445662', 1000, 0], ['4452', 0, 1000], ['401', 0, 5000]], 'Achat intracommunautaire de marchandises')}
<p>L'opération ne coûte rien en trésorerie, mais elle doit apparaître sur la déclaration de TVA. La même logique s'applique à de nombreuses prestations de services achetées à l'étranger.</p>
${R('<p style="margin:0">Crédit-bail : redevances en charges (6122). Devises : écart de conversion à l\'actif (perte latente, provisionnée) ou au passif (gain latent, ignoré). Achat européen : TVA due et déductible en même temps.</p>')}`,
 ex: [
  {t: 'ecriture', q: 'Vous payez par virement une redevance de crédit-bail mobilier de 2 000 € HT, TVA 20 %.', l: [['6122', 2000, 0], ['44566', 400, 0], ['512', 0, 2400]], e: 'Dans les comptes individuels, la redevance est une charge. Le bien n\'est pas à l\'actif.'},
  {t: 'calcul', q: 'Une dette de 20 000 $ a été enregistrée au cours de 0,92 €. À la clôture, 1 $ vaut 0,95 €. Quel est le montant de la perte latente ?', r: 600, u: '€', e: '20 000 × (0,95 − 0,92) = 600 €. La dette en euros a augmenté.'},
  {t: 'ecriture', q: 'Constatez cette perte latente de 600 € sur la dette fournisseur.', l: [['476', 600, 0], ['401', 0, 600]], e: 'La dette est réévaluée, l\'écart va à l\'actif du bilan en différence de conversion.'},
  {t: 'ecriture', q: 'Provisionnez cette perte de change latente de 600 €.', l: [['6865', 600, 0], ['1515', 0, 600]], e: 'Principe de prudence : une perte probable se constate en charge.'},
  {t: 'qcm', q: 'Une créance client en dollars vaut, à la clôture, 300 € de plus qu\'à la facturation. Que fait-on ?', o: ['On constate un produit de 300 €', 'On inscrit l\'écart au compte 477, sans produit', 'On ne fait rien du tout', 'On provisionne 300 €'], r: 1, e: 'Le gain latent est noté au bilan (différence de conversion – passif) mais ne passe pas en résultat avant d\'être réalisé.'},
  {t: 'ecriture', q: 'Vous achetez des marchandises à un fournisseur belge : 8 000 € HT. Enregistrez la facture avec l\'autoliquidation de la TVA à 20 %.', l: [['607', 8000, 0], ['445662', 1600, 0], ['4452', 0, 1600], ['401', 0, 8000]], e: 'Le fournisseur est payé hors taxe. La TVA est à la fois due et déductible : l\'effet net est nul.'}
 ]},

{id: 'm-synthese', niv: 4, t: 'Cas de synthèse', min: 20,
 chapo: 'Un mois de décembre chez Atelier Lumen. Aucune leçon : seulement les pièces, et vous.',
 h: `
<h2>Le contexte</h2>
<p>Atelier Lumen fabrique des luminaires. Vous tenez sa comptabilité et clôturez l'exercice au 31 décembre. La TVA est à 20 % sur toutes les opérations. Traitez les pièces dans l'ordre : chacune mobilise une notion différente du parcours.</p>
<p>Vous pouvez garder la rubrique <a href="#plan-comptable">Plan comptable</a> ouverte dans un autre onglet. En cas de blocage, la correction se débloque après deux essais.</p>`,
 ex: [
  {t: 'ecriture', q: '3 décembre. Facture de vente de produits finis à un client : 12 000 € HT.', l: [['411', 14400, 0], ['701', 0, 12000], ['44571', 0, 2400]], e: 'Produits fabriqués par l\'entreprise : compte 701, et non 707.'},
  {t: 'ecriture', q: '8 décembre. Facture d\'achat de matières premières : 4 000 € HT brut, remise de 5 % sur facture.', l: [['601', 3800, 0], ['44566', 760, 0], ['401', 0, 4560]], e: 'Net commercial : 4 000 − 200 = 3 800 €. TVA : 760 €.'},
  {t: 'ecriture', q: '10 décembre. Le client du 3 décembre règle la moitié de sa facture par virement.', l: [['512', 7200, 0], ['411', 0, 7200]], e: 'La moitié de 14 400 € TTC. Aucun produit ni TVA ne bouge au règlement.'},
  {t: 'ecriture', q: '1er octobre (pièce retrouvée). Acquisition d\'une machine : 18 000 € HT, non encore enregistrée.', l: [['2154', 18000, 0], ['44562', 3600, 0], ['404', 0, 21600]], e: 'Immobilisation, TVA sur immobilisations, fournisseur d\'immobilisations.'},
  {t: 'ecriture', q: '31 décembre. Dotation aux amortissements de cette machine, mise en service le 1er octobre et amortie sur 6 ans en linéaire.', l: [['6811', 750, 0], ['28154', 0, 750]], e: '18 000 ÷ 6 = 3 000 € par an, soit 750 € pour trois mois.'},
  {t: 'ecriture', q: '31 décembre. Le loyer trimestriel de 3 000 € HT, enregistré le 1er décembre, couvre décembre, janvier et février.', l: [['486', 2000, 0], ['6132', 0, 2000]], e: 'Deux mois sur trois concernent l\'exercice suivant : charge constatée d\'avance de 2 000 €.'},
  {t: 'ecriture', q: '31 décembre. Un client doit 2 400 € TTC depuis huit mois ; vous estimez la perte probable à 50 %. La créance est déjà classée en client douteux.', l: [['6817', 1000, 0], ['491', 0, 1000]], e: 'Sur le HT : 2 000 × 50 % = 1 000 €.'},
  {t: 'ecriture', q: '31 décembre. Déclaration de TVA de décembre : collectée 2 400 €, déductible sur biens et services 760 €, déductible sur immobilisations 3 600 €.', l: [['44571', 2400, 0], ['44567', 1960, 0], ['44566', 0, 760], ['44562', 0, 3600]], e: 'La TVA déductible (4 360 €) dépasse la collectée (2 400 €) : crédit de TVA de 1 960 €, au débit du 44567.'},
  {t: 'qcm', q: 'Parmi les écritures de ce mois, lesquelles ont réduit le résultat sans aucune sortie de trésorerie ?', o: ['L\'achat de matières et le loyer', 'La dotation aux amortissements et la dépréciation du client', 'L\'acquisition de la machine', 'La déclaration de TVA'], r: 1, e: 'Ce sont des charges calculées. On les rajoute au résultat pour obtenir la capacité d\'autofinancement.'}
 ]}
];

const LEXIQUE = [
['Actif', 'Tout ce que l\'entreprise possède ou qu\'on lui doit : immobilisations, stocks, créances, disponibilités. Colonne de gauche du bilan.'],
['Amortissement', 'Répartition du coût d\'une immobilisation sur sa durée d\'utilisation. Charge calculée, sans sortie d\'argent.'],
['Annexe', 'Troisième document des comptes annuels : il explique et complète le bilan et le compte de résultat.'],
['Avoir', 'Facture « négative » qui annule tout ou partie d\'une facture : retour, erreur, remise accordée après coup.'],
['Balance', 'Liste de tous les comptes avec leurs totaux débit, crédit et leur solde. Outil de contrôle avant les comptes annuels.'],
['Besoin en fonds de roulement', 'Stocks + créances − dettes d\'exploitation. L\'argent que le cycle d\'activité oblige à avancer.'],
['Bilan', 'Photo du patrimoine à une date donnée : actif à gauche, passif à droite, totaux égaux.'],
['Capacité d\'autofinancement', 'Trésorerie potentielle dégagée par l\'activité : résultat net + dotations − reprises.'],
['Capitaux propres', 'Ressources appartenant aux associés : capital, réserves, report à nouveau, résultat.'],
['Charge', 'Consommation de l\'exercice qui diminue le résultat. Comptes de classe 6.'],
['Charge constatée d\'avance', 'Charge déjà enregistrée qui concerne l\'exercice suivant. Reportée à l\'actif par le compte 486.'],
['Compte de résultat', 'Film de l\'exercice : produits moins charges, d\'où le bénéfice ou la perte.'],
['Contre-passation', 'Écriture inverse qui annule une écriture erronée. On ne supprime jamais une écriture validée.'],
['Créance', 'Somme qu\'un tiers doit à l\'entreprise. La plus courante : la créance client (411).'],
['Crédit', 'Colonne de droite d\'un compte. Y augmentent les passifs et les produits.'],
['Débit', 'Colonne de gauche d\'un compte. Y augmentent les actifs et les charges.'],
['Dépréciation', 'Constat qu\'un actif vaut probablement moins que sa valeur comptable. Réversible.'],
['Dotation', 'Charge qui alimente un amortissement, une dépréciation ou une provision. Comptes 68.'],
['Excédent brut d\'exploitation', 'Valeur ajoutée − impôts et taxes − charges de personnel. La performance du métier avant amortissements, intérêts et impôt.'],
['Escompte', 'Réduction accordée pour paiement anticipé. Nature financière : comptes 665 et 765.'],
['Exercice', 'Période comptable, en général douze mois, au terme de laquelle on établit les comptes annuels.'],
['Extourne', 'Annulation, au premier jour du nouvel exercice, des écritures de régularisation passées à la clôture.'],
['FEC', 'Fichier des écritures comptables. Export normalisé de toutes les écritures, exigible en cas de contrôle fiscal.'],
['Fonds de roulement', 'Ressources stables − emplois stables. Ce qui reste de financement long pour couvrir l\'exploitation.'],
['Grand livre', 'Ensemble des comptes, chacun avec le détail de ses mouvements.'],
['Hors taxes (HT)', 'Montant avant TVA. Les charges et produits s\'enregistrent hors taxes quand la TVA est récupérable.'],
['Immobilisation', 'Bien destiné à servir durablement l\'activité. Compte de classe 2, à l\'actif.'],
['Journal', 'Registre chronologique de toutes les écritures.'],
['Lettrage', 'Rapprochement, dans un compte de tiers, d\'une facture et de son règlement.'],
['Partie double', 'Principe selon lequel chaque opération est enregistrée au débit d\'un compte et au crédit d\'un autre, pour le même montant.'],
['Passif', 'Origine des ressources : capitaux propres et dettes. Colonne de droite du bilan.'],
['Plan comptable général', 'Liste normalisée des comptes et règles d\'enregistrement, fixée par l\'Autorité des normes comptables.'],
['Produit', 'Enrichissement de l\'exercice qui augmente le résultat. Comptes de classe 7.'],
['Prorata temporis', 'Calcul proportionnel au temps écoulé, par exemple pour l\'amortissement de la première année.'],
['Provision', 'Passif dont l\'échéance ou le montant est incertain : litige, garantie.'],
['Rapprochement bancaire', 'Contrôle qui explique l\'écart entre le solde du compte 512 et celui du relevé bancaire.'],
['Report à nouveau', 'Résultat des exercices passés ni distribué ni mis en réserve.'],
['Solde', 'Différence entre le total des débits et le total des crédits d\'un compte.'],
['Valeur ajoutée', 'Richesse créée par l\'entreprise : production et marge commerciale, moins les consommations achetées à des tiers.'],
['Valeur nette comptable', 'Valeur d\'origine d\'une immobilisation moins ses amortissements cumulés.']
];

/* Test de positionnement : deux questions par niveau */
const TEST = [
 {niv: 1, q: 'Le bilan d\'une entreprise présente…', o: ['ses ventes et ses achats de l\'année', 'ce qu\'elle possède et ce qu\'elle doit à une date donnée', 'ses mouvements bancaires', 'Je ne sais pas'], r: 1},
 {niv: 1, q: 'La société reçoit 5 000 € d\'un emprunt sur son compte. Le compte Banque est…', o: ['crédité', 'débité', 'inchangé', 'Je ne sais pas'], r: 1},
 {niv: 2, q: 'Sur une facture d\'achat de 1 200 € TTC à 20 %, quel montant passe en charge ?', o: ['1 200 €', '1 000 €', '960 €', 'Je ne sais pas'], r: 1},
 {niv: 2, q: 'Un client règle sa facture. Quelle écriture ?', o: ['Débit 512 / Crédit 707', 'Débit 411 / Crédit 512', 'Débit 512 / Crédit 411', 'Je ne sais pas'], r: 2},
 {niv: 3, q: 'Une assurance annuelle de 1 200 € est payée le 1er juillet. Au 31 décembre, on constate…', o: ['une facture non parvenue de 600 €', 'une charge constatée d\'avance de 600 €', 'une provision de 600 €', 'Je ne sais pas'], r: 1},
 {niv: 3, q: 'La dotation aux amortissements s\'enregistre par…', o: ['Débit 6811 / Crédit 28…', 'Débit 28… / Crédit 6811', 'Débit 2… / Crédit 512', 'Je ne sais pas'], r: 0},
 {niv: 4, q: 'L\'excédent brut d\'exploitation s\'obtient à partir de la valeur ajoutée en retirant…', o: ['les dotations et les intérêts', 'les impôts et taxes et les charges de personnel', 'l\'impôt sur les sociétés', 'Je ne sais pas'], r: 1},
 {niv: 4, q: 'Fonds de roulement 80, besoin en fonds de roulement 110. La trésorerie nette est de…', o: ['+190', '+30', '−30', 'Je ne sais pas'], r: 2}
];

/* Écritures de départ de l'Atelier */
const ATELIER = [
 {d: '02/01', lib: 'Apport en capital des associés', l: [['512', 30000, 0], ['101', 0, 30000]]},
 {d: '03/01', lib: 'Déblocage de l\'emprunt bancaire', l: [['512', 20000, 0], ['164', 0, 20000]]},
 {d: '05/01', lib: 'Acquisition d\'une machine – facture FA-0012', l: [['2154', 15000, 0], ['44562', 3000, 0], ['404', 0, 18000]]},
 {d: '06/01', lib: 'Paiement du fournisseur de la machine', l: [['404', 18000, 0], ['512', 0, 18000]]},
 {d: '08/01', lib: 'Achat de marchandises – facture 2291', l: [['607', 8000, 0], ['44566', 1600, 0], ['401', 0, 9600]]},
 {d: '12/01', lib: 'Loyer de janvier', l: [['6132', 1500, 0], ['44566', 300, 0], ['512', 0, 1800]]},
 {d: '15/01', lib: 'Vente de marchandises – facture V-001', l: [['411', 14400, 0], ['707', 0, 12000], ['44571', 0, 2400]]},
 {d: '20/01', lib: 'Règlement partiel du client', l: [['512', 9600, 0], ['411', 0, 9600]]},
 {d: '31/01', lib: 'Bulletin de paie de janvier', l: [['641', 3000, 0], ['431', 0, 660], ['4421', 0, 90], ['421', 0, 2250]]},
 {d: '31/01', lib: 'Cotisations patronales de janvier', l: [['645', 1200, 0], ['431', 0, 1200]]},
 {d: '31/01', lib: 'Virement du salaire', l: [['421', 2250, 0], ['512', 0, 2250]]}
];

window.PD = {PCG, NIVEAUX, MODULES, LEXIQUE, TEST, ATELIER, J, T, lab};
})();
