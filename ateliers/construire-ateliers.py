"""Génère les classeurs des ateliers Excel (niveau Débutant) : fichier de départ + corrigé.
Usage : python construire-ateliers.py   (écrit les .xlsx dans ce dossier)
Les formules sont écrites en anglais : Excel en français les affiche traduites (SOMME, SI, NB.SI…)."""
import os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

ICI = os.path.dirname(os.path.abspath(__file__))
VERT, VERT_CLAIR, JAUNE, GRIS = '0B6B3A', 'E3F2E9', 'FFF4B8', '5D6A63'
EURO = '#,##0.00 "€"'
fin = Side(style='thin', color='C9D3CD')
BORD = Border(left=fin, right=fin, top=fin, bottom=fin)


def titre(ws, texte, sous=''):
    ws['A1'] = texte
    ws['A1'].font = Font(bold=True, size=16, color=VERT)
    if sous:
        ws['A2'] = sous
        ws['A2'].font = Font(italic=True, color=GRIS)


def entete(ws, ligne, cols):
    for i, t in enumerate(cols):
        c = ws.cell(row=ligne, column=1 + i, value=t)
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=VERT)
        c.alignment = Alignment(horizontal='center', vertical='center')
        c.border = BORD


def case(c, valeur=None, a_remplir=False, euro=False, pct=False, gras=False):
    c.value = valeur
    c.border = BORD
    if a_remplir:
        c.fill = PatternFill('solid', fgColor=JAUNE)
    if euro:
        c.number_format = EURO
    if pct:
        c.number_format = '0.0%'
    if gras:
        c.font = Font(bold=True)
    return c


def consignes(wb, titre_atelier, objectif, etapes, defis, astuce):
    ws = wb.active
    ws.title = 'Consignes'
    titre(ws, titre_atelier, 'Partie Double · atelier Excel · niveau Débutant')
    ws['A4'] = 'Objectif'
    ws['A4'].font = Font(bold=True, color=VERT)
    ws['A5'] = objectif
    ws['A7'] = 'Étapes'
    ws['A7'].font = Font(bold=True, color=VERT)
    r = 8
    for i, e in enumerate(etapes, 1):
        ws.cell(row=r, column=1, value=f'{i}. {e}')
        r += 1
    r += 1
    ws.cell(row=r, column=1, value='Le défi : reportez ces résultats dans l\'application').font = Font(bold=True, color=VERT)
    r += 1
    for d in defis:
        ws.cell(row=r, column=1, value='• ' + d)
        r += 1
    r += 1
    ws.cell(row=r, column=1, value='Astuce').font = Font(bold=True, color=VERT)
    ws.cell(row=r + 1, column=1, value=astuce)
    ws.cell(row=r + 3, column=1, value='Les cellules jaunes de la feuille « Exercice » sont à compléter avec une formule.').font = Font(italic=True, color=GRIS)
    ws.column_dimensions['A'].width = 110
    for row in ws.iter_rows():
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical='top')


def largeurs(ws, L):
    for col, w in L.items():
        ws.column_dimensions[col].width = w


