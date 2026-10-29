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
        tasks.js           TSK-01, pense-bete local
        weather.js          WTHR-02, Open-Meteo + geolocalisation
        news.js            INTL-03, echantillon statique
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

## Geolocalisation

- Le widget meteo demande la position du navigateur (API Geolocation),
  avec repli automatique sur les coordonnees de Rennes si refus ou echec
- Position mise en cache 12 heures pour eviter les demandes repetees
- La geolocalisation exige HTTPS : elle fonctionne sur GitHub Pages et
  sur localhost, elle tombe sur le repli depuis un fichier local

## Points d'attention

- Deplacement des fenetres a la souris uniquement ; sur mobile, les
  fenetres s'empilent en colonne (media query de main.css)
- Fermeture d'une fenetre par le dernier point de sa barre de titre ;
  reouverture par le menu Fenetre ; etat persiste
- Taches, liens et echeances : stockage local en attendant Supabase
- Sources d'actualites : echantillon statique en attendant le Sprint 4

## Statut des sprints

| Sprint | Contenu | Statut |
|---|---|---|
| 1 | Squelette, architecture, deploiement | Livre |
| 2 | Geolocalisation meteo, widgets Focus/Acces/Echeances, menu Fenetre | Livre |
| 3 | Compte Supabase, RLS, synchronisation des taches | A venir |
| 4 | Flux d'actualites, ergonomie mobile | A venir |
| 5 | Documentation, zip final | A venir |
