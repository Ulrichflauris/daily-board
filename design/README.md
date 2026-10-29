# Dossier design - daily-board

Ce dossier contient le travail de design UI/UX du projet, avant toute conception du site.

## Style tiles

Quatre explorations statiques, chacune autonome (HTML + CSS dans un seul fichier).
Ouvrir chaque fichier dans un navigateur pour comparer en conditions reelles.

| Fichier | Piste | Heritage |
|---|---|---|
| `tiles/console.html` | A - Console de mission | jidekel.com |
| `tiles/editorial.html` | B - Journal de bord | oyin.design |
| `tiles/bureau.html` | C - YC/OS | frvky.online |
| `tiles/console-os.html` | AC - Console YC/OS | jidekel.com + frvky.online |

Decision du 29 octobre 2026 : la piste retenue est le melange AC,
« Console YC/OS ». La charte graphique complete est dans `docs/charte-graphique.md`.

Les tuiles contiennent une animation d'entree ; les tuiles C et AC ajoutent le
deplacement des fenetres a la souris, en avant-gout de l'interaction cible.

Toutes les donnees affichees (taches, meteo, titres) sont fictives et servent
uniquement a l'evaluation du style.

## Criteres d'evaluation

- Lisibilite au reveil : tout capter en moins de cinq secondes
- Personnalite : le site ressemble-t-il a son proprietaire
- Lisibilite mobile
- Appetence durable : supportable au 365e jour consecutif

## Prochaine etape

Valider la tuile AC, puis lancer le Sprint 1 : squelette du site construit
directement selon la charte graphique, architecture modulaire, deploiement
GitHub Pages.