# ─────────────── Atelier 1 : le bilan de l'atelier de Vania ───────────────
def atelier1(corrige):
    wb = Workbook()
    consignes(wb, 'Atelier 1 · Construire le bilan avec SOMME',
              'Additionner automatiquement l\'actif et le passif du bilan, présenter les montants en euros et vérifier que le bilan est équilibré.',
              ['Ouvrez la feuille « Exercice ». Les montants du bilan de l\'atelier de Vania sont déjà saisis.',
               'En B11, calculez le total de l\'actif avec la fonction SOMME : =SOMME(B5:B10).',
               'En E7, calculez le sous-total des capitaux propres (capital + résultat) avec SOMME.',
               'En E11, calculez le total du passif.',
               'En B13, calculez l\'écart entre le total de l\'actif et celui du passif : =B11-E11. Il doit valoir 0.',
               'Sélectionnez tous les montants et appliquez le format Monétaire (onglet Accueil, groupe Nombre, « € »).'],
              ['Total de l\'actif (cellule B11)', 'Capitaux propres (cellule E7)'],
              'Le raccourci Alt + = insère automatiquement une SOMME sur les cellules du dessus.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Bilan de l\'atelier de Vania au 31 décembre', 'Montants en euros')
    entete(ws, 4, ['Actif', 'Montant', '', 'Passif', 'Montant'])
    actif = [('Logiciel', 1200), ('Mobilier', 2500), ('Machine', 8000), ('Stock de marchandises', 3400), ('Créances clients', 1900), ('Banque', 6300)]
    passif = [('Capital', 12000), ('Résultat de l\'exercice', 1800), ('Capitaux propres', None), ('Emprunt bancaire', 6500), ('Fournisseurs', 2300), ('Dettes fiscales', 700)]
    for i, (n, v) in enumerate(actif):
        case(ws.cell(row=5 + i, column=1), n)
        case(ws.cell(row=5 + i, column=2), v, euro=corrige)
    for i, (n, v) in enumerate(passif):
        r = 5 + i
        sous = v is None
        case(ws.cell(row=r, column=4), n, gras=sous)
        if sous:
            case(ws.cell(row=r, column=5), '=SUM(E5:E6)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
        else:
            case(ws.cell(row=r, column=5), v, euro=corrige)
    case(ws['A11'], 'Total actif', gras=True)
    case(ws['B11'], '=SUM(B5:B10)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    case(ws['D11'], 'Total passif', gras=True)
    case(ws['E11'], '=E7+SUM(E8:E10)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    case(ws['A13'], 'Écart actif − passif (doit valoir 0)', gras=True)
    case(ws['B13'], '=B11-E11' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    largeurs(ws, {'A': 34, 'B': 16, 'C': 4, 'D': 30, 'E': 16})
    if corrige:
        ws['A15'] = 'Corrigé : total actif 23 300 € · capitaux propres 13 800 € · total passif 23 300 € · écart 0 €.'
        ws['A15'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb


# ─────────────── Atelier 2 : compte de résultat et références absolues ───────────────
def atelier2(corrige):
    wb = Workbook()
    consignes(wb, 'Atelier 2 · Le compte de résultat et le symbole $',
              'Calculer le résultat de l\'exercice et le poids de chaque charge dans le chiffre d\'affaires, en recopiant une seule formule grâce à une référence absolue.',
              ['Ouvrez la feuille « Exercice ». Le chiffre d\'affaires est en B5, les charges en B9 à B14.',
               'En B15, calculez le total des charges avec SOMME.',
               'En B17, calculez le résultat : chiffre d\'affaires moins total des charges.',
               'En C9, calculez la part des achats dans le chiffre d\'affaires : =B9/$B$5. Les $ figent la cellule B5.',
               'Recopiez C9 jusqu\'en C14 en tirant la poignée de recopie (le petit carré en bas à droite de la cellule).',
               'Appliquez le format Pourcentage à la colonne C, avec une décimale.'],
              ['Résultat de l\'exercice (cellule B17)', 'Part des salaires dans le chiffre d\'affaires, en % avec une décimale (cellule C11)'],
              'Dans la barre de formule, cliquez sur B5 puis appuyez sur F4 : Excel ajoute les $ pour vous.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Compte de résultat simplifié de l\'atelier de Vania', 'Exercice de 12 mois, montants hors taxes')
    entete(ws, 4, ['Produits', 'Montant', ''])
    case(ws['A5'], 'Ventes de luminaires (chiffre d\'affaires)')
    case(ws['B5'], 85000, euro=corrige)
    entete(ws, 8, ['Charges', 'Montant', '% du chiffre d\'affaires'])
    charges = [('Achats de matières et marchandises', 38000), ('Loyer de l\'atelier', 9600), ('Salaires et cotisations', 21000), ('Assurances', 1400), ('Électricité', 2100), ('Intérêts d\'emprunt', 900)]
    for i, (n, v) in enumerate(charges):
        r = 9 + i
        case(ws.cell(row=r, column=1), n)
        case(ws.cell(row=r, column=2), v, euro=corrige)
        case(ws.cell(row=r, column=3), f'=B{r}/$B$5' if corrige else None, a_remplir=True, pct=True)
    case(ws['A15'], 'Total des charges', gras=True)
    case(ws['B15'], '=SUM(B9:B14)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    case(ws['C15'], '=B15/$B$5' if corrige else None, a_remplir=True, pct=True)
    case(ws['A17'], 'Résultat de l\'exercice', gras=True)
    case(ws['B17'], '=B5-B15' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    largeurs(ws, {'A': 40, 'B': 16, 'C': 22})
    if corrige:
        ws['A19'] = 'Corrigé : total des charges 73 000 € · résultat 12 000 € · salaires 24,7 % du chiffre d\'affaires.'
        ws['A19'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb


# ─────────────── Atelier 3 : contrôler l'équilibre avec SI ───────────────
JOURNAL = [
    (1, '02/01', '512', 'Apport en capital', 10000, 0), (1, '02/01', '101', 'Apport en capital', 0, 10000),
    (2, '03/01', '512', 'Emprunt bancaire', 5000, 0), (2, '03/01', '164', 'Emprunt bancaire', 0, 5000),
    (3, '05/01', '2154', 'Achat machine', 4000, 0), (3, '05/01', '512', 'Achat machine', 0, 4000),
    (4, '08/01', '607', 'Facture marchandises', 2000, 0), (4, '08/01', '44566', 'Facture marchandises', 400, 0), (4, '08/01', '401', 'Facture marchandises', 0, 2490),
    (5, '15/01', '411', 'Facture client', 3600, 0), (5, '15/01', '707', 'Facture client', 0, 3000), (5, '15/01', '44571', 'Facture client', 0, 600),
]


def atelier3(corrige):
    wb = Workbook()
    consignes(wb, 'Atelier 3 · Contrôler un journal avec la fonction SI',
              'Vérifier automatiquement que chaque écriture est équilibrée (débit = crédit) et repérer celle qui contient une erreur de saisie.',
              ['Ouvrez la feuille « Exercice ». Le journal de janvier compte 5 écritures, dont une fausse.',
               'Dans le tableau de contrôle (colonnes I à L), calculez pour chaque écriture le total au débit et le total au crédit avec SOMME. Les lignes de chaque écriture sont indiquées.',
               'En L4, écrivez : =SI(J4=K4;"OK";"Erreur"), puis recopiez la formule jusqu\'en L8.',
               'En M4, calculez l\'écart =K4-J4 et recopiez vers le bas.',
               'En J10 et K10, calculez les totaux du journal, puis en L10 un contrôle général avec SI.',
               'Repérez l\'écriture en erreur et le montant de l\'écart.'],
              ['Numéro de l\'écriture en erreur', 'Montant de l\'écart, en valeur positive'],
              'Les guillemets entourent un texte dans une formule : "OK". Les nombres s\'écrivent sans guillemets.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Journal de janvier de l\'atelier de Vania', 'Une écriture contient une erreur de saisie : à vous de la trouver avec une formule')
    entete(ws, 3, ['N°', 'Date', 'Compte', 'Libellé', 'Débit', 'Crédit'])
    lignes = {}
    for i, (n, d, c, l, de, cr) in enumerate(JOURNAL):
        r = 4 + i
        lignes.setdefault(n, []).append(r)
        for j, v in enumerate([n, d, c, l]):
            case(ws.cell(row=r, column=1 + j), v)
        case(ws.cell(row=r, column=5), de or None, euro=corrige)
        case(ws.cell(row=r, column=6), cr or None, euro=corrige)
    for col, t in zip('IJKLM', ['Écriture (lignes)', 'Total débit', 'Total crédit', 'Contrôle', 'Écart']):
        c = ws[f'{col}3']
        c.value = t
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=VERT)
        c.border = BORD
    for k, n in enumerate(sorted(lignes)):
        r = 4 + k
        a, b = lignes[n][0], lignes[n][-1]
        case(ws[f'I{r}'], f'{n}  (lignes {a} à {b})')
        case(ws[f'J{r}'], f'=SUM(E{a}:E{b})' if corrige else None, a_remplir=True, euro=corrige)
        case(ws[f'K{r}'], f'=SUM(F{a}:F{b})' if corrige else None, a_remplir=True, euro=corrige)
        case(ws[f'L{r}'], f'=IF(J{r}=K{r},"OK","Erreur")' if corrige else None, a_remplir=True)
        case(ws[f'M{r}'], f'=K{r}-J{r}' if corrige else None, a_remplir=True, euro=corrige)
    case(ws['I10'], 'Total du journal', gras=True)
    case(ws['J10'], '=SUM(E4:E15)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    case(ws['K10'], '=SUM(F4:F15)' if corrige else None, a_remplir=True, euro=corrige, gras=True)
    case(ws['L10'], '=IF(J10=K10,"Journal équilibré","Journal déséquilibré")' if corrige else None, a_remplir=True, gras=True)
    largeurs(ws, {'A': 6, 'B': 8, 'C': 9, 'D': 24, 'E': 13, 'F': 13, 'G': 3, 'H': 3, 'I': 22, 'J': 14, 'K': 14, 'L': 20, 'M': 12})
    if corrige:
        ws['I12'] = 'Corrigé : l\'écriture 4 est fausse. Le crédit 401 devrait être de 2 400 €, soit un écart de 90 €.'
        ws['I12'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb


# ─────────────── Atelier 4 : trier, filtrer et compter les comptes ───────────────
COMPTES = [
    ('101', 'Capital'), ('1061', 'Réserve légale'), ('164', 'Emprunts auprès des établissements de crédit'),
    ('205', 'Logiciels, brevets, licences'), ('2154', 'Matériel industriel'), ('2182', 'Matériel de transport'), ('2183', 'Matériel de bureau et informatique'),
    ('2815', 'Amortissements du matériel industriel'), ('37', 'Stocks de marchandises'),
    ('401', 'Fournisseurs'), ('404', 'Fournisseurs d\'immobilisations'), ('411', 'Clients'), ('421', 'Personnel – rémunérations dues'),
    ('431', 'Sécurité sociale'), ('44566', 'TVA déductible sur autres biens et services'), ('44571', 'TVA collectée'), ('455', 'Associés – comptes courants'),
    ('486', 'Charges constatées d\'avance'), ('512', 'Banque'), ('530', 'Caisse'),
    ('601', 'Achats de matières premières'), ('6061', 'Fournitures non stockables'), ('607', 'Achats de marchandises'), ('6132', 'Locations immobilières'),
    ('616', 'Primes d\'assurance'), ('6226', 'Honoraires'), ('626', 'Frais postaux et de télécommunications'), ('641', 'Rémunérations du personnel'),
    ('645', 'Cotisations sociales patronales'), ('6611', 'Intérêts des emprunts'), ('6811', 'Dotations aux amortissements'),
    ('701', 'Ventes de produits finis'), ('706', 'Prestations de services'), ('707', 'Ventes de marchandises'), ('765', 'Escomptes obtenus'),
]


def atelier4(corrige):
    wb = Workbook()
    n6 = sum(1 for c, _ in COMPTES if c[0] == '6')
    n4 = sum(1 for c, _ in COMPTES if c[0] == '4')
    consignes(wb, 'Atelier 4 · Trier, filtrer et compter les comptes',
              'Retrouver la classe de chaque compte avec GAUCHE, filtrer une liste et compter automatiquement les comptes de chaque classe avec NB.SI.',
              ['Ouvrez la feuille « Exercice ». La liste contient 35 comptes du plan comptable, dans le désordre.',
               'En C5, écrivez =GAUCHE(A5;1) : la fonction renvoie le premier chiffre du numéro, c\'est-à-dire la classe. Recopiez jusqu\'en bas de la liste.',
               'Cliquez dans la liste, puis Données > Filtrer. Filtrez la colonne Classe sur 6 : vous ne voyez plus que les charges. Retirez ensuite le filtre.',
               'Triez la liste par numéro de compte, du plus petit au plus grand (Données > Trier).',
               'Dans le tableau de droite, calculez en G5 le nombre de comptes de classe 1 : =NB.SI($C$5:$C$39;F5). Recopiez jusqu\'en G11.',
               'En G12, faites le total avec SOMME : il doit valoir 35.'],
              ['Nombre de comptes de classe 6 (charges)', 'Nombre de comptes de classe 4 (tiers)'],
              'Les numéros de comptes sont saisis comme du texte : ce sont des codes, on ne les additionne jamais.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Extrait du plan comptable', 'Liste dans le désordre : à trier, filtrer et compter')
    entete(ws, 4, ['N° de compte', 'Intitulé', 'Classe'])
    ordre = COMPTES[::2] + COMPTES[1::2]   # mélange déterministe
    for i, (c, l) in enumerate(ordre):
        r = 5 + i
        cel = case(ws.cell(row=r, column=1), c)
        cel.number_format = '@'
        case(ws.cell(row=r, column=2), l)
        case(ws.cell(row=r, column=3), f'=LEFT(A{r},1)' if corrige else None, a_remplir=True)
    entete_d = ['Classe', 'Nombre de comptes']
    for j, t in enumerate(entete_d):
        c = ws.cell(row=4, column=6 + j, value=t)
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=VERT)
        c.border = BORD
    for k in range(7):
        r = 5 + k
        cl = case(ws.cell(row=r, column=6), str(k + 1))
        cl.number_format = '@'
        case(ws.cell(row=r, column=7), f'=COUNTIF($C$5:$C$39,F{r})' if corrige else None, a_remplir=True)
    case(ws['F12'], 'Total', gras=True)
    case(ws['G12'], '=SUM(G5:G11)' if corrige else None, a_remplir=True, gras=True)
    largeurs(ws, {'A': 14, 'B': 46, 'C': 9, 'D': 3, 'E': 3, 'F': 10, 'G': 20})
    ws.auto_filter.ref = 'A4:C39' if corrige else None
    if corrige:
        ws['F14'] = f'Corrigé : {n6} comptes de classe 6, {n4} comptes de classe 4, 35 au total.'
        ws['F14'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb, n6, n4


# ═══════════════════════ NIVEAU INTERMÉDIAIRE ═══════════════════════
from decimal import Decimal, ROUND_HALF_UP
from openpyxl.formatting.rule import CellIsRule


def arr(x):
    """Arrondi comme la fonction ARRONDI d'Excel (0,5 vers le haut)."""
    return float(Decimal(str(x)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def consignes_i(wb, *a):
    consignes(wb, *a)
    wb.active['A2'] = 'Partie Double · atelier Excel · niveau Intermédiaire'


# ─────────────── Atelier 5 : la balance avec SOMME.SI ───────────────
JOURNAL_JANV = [
    ('02/01', '512', 'Apport en capital', 30000, 0), ('02/01', '101', 'Apport en capital', 0, 30000),
    ('03/01', '512', 'Déblocage de l\'emprunt', 20000, 0), ('03/01', '164', 'Déblocage de l\'emprunt', 0, 20000),
    ('05/01', '2154', 'Achat machine FA-0012', 15000, 0), ('05/01', '44562', 'Achat machine FA-0012', 3000, 0), ('05/01', '404', 'Achat machine FA-0012', 0, 18000),
    ('06/01', '404', 'Paiement fournisseur machine', 18000, 0), ('06/01', '512', 'Paiement fournisseur machine', 0, 18000),
    ('08/01', '607', 'Achat marchandises 2291', 8000, 0), ('08/01', '44566', 'Achat marchandises 2291', 1600, 0), ('08/01', '401', 'Achat marchandises 2291', 0, 9600),
    ('12/01', '6132', 'Loyer de janvier', 1500, 0), ('12/01', '44566', 'Loyer de janvier', 300, 0), ('12/01', '512', 'Loyer de janvier', 0, 1800),
    ('15/01', '411', 'Vente V-001', 14400, 0), ('15/01', '707', 'Vente V-001', 0, 12000), ('15/01', '44571', 'Vente V-001', 0, 2400),
    ('20/01', '512', 'Règlement partiel client', 9600, 0), ('20/01', '411', 'Règlement partiel client', 0, 9600),
    ('31/01', '641', 'Paie de janvier', 3000, 0), ('31/01', '431', 'Paie de janvier', 0, 660), ('31/01', '4421', 'Paie de janvier', 0, 90), ('31/01', '421', 'Paie de janvier', 0, 2250),
    ('31/01', '645', 'Charges patronales janvier', 1200, 0), ('31/01', '431', 'Charges patronales janvier', 0, 1200),
    ('31/01', '421', 'Virement des salaires', 2250, 0), ('31/01', '512', 'Virement des salaires', 0, 2250),
]


def atelier5(corrige):
    wb = Workbook()
    consignes_i(wb, 'Atelier 5 · Construire la balance avec SOMME.SI',
                'Transformer le journal de janvier de l\'atelier de Vania en balance : total débit, total crédit et solde de chaque compte, calculés automatiquement.',
                ['Ouvrez la feuille « Exercice ». À gauche, le journal (28 lignes). À droite, la balance avec la liste des comptes.',
                 'En J5, calculez le total au débit du compte écrit en I5 : =SOMME.SI($B$5:$B$32;I5;$D$5:$D$32). Les $ figent les plages du journal.',
                 'En K5, même logique pour le crédit, avec la colonne E. Recopiez J5:K5 jusqu\'à la dernière ligne de la balance.',
                 'En L5, le solde débiteur : =MAX(J5-K5;0). En M5, le solde créditeur : =MAX(K5-J5;0). Recopiez vers le bas.',
                 'Sur la ligne Totaux, additionnez chaque colonne. Total débit = total crédit, et total des soldes débiteurs = total des soldes créditeurs.',
                 'Bonus : sélectionnez le journal, Insertion > Tableau croisé dynamique, Compte en lignes, Débit et Crédit en valeurs. Comparez avec votre balance.'],
                ['Solde du compte 512 Banque', 'Total des débits du journal'],
                'SOMME.SI(plage_critère ; critère ; plage_à_additionner) : « additionne les montants des lignes dont le compte est égal à… ».')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Journal et balance de janvier', 'Atelier de Vania · montants en euros')
    entete(ws, 4, ['Date', 'Compte', 'Libellé', 'Débit', 'Crédit'])
    n = len(JOURNAL_JANV)
    for i, (d, c, l, de, cr) in enumerate(JOURNAL_JANV):
        r = 5 + i
        case(ws.cell(row=r, column=1), d)
        x = case(ws.cell(row=r, column=2), c); x.number_format = '@'
        case(ws.cell(row=r, column=3), l)
        case(ws.cell(row=r, column=4), de or None, euro=True)
        case(ws.cell(row=r, column=5), cr or None, euro=True)
    der = 4 + n
    comptes = sorted({c for _, c, *_ in JOURNAL_JANV})
    for j, t in enumerate(['Compte', 'Total débit', 'Total crédit', 'Solde débiteur', 'Solde créditeur']):
        c = ws.cell(row=4, column=9 + j, value=t)
        c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=VERT); c.border = BORD
    tot = {}
    for k, cpt in enumerate(comptes):
        r = 5 + k
        x = case(ws.cell(row=r, column=9), cpt); x.number_format = '@'
        case(ws.cell(row=r, column=10), f'=SUMIF($B$5:$B${der},I{r},$D$5:$D${der})' if corrige else None, a_remplir=True, euro=True)
        case(ws.cell(row=r, column=11), f'=SUMIF($B$5:$B${der},I{r},$E$5:$E${der})' if corrige else None, a_remplir=True, euro=True)
        case(ws.cell(row=r, column=12), f'=MAX(J{r}-K{r},0)' if corrige else None, a_remplir=True, euro=True)
        case(ws.cell(row=r, column=13), f'=MAX(K{r}-J{r},0)' if corrige else None, a_remplir=True, euro=True)
        d = sum(x[3] for x in JOURNAL_JANV if x[1] == cpt); c_ = sum(x[4] for x in JOURNAL_JANV if x[1] == cpt)
        tot[cpt] = d - c_
    rt = 5 + len(comptes)
    case(ws.cell(row=rt, column=9), 'Totaux', gras=True)
    for j, col in enumerate('JKLM'):
        case(ws.cell(row=rt, column=10 + j), f'=SUM({col}5:{col}{rt - 1})' if corrige else None, a_remplir=True, euro=True, gras=True)
    largeurs(ws, {'A': 8, 'B': 9, 'C': 30, 'D': 13, 'E': 13, 'F': 3, 'G': 3, 'H': 3, 'I': 10, 'J': 14, 'K': 14, 'L': 15, 'M': 15})
    total_debit = sum(x[3] for x in JOURNAL_JANV)
    if corrige:
        ws.cell(row=rt + 2, column=9, value=f'Corrigé : solde du 512 = {tot["512"]:,.0f} € (débiteur) · total des débits = {total_debit:,.0f} €.'.replace(',', ' ')).font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb, {'solde512': tot['512'], 'total_debit': total_debit}


# ─────────────── Atelier 6 : factures et déclaration de TVA ───────────────
FACTURES = [
    ('V-101', 'Vente', 'Lampes Studio (20 lampes)', 4200, .2), ('V-102', 'Vente', 'Restauration de lustres', 1850, .1),
    ('V-103', 'Vente', 'Livres d\'atelier', 960.40, .055), ('V-104', 'Vente', 'Éclairage d\'un restaurant', 12500, .2),
    ('V-105', 'Vente', 'Suspensions sur mesure', 3333.33, .2),
    ('A-201', 'Achat', 'Laiton et verre', 2600, .2), ('A-202', 'Achat', 'Documentation technique', 1234.56, .055),
    ('A-203', 'Achat', 'Rénovation de la vitrine', 780, .1), ('A-204', 'Achat', 'Composants électriques', 5400, .2),
    ('A-205', 'Achat', 'Abonnement logiciel', 99.99, .2),
]


def atelier6(corrige):
    wb = Workbook()
    consignes_i(wb, 'Atelier 6 · Calculer la TVA et préparer la déclaration',
                'Calculer la TVA et le TTC de dix factures à des taux différents, puis préparer automatiquement la déclaration du mois : TVA collectée, TVA déductible, TVA à payer.',
                ['Ouvrez la feuille « Exercice ». Chaque facture a un type (Vente ou Achat), un montant HT et un taux.',
                 'En F5, calculez la TVA arrondie au centime : =ARRONDI(D5*E5;2). Recopiez jusqu\'en F14.',
                 'En G5, calculez le TTC : =D5+F5. Recopiez vers le bas.',
                 'En J5, la TVA collectée (sur les ventes) : =SOMME.SI($B$5:$B$14;"Vente";$F$5:$F$14).',
                 'En J6, la TVA déductible (sur les achats), sur le même modèle avec "Achat".',
                 'En J7, la TVA à décaisser : collectée moins déductible. En J9, le total TTC des ventes avec SOMME.SI.'],
                ['TVA à décaisser (J7)', 'Total TTC des ventes (J9)'],
                'Sans ARRONDI, Excel garde toutes les décimales (5,5 % de 960,40 = 52,822). La TVA d\'une facture s\'arrondit au centime.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Factures du mois et déclaration de TVA', 'Atelier de Vania · montants en euros')
    entete(ws, 4, ['N°', 'Type', 'Objet', 'Montant HT', 'Taux', 'TVA', 'TTC'])
    for i, (n_, t, o, ht, tx) in enumerate(FACTURES):
        r = 5 + i
        for j, v in enumerate([n_, t, o]):
            case(ws.cell(row=r, column=1 + j), v)
        case(ws.cell(row=r, column=4), ht, euro=True)
        x = case(ws.cell(row=r, column=5), tx); x.number_format = '0.0%'
        case(ws.cell(row=r, column=6), f'=ROUND(D{r}*E{r},2)' if corrige else None, a_remplir=True, euro=True)
        case(ws.cell(row=r, column=7), f'=D{r}+F{r}' if corrige else None, a_remplir=True, euro=True)
    lig = [('TVA collectée', '=SUMIF($B$5:$B$14,"Vente",$F$5:$F$14)'), ('TVA déductible', '=SUMIF($B$5:$B$14,"Achat",$F$5:$F$14)'), ('TVA à décaisser', '=J5-J6')]
    c = ws.cell(row=4, column=9, value='Déclaration'); c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=VERT)
    c = ws.cell(row=4, column=10, value='Montant'); c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=VERT)
    for k, (l, f) in enumerate(lig):
        case(ws.cell(row=5 + k, column=9), l, gras=(k == 2))
        case(ws.cell(row=5 + k, column=10), f if corrige else None, a_remplir=True, euro=True, gras=(k == 2))
    case(ws['I9'], 'Total TTC des ventes', gras=True)
    case(ws['J9'], '=SUMIF($B$5:$B$14,"Vente",$G$5:$G$14)' if corrige else None, a_remplir=True, euro=True, gras=True)
    largeurs(ws, {'A': 8, 'B': 8, 'C': 30, 'D': 14, 'E': 8, 'F': 12, 'G': 14, 'H': 3, 'I': 22, 'J': 14})
    tva = [arr(ht * tx) for *_, ht, tx in FACTURES]
    coll = arr(sum(t for t, f in zip(tva, FACTURES) if f[1] == 'Vente'))
    ded = arr(sum(t for t, f in zip(tva, FACTURES) if f[1] == 'Achat'))
    ttc_v = arr(sum(f[3] + t for t, f in zip(tva, FACTURES) if f[1] == 'Vente'))
    rep = {'collectee': coll, 'deductible': ded, 'a_decaisser': arr(coll - ded), 'ttc_ventes': ttc_v}
    if corrige:
        ws['I11'] = f"Corrigé : collectée {coll:.2f} € · déductible {ded:.2f} € · à décaisser {coll - ded:.2f} € · TTC des ventes {ttc_v:.2f} €.".replace('.', ',')
        ws['I11'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb, rep


# ─────────────── Atelier 7 : pointer le relevé et rapprocher la banque ───────────────
SOLDE_INITIAL = 5000
COMPTA_512 = [('02/03', 'Règlement client Durand', 3600), ('04/03', 'Chèque 102 – fournisseur Lumix', -1080), ('05/03', 'Loyer de mars', -2400),
              ('18/03', 'Remise de chèques n° 7', 1250), ('27/03', 'Chèque 103 – Verre & Co', -640), ('29/03', 'Virement client Atelier Nord', 5400)]
RELEVE = [('03/03', 'VIR DURAND SARL', 3600), ('07/03', 'CHQ 0000102', -1080), ('05/03', 'PRLV LOYER MARS', -2400),
          ('30/03', 'VIR ATELIER NORD', 5400), ('31/03', 'FRAIS TENUE DE COMPTE', -48), ('24/03', 'VIR ASSUR. REMBOURSEMENT', 300)]


def atelier7(corrige):
    wb = Workbook()
    consignes_i(wb, 'Atelier 7 · Pointer le relevé et rapprocher la banque',
                'Repérer automatiquement les opérations présentes d\'un seul côté (comptabilité ou relevé), les colorer, puis établir l\'état de rapprochement de mars.',
                ['Ouvrez la feuille « Exercice ». À gauche, le compte 512 de la comptabilité ; à droite, le relevé de la banque. Montants positifs = entrées, négatifs = sorties.',
                 'En D5, testez si le montant existe dans le relevé : =SI(NB.SI($H$5:$H$10;C5)>0;"Pointé";"À rapprocher"). Recopiez jusqu\'en D10.',
                 'En I5, faites le test inverse pour le relevé : =SI(NB.SI($C$5:$C$10;H5)>0;"Pointé";"À rapprocher"). Recopiez jusqu\'en I10.',
                 'Sélectionnez D5:D10 et I5:I10, puis Accueil > Mise en forme conditionnelle > Règles de mise en surbrillance > Égal à… « À rapprocher », en orange.',
                 'Calculez les deux soldes de fin de mois (C12 et H12) : solde initial + SOMME des montants.',
                 'Complétez l\'état de rapprochement : chaque solde est corrigé de ce qui manque de son côté. Les deux soldes corrigés doivent être égaux.'],
                ['Solde bancaire corrigé (C21 ou H21)', 'Nombre total de lignes « À rapprocher » (les deux côtés)'],
                'NB.SI(plage ; valeur) compte combien de fois la valeur apparaît. Plus de 0 : l\'opération existe de l\'autre côté.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Rapprochement bancaire de mars', 'Atelier de Vania · solde initial identique des deux côtés : 5 000,00 €')
    entete(ws, 4, ['Date', 'Compte 512 (comptabilité)', 'Montant', 'Pointage'])
    for j, t in enumerate(['Date', 'Relevé bancaire', 'Montant', 'Pointage']):
        c = ws.cell(row=4, column=6 + j, value=t)
        c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=VERT); c.border = BORD
    for i, (d, l, m) in enumerate(COMPTA_512):
        r = 5 + i
        case(ws.cell(row=r, column=1), d); case(ws.cell(row=r, column=2), l); case(ws.cell(row=r, column=3), m, euro=True)
        case(ws.cell(row=r, column=4), f'=IF(COUNTIF($H$5:$H$10,C{r})>0,"Pointé","À rapprocher")' if corrige else None, a_remplir=True)
    for i, (d, l, m) in enumerate(RELEVE):
        r = 5 + i
        case(ws.cell(row=r, column=6), d); case(ws.cell(row=r, column=7), l); case(ws.cell(row=r, column=8), m, euro=True)
        case(ws.cell(row=r, column=9), f'=IF(COUNTIF($C$5:$C$10,H{r})>0,"Pointé","À rapprocher")' if corrige else None, a_remplir=True)
    case(ws['B12'], 'Solde comptable au 31/03', gras=True)
    case(ws['C12'], f'={SOLDE_INITIAL}+SUM(C5:C10)' if corrige else None, a_remplir=True, euro=True, gras=True)
    case(ws['G12'], 'Solde du relevé au 31/03', gras=True)
    case(ws['H12'], f'={SOLDE_INITIAL}+SUM(H5:H10)' if corrige else None, a_remplir=True, euro=True, gras=True)
    if corrige:
        ws.conditional_formatting.add('D5:D10', CellIsRule(operator='equal', formula=['"À rapprocher"'], fill=PatternFill('solid', fgColor='FFD8A8')))
        ws.conditional_formatting.add('I5:I10', CellIsRule(operator='equal', formula=['"À rapprocher"'], fill=PatternFill('solid', fgColor='FFD8A8')))
    # état de rapprochement
    ws['A15'] = 'État de rapprochement'; ws['A15'].font = Font(bold=True, size=13, color=VERT)
    case(ws['B16'], 'Solde comptable'); case(ws['C16'], '=C12' if corrige else None, a_remplir=True, euro=True)
    case(ws['B17'], '+ entrées du relevé absentes en comptabilité'); case(ws['C17'], '=SUMIFS(H5:H10,I5:I10,"À rapprocher",H5:H10,">0")' if corrige else None, a_remplir=True, euro=True)
    case(ws['B18'], '− sorties du relevé absentes en comptabilité'); case(ws['C18'], '=SUMIFS(H5:H10,I5:I10,"À rapprocher",H5:H10,"<0")' if corrige else None, a_remplir=True, euro=True)
    case(ws['B21'], 'Solde comptable corrigé', gras=True); case(ws['C21'], '=SUM(C16:C18)' if corrige else None, a_remplir=True, euro=True, gras=True)
    case(ws['G16'], 'Solde du relevé'); case(ws['H16'], '=H12' if corrige else None, a_remplir=True, euro=True)
    case(ws['G17'], '+ entrées comptabilisées, pas encore sur le relevé'); case(ws['H17'], '=SUMIFS(C5:C10,D5:D10,"À rapprocher",C5:C10,">0")' if corrige else None, a_remplir=True, euro=True)
    case(ws['G18'], '− sorties comptabilisées, pas encore sur le relevé'); case(ws['H18'], '=SUMIFS(C5:C10,D5:D10,"À rapprocher",C5:C10,"<0")' if corrige else None, a_remplir=True, euro=True)
    case(ws['G21'], 'Solde bancaire corrigé', gras=True); case(ws['H21'], '=SUM(H16:H18)' if corrige else None, a_remplir=True, euro=True, gras=True)
    largeurs(ws, {'A': 8, 'B': 44, 'C': 14, 'D': 15, 'E': 3, 'F': 8, 'G': 46, 'H': 14, 'I': 15})
    cpt = SOLDE_INITIAL + sum(m for *_, m in COMPTA_512)
    rel = SOLDE_INITIAL + sum(m for *_, m in RELEVE)
    mc = {m for *_, m in COMPTA_512}; mr = {m for *_, m in RELEVE}
    seul_r = [m for *_, m in RELEVE if m not in mc]; seul_c = [m for *_, m in COMPTA_512 if m not in mr]
    corr = cpt + sum(seul_r)
    assert corr == rel + sum(seul_c)
    if corrige:
        ws['A23'] = f'Corrigé : solde comptable {cpt} € · relevé {rel} € · soldes corrigés {corr} € des deux côtés · {len(seul_r) + len(seul_c)} lignes à rapprocher.'
        ws['A23'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb, {'solde_corrige': corr, 'a_rapprocher': len(seul_r) + len(seul_c), 'cpt': cpt, 'rel': rel}


# ─────────────── Atelier 8 : préparer les salaires avec RECHERCHEV ───────────────
STATUTS = [('Non-cadre', .22, .40), ('Cadre', .25, .42), ('Apprenti', .02, .12)]
SALARIES = [('Sami', 'Non-cadre', 2100, 0), ('Inès', 'Cadre', 3800, .045), ('Lucas', 'Non-cadre', 1950, 0),
            ('Maëlle', 'Cadre', 4600, .072), ('Yanis', 'Apprenti', 1100, 0), ('Chloé', 'Non-cadre', 2450, .016)]


def atelier8(corrige):
    wb = Workbook()
    consignes_i(wb, 'Atelier 8 · Préparer les salaires avec RECHERCHEV',
                'Calculer les cotisations, le net à payer et le coût employeur de six salariés, en allant chercher automatiquement les taux de chaque statut dans une table.',
                ['Ouvrez la feuille « Exercice ». La table des taux (cotisations salariales et patronales par statut) est en haut à droite, en L5:N7.',
                 'En E5, récupérez le taux salarial du statut : =RECHERCHEV(B5;$L$5:$N$7;2;FAUX). FAUX impose une correspondance exacte.',
                 'En F5, les cotisations salariales : =ARRONDI(C5*E5;2). En G5, le prélèvement à la source : =ARRONDI(C5*D5;2).',
                 'En H5, le net à payer : brut − cotisations salariales − prélèvement à la source.',
                 'En I5, le taux patronal avec RECHERCHEV (3e colonne de la table). En J5, les cotisations patronales arrondies. Recopiez la ligne 5 jusqu\'à la ligne 10.',
                 'Sur la ligne Totaux, additionnez chaque montant. Puis, en J13, calculez le coût total employeur : total des bruts + total des cotisations patronales.'],
                ['Total des nets à payer (H11)', 'Coût total employeur (J13)'],
                'Les taux sont simplifiés pour l\'exercice. Dans une vraie paie, ils dépendent du salaire, des plafonds et des allègements.')
    ws = wb.create_sheet('Exercice')
    titre(ws, 'Salaires de mars', 'Atelier de Vania · taux simplifiés pour l\'exercice')
    entete(ws, 4, ['Salarié', 'Statut', 'Brut', 'Taux PAS', 'Taux salarial', 'Cotis. salariales', 'Prélèvement', 'Net à payer', 'Taux patronal', 'Cotis. patronales'])
    for j, t in enumerate(['Statut', 'Taux salarial', 'Taux patronal']):
        c = ws.cell(row=4, column=12 + j, value=t)
        c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=VERT); c.border = BORD
    for k, (st, ts, tp) in enumerate(STATUTS):
        case(ws.cell(row=5 + k, column=12), st)
        for j, v in enumerate([ts, tp]):
            x = case(ws.cell(row=5 + k, column=13 + j), v); x.number_format = '0%'
    taux = {s: (a, b) for s, a, b in STATUTS}
    tot_net = tot_pat = tot_brut = 0
    for i, (n_, st, br, pas) in enumerate(SALARIES):
        r = 5 + i
        case(ws.cell(row=r, column=1), n_); case(ws.cell(row=r, column=2), st); case(ws.cell(row=r, column=3), br, euro=True)
        x = case(ws.cell(row=r, column=4), pas); x.number_format = '0.0%'
        f = {5: f'=VLOOKUP(B{r},$L$5:$N$7,2,FALSE)', 6: f'=ROUND(C{r}*E{r},2)', 7: f'=ROUND(C{r}*D{r},2)', 8: f'=C{r}-F{r}-G{r}',
             9: f'=VLOOKUP(B{r},$L$5:$N$7,3,FALSE)', 10: f'=ROUND(C{r}*I{r},2)'}
        for col, form in f.items():
            x = case(ws.cell(row=r, column=col), form if corrige else None, a_remplir=True, euro=col not in (5, 9))
            if col in (5, 9):
                x.number_format = '0%'
        cs, cp = arr(br * taux[st][0]), arr(br * taux[st][1])
        tot_net += br - cs - arr(br * pas); tot_pat += cp; tot_brut += br
    case(ws['A11'], 'Totaux', gras=True)
    for col in 'CFGHJ':
        case(ws[f'{col}11'], f'=SUM({col}5:{col}10)' if corrige else None, a_remplir=True, euro=True, gras=True)
    case(ws['H13'], 'Coût total employeur', gras=True)
    case(ws['J13'], '=C11+J11' if corrige else None, a_remplir=True, euro=True, gras=True)
    largeurs(ws, {'A': 10, 'B': 12, 'C': 12, 'D': 10, 'E': 13, 'F': 15, 'G': 13, 'H': 14, 'I': 13, 'J': 16, 'K': 3, 'L': 12, 'M': 13, 'N': 13})
    tot_net, cout = arr(tot_net), arr(tot_brut + tot_pat)
    if corrige:
        ws['A15'] = f'Corrigé : total des nets {tot_net:.2f} € · coût total employeur {cout:.2f} €.'.replace('.', ',')
        ws['A15'].font = Font(italic=True, color=VERT)
    wb.active = 1
    return wb, {'net': tot_net, 'cout': cout}


if __name__ == '__main__':
    for num, f in [(1, atelier1), (2, atelier2), (3, atelier3)]:
        f(False).save(os.path.join(ICI, f'atelier-{num}.xlsx'))
        f(True).save(os.path.join(ICI, f'atelier-{num}-corrige.xlsx'))
    wb, n6, n4 = atelier4(False)
    wb.save(os.path.join(ICI, 'atelier-4.xlsx'))
    atelier4(True)[0].save(os.path.join(ICI, 'atelier-4-corrige.xlsx'))
    print('ok', 'classe6 =', n6, 'classe4 =', n4)
    for num, f in [(5, atelier5), (6, atelier6), (7, atelier7), (8, atelier8)]:
        f(False)[0].save(os.path.join(ICI, f'atelier-{num}.xlsx'))
        wb, rep = f(True)
        wb.save(os.path.join(ICI, f'atelier-{num}-corrige.xlsx'))
        print(num, rep)
