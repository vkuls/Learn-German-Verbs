# German Verb Trainer

A lightweight flashcard-style app for learning German verbs, meanings, present-tense conjugations, and short sentence patterns.

## Features

- Flashcards for German verbs and meanings
- Present-tense conjugation view
- Practice prompts for each pronoun form
- Search and progress filters
- Per-verb study notes
- Local progress tracking in the browser
- In-app import for a larger tab-separated verb list

## Local use

Open `index.html` in your browser.

## Import your full verb list

1. Open the app.
2. Paste your full tab-separated verb list into the `Import full list` box.
3. Click `Import pasted list`.

The imported deck is saved in the browser on that device.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Push to the default branch, usually `main`.
4. In GitHub, open `Settings` -> `Pages`.
5. If GitHub does not auto-detect the workflow, set the source to `GitHub Actions`.

This project includes a GitHub Pages workflow at `.github/workflows/pages.yml`, so pushes to `main` will publish the site automatically.

## Files

- `index.html` - app structure
- `styles.css` - styling
- `app.js` - app logic, progress tracking, conjugation generation
- `verbs-data.js` - bundled starter deck
- `.github/workflows/pages.yml` - automatic GitHub Pages deployment

## Notes

- Progress is stored with `localStorage`, so each browser keeps its own study history.
- Conjugations are generated automatically and include overrides for many common irregular verbs, but they are not a complete grammar engine.
