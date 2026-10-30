# daily-board

Console personnelle : un tableau de bord du quotidien concu comme le systeme
d'exploitation prive de son proprietaire — YC/OS. Pense-bete, meteo geolocalisee
et commentee, veille Hacker News en temps reel, focus, acces rapides, echeances.

## Demarrage

Ouvrir `index.html` dans un navigateur. Le site fonctionne aussi une fois
deploye : dans les parametres du depot GitHub, activer Pages
(Settings > Pages > Branch: main, dossier racine), puis consulter
`https://ulrichflauris.github.io/daily-board/`.

La geolocalisation exige un contexte securise : elle fonctionne sur GitHub
Pages et sur localhost (par exemple `python -m http.server`), elle se replie
sur Rennes depuis un fichier local ouvert en direct. Le bouton POSITION du
widget meteo relance la demande apres autorisation accordee au navigateur.

## Structure

Voir `docs/architecture.md` pour l'arborescence detaillee, le cycle de
demarrage et le diagnostic de geolocalisation. Regles visuelles :
`docs/charte-graphique.md`. Historique des choix de design :
`design/README.md`.

## Widgets

| Code | Widget | Etat |
|---|---|---|
| CLK-00 | Horloge temps reel, date, compteur de jour | Operationnel |
| TSK-01 | Pense-bete date, anciennete surveillee | Operationnel, Supabase au Sprint 3 |
| WTHR-02 | Meteo geolocalisee, ciel decrit, conseil du jour | Operationnel |
| INTL-03 | Depeches Hacker News reelles, cliquables, scorees | Operationnel |
| FOC-04 | Minuteur de focus 25/5, cycles comptes | Operationnel |
| LNK-05 | Acces rapides personnels | Operationnel |
| EVT-06 | Echeances et compte a rebours | Operationnel |

## Feuille de route

| Sprint | Contenu | Statut |
|---|---|---|
| 1 | Squelette, architecture, deploiement | Livre |
| 2 | Geolocalisation, Focus, Acces, Echeances, menu Fenetre | Livre |
| 2b | Diagnostic geo, widgets intelligents, flux reel | Livre |
| 3 | Compte Supabase, synchronisation | A venir |
| 4 | Sources francaises, mobile | A venir |
| 5 | Documentation, zip final | A venir |

## Regles du projet

- Site 100% statique, aucune donnee sensible dans le code
- Interface en francais, sans emoji
- Toute evolution du style passe par la charte graphique
