# Architecture - daily-board

## Principes

- Site 100% statique : HTML, CSS, JavaScript natif, aucun build, aucun framework
- Un widget = un module isole, enregistre au demarrage
- Aucune donnee sensible dans le code, regle inscrite au projet
- Stockage local prefixe "ycos." ; compte synchronise Supabase au Sprint 3

## Arborescence

```
daily-board/
  index.html               page unique
  assets/
    css/
      main.css             jetons, base, chrome, menu Fenetre
      windows.css          fenetres et styles de widgets
    js/
      core/
        storage.js         YStore, stockage local
        boot.js            YCOS, registre des widgets
        windows.js         YWindows, deplacement, fermeture, menu
      widgets/
        clock.js           CLK-00, horloge temps reel
        tasks.js           TSK-01, pense-bete, suivi d'anciennete
        weather.js          WTHR-02, Open-Meteo, geo diagnostiquee, conseils
        news.js            INTL-03, flux reel Hacker News
        focus.js           FOC-04, minuteur 25/5
        links.js           LNK-05, acces rapides
        events.js          EVT-06, echeances et compte a rebours
  config/
    config.js              preferences et coordonnees
  docs/
    charte-graphique.md    regles visuelles
    architecture.md        ce document
  design/
    README.md, tiles/      dossier design du projet
```

## Cycle de demarrage

1. `config.js` expose YCOS_CONFIG
2. `storage.js` expose YStore
3. `boot.js` cree le registre YCOS et pose l'ecouteur DOMContentLoaded
4. `windows.js` definit YWindows
5. Chaque widget s'enregistre via YCOS.register(id, module)
6. Au DOMContentLoaded, YCOS.init() rend chaque widget dans sa fenetre,
   puis YWindows.init() restaure positions et visibilite, et construit
   le menu Fenetre

## Geolocalisation — diagnostic

La geolocalisation exige un contexte securise. Trois cas :

- HTTPS (GitHub Pages) : la demande de position s'affiche normalement
- localhost (serveur local) : idem, lancer par exemple
  `python -m http.server` puis ouvrir http://localhost:8000
- Fichier local (file://) : le navigateur refuse ou ignore la demande ;
  le widget affiche alors la cause exacte et se replie sur Rennes

Le bouton POSITION efface le cache de position et relance la demande,
utile apres autorisation accordee dans les parametres du navigateur.

## Intelligence des widgets

- Meteo : code WMO traduit en francais, ligne de conseil vestimentaire
  (parapluie, manteau, vent fort, hydratation), heure de derniere mise
  a jour, bouton MAJ
- Depeches : flux reel Hacker News (API Firebase officielle), titres
  cliquables, score de la communaute, cache 30 minutes, echantillon de
  secours si le flux echoue
- Pense-bete : anciennete des taches ouvertes, marqueur XJ en alerte
  au-dela du seuil (3 jours par defaut), compteur d'anciennes dans la
  barre d'etat

## Points d'attention

- Deplacement des fenetres a la souris uniquement ; sur mobile, les
  fenetres s'empilent en colonne (media query de main.css)
- Taches, liens et echeances : stockage local en attendant Supabase
- Le flux Hacker News reste anglophone ; sources francaises cyber a
  etudier au Sprint 4

## Statut des sprints

| Sprint | Contenu | Statut |
|---|---|---|
| 1 | Squelette, architecture, deploiement | Livre |
| 2 | Geolocalisation, widgets Focus/Acces/Echeances, menu Fenetre | Livre |
| 2b | Diagnostic geo, meteo intelligente, depeches reelles, taches datees | Livre |
| 3 | Compte Supabase, RLS, synchronisation des taches | A venir |
| 4 | Sources francaises, ergonomie mobile | A venir |
| 5 | Documentation, zip final | A venir |
