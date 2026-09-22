# CSAB Judo

Site vitrine du CSAB Judo : HTML, CSS, JavaScript et images.

## Lancer le site

Avec Python installé, depuis la racine du dépôt :

```sh
python -m http.server 8000 --directory dist
```

Ouvrir http://localhost:8000 dans le navigateur.

Le dossier `dist` contient les fichiers éditables du site, sans compilation nécessaire. Voir `SOURCES.md` pour les sources et `dist/THREE-LICENSE.txt` pour la licence Three.js.

## Version transférée

Dernière version complète enregistrée (commit local `28f69c6`). La modification suivante utilisant les photos détourées du mannequin était inachevée et n’est pas incluse dans ce transfert.


## Hero 2D / 2.5D — 21 septembre 2026

La nouvelle direction remplace entièrement le mannequin interactif par les trois
scènes fournies : Respect, Progrès, Ensemble. Les images sont conservées octet pour
octet, sans étirement ni retouche ; le cadrage responsive et les fondus sont en CSS.
Le logo de la navigation et du pied de page est le fichier original déjà présent.
Les logos intégrés dans les scènes font partie des images fournies.

- `dist/hero.css` : composition bleu royal, superposition et responsive.
- `dist/editorial.js` : chapitres, fondu continu et micro-zoom réversibles au scroll.
- `dist/assets/scenes/` : les trois images utilisées directement.

Le site ne charge plus de WebGL ni de Three.js. Les commandes Face/Pause/Dos,
les handlers de manipulation et les fichiers de l'ancien mannequin sont supprimés.
Aucune interception de la molette. Les utilisateurs préférant réduire les animations
ont une section non épinglée et une navigation manuelle instantanée entre chapitres.

### État de validation

Syntaxe, fichiers locaux, liens et conservation des images/logo vérifiés.
La validation visuelle navigateur sur ordinateur et mobile reste à effectuer.
Aucun nouvel envoi public n'a été effectué : l'approbation automatique précédente
a demandé un accord explicite pour publier les images fournies dans le dépôt public.

Dans l'archive, ouvrir `OUVRIR_APERCU.html` pour l'aperçu autonome, ou lancer le serveur
Python décrit plus haut pour travailler sur les sources du dossier `dist`.
