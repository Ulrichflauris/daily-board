# Charte graphique - daily-board

Piste retenue : « Console YC/OS », fusion de la piste A (Console de mission,
heritiere de jidekel.com) et de la piste C (YC/OS, heritiere de frvky.online).

## Identite

Un bureau d'ordinateur sombre, reveille a l'aube : fenetres deplacables,
codes techniques, accent ambre. Le site se comporte comme le systeme
d'exploitation personnel de son proprietaire, allume le matin comme une
console de mission.

## Palette

| Role | Valeur | Usage |
|---|---|---|
| Fond | #0B0B0C | bureau, arriere-plan |
| Surface | #141416 | interieur des fenetres |
| Chrome | #1C1C1F | barre de menus, barres de titre, barre d'etat, menus |
| Trait | #262628 | bordures, filets, separateurs |
| Encre | #EDEAE2 | texte principal |
| Secondaire | #8A8A8E | metadonnees, texte attenue |
| Accent | #E8A33D | fenetre active, valeurs cles, curseur, compte a rebours |
| Systeme | #7DD99B | etats OK, confirmations |
| Alerte | #D4553F | erreurs, echecs, fermeture |

## Typographie

- Space Grotesk : horloge, titres, contenu lisible
- IBM Plex Mono : donnees, chrome (menus, codes, sources), valeurs numeriques
- Regle absolue : le monospace n'affiche que des valeurs reelles ;
  il ne sert jamais de legende decorative

## Structure

- Barre de menus fixe en haut (36 px) : YC/OS, menus, horloge compacte
- Menu Fenetre deroulant : ouverture et fermeture des widgets
- Bureau plein ecran, grille de fond discrete (40 px), fenetres deplacables
- Position et visibilite des fenetres sauvegardees par utilisateur
- Barre d'etat fixe en bas (30 px) : SYS, position, compteurs, heure
- Codes widgets : CLK-00, TSK-01, WTHR-02, INTL-03, FOC-04, LNK-05, EVT-06

## Mouvement

- Ouverture de fenetre : pop 450 ms, courbe rebond amorti
- Demarrage : cascade des fenetres, delais 100 a 400 ms
- Curseur d'accueil : clignotement 1,1 s
- Toute animation reste sous 500 ms ; l'affichage reste instantane

## Interdits

- Emoji et icones decoratives
- Grilles de cartes identiques
- Degrades violets, glassmorphism, neons
- Police par defaut du navigateur
- Texte anglais dans l'interface

## Version

1.1 - 29 octobre 2026. Ajout des codes FOC-04, LNK-05, EVT-06 et du menu
Fenetre. Toute modification du style passe par une mise a jour de ce
document avant tout changement de code.
