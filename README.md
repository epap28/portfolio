# Portfolio Edouard Papillon

Portfolio statique interactif pour GitHub Pages.

## Lancer en local

```bash
npm run dev
```

Puis ouvrir `http://localhost:5173`.

## Publier sur GitHub Pages

```bash
git init
git add .
git commit -m "Create interactive portfolio"
git branch -M main
git remote add origin https://github.com/<user>/portfolio-edouard-papillon.git
git push -u origin main
```

Dans GitHub, activer Pages avec `Deploy from a branch`, branche `main`, dossier `/root`.
