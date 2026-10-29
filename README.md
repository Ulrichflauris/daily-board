# daily-board

Console personnelle : un tableau de bord du quotidien concu comme le systeme
d'exploitation prive de son proprietaire — YC/OS. Pense-bete, meteo de Rennes,
veille cyber, horloge de session.

## Demarrage

Ouvrir `index.html` dans un navigateur. Le site fonctionne aussi une fois
deploye : dans les parametres du depot GitHub, activer Pages
(Settings > Pages > Branch: main, dossier racine), puis consulter
`https://ulrichflauris.github.io/daily-board/`.

## Structure

Voir `docs/architecture.md` pour l'arborescence detaillee et le cycle de
demarrage. Regles visuelles : `docs/charte-graphique.md`. Historique des
choix de design : `design/README.md`.

## Widgets

| Code | Widget | Etat |
|---|---|---|
| CLK-00 | Horloge temps reel, date, compteur de jour | Operationnel |
| TSK-01 | Pense-bete, stockage local | Operationnel, Supabase au Sprint 3 |
| WTHR-02 | Meteo Open-Meteo, cache 30 min | Operationnel, a valider en reel |
| INTL-03 | Depeches veille cyber | Echantillon statique, flux au Sprint 4 |

## Feuille de route

| Sprint | Contenu | Statut |
|---|---|---|
| 1 | Squelette, architecture, deploiement | Livre |
| 2 | Validation meteo et ergonomie | En cours |
| 3 | Compte Supabase, synchronisation | A venir |
| 4 | Flux d'actualites, mobile | A venir |
| 5 | Documentation, zip final | A venir |

## Regles du projet

- Site 100% statique, aucune donnee sensible dans le code
- Interface en francais, sans emoji
- Toute evolution du style passe par la charte graphique
