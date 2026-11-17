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


if __name__ == '__main__':
    for num, f in [(1, atelier1), (2, atelier2), (3, atelier3)]:
        f(False).save(os.path.join(ICI, f'atelier-{num}.xlsx'))
        f(True).save(os.path.join(ICI, f'atelier-{num}-corrige.xlsx'))
    wb, n6, n4 = atelier4(False)
    wb.save(os.path.join(ICI, 'atelier-4.xlsx'))
    atelier4(True)[0].save(os.path.join(ICI, 'atelier-4-corrige.xlsx'))
    print('ok', 'classe6 =', n6, 'classe4 =', n4)
