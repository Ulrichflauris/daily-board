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
      main.css             jetons, base, chrome (menus, statut, bureau)
      windows.css          fenetres et styles de widgets
    js/
      core/
        storage.js         YStore, stockage local
        boot.js            YCOS, registre des widgets
        windows.js         YWindows, deplacement et persistance
      widgets/
        clock.js           CLK-00, horloge temps reel
        tasks.js           TSK-01, pense-bete local
        weather.js         WTHR-02, Open-Meteo avec cache
        news.js            INTL-03, echantillon statique
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
   puis YWindows.init() restaure les positions sauvegardees

## Points d'attention

- Deplacement des fenetres a la souris uniquement ; sur mobile, les
  fenetres s'empilent en colonne (media query de main.css)
- Meteo : Open-Meteo sans cle, cache local de 30 minutes
- Taches : stockage local en attendant la table Supabase (Sprint 3)
- Sources d'actualites : echantillon statique en attendant le Sprint 4

## Statut des sprints

| Sprint | Contenu | Statut |
|---|---|---|
| 1 | Squelette, architecture, deploiement | Livre |
| 2 | Meteo reellement branchee, validation | En cours |
| 3 | Compte Supabase, RLS, synchronisation des taches | A venir |
| 4 | Flux d'actualites, ergonomie mobile | A venir |
| 5 | Documentation, zip final | A venir |
