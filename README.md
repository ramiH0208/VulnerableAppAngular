# VulnerableAppAngular
A vulnerable App with a Frontend in Angular and a backend in Go 

# 🔥 Mutation XSS via DOMPurify (vulnérable)

Ce projet démontre une faille **Mutation XSS (mXSS)** dans une application web simple utilisant une version vulnérable de [DOMPurify](https://github.com/cure53/DOMPurify), une bibliothèque de sanitisation HTML.

## 📌 Qu'est-ce qu'une Mutation XSS ?

Contrairement aux failles XSS classiques, une **mutation XSS** tire parti du comportement du **navigateur lors du "re-parsing"** du DOM. L'entrée utilisateur est **initialement désinfectée**, mais une fois injectée dans la page, le **navigateur peut muter (modifier) la structure HTML**, **réintroduisant** ainsi du contenu JavaScript malveillant que le filtre avait pourtant supprimé.

## ⚙️ Fonctionnement du PoC

Le fichier HTML fourni contient :

- Une zone de **saisie de commentaire**.
- Une case à cocher pour **activer ou non DOMPurify** (version vulnérable `2.0.7`).
- Une zone d'affichage simulant des **commentaires utilisateurs**.
- Une ligne de code JavaScript qui force une **mutation du DOM** via `innerHTML += ''`.

Lorsqu’un utilisateur entre un contenu, celui-ci est affiché avec `innerHTML`. Si DOMPurify est activé, il filtre l’entrée. Sinon, elle est injectée telle quelle.

Cependant, si le navigateur effectue une mutation (re-parsing), un **contenu JavaScript bloqué par DOMPurify peut être réactivé**, déclenchant un XSS.

## 💥 Démonstration

1. **Ouvrir le fichier HTML dans Google Chrome** (idéalement une version pas trop récente).
2. **Décocher** `Utiliser DOMPurify` pour vérifier que la XSS est bien active sans filtrage.
3. **Cocher** `Utiliser DOMPurify` pour tester si la version vulnérable est contournée malgré le filtrage.

### Exemple de payload mXSS :
```html
<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;/mglyph
```