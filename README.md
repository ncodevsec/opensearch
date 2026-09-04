# Open Search

A productivity-first multi-search dashboard built with React and Vite. Instead of bouncing through noisy homepage feeds, Open Search gives you a single clean interface for searching across dozens of engines, AI tools, and media sources without the usual distractions.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Open%20App-2563EB?style=for-the-badge&labelColor=1F2937)](https://ncodevsec.github.io/open_search/)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge&labelColor=1F2937)](LICENSE)

## Overview

Open Search is designed for focused online research and quick lookups. You can:

- search with a single input box
- switch between engines instantly
- pin your favorite services for fast access
- type service hints like `@google` or `@github` to target a search engine
- keep a lightweight productivity dashboard with a calendar and TODO list
- enjoy a responsive dark/light UI with local persistence

This version is built as a modern React app with Vite and Tailwind styling, replacing the earlier static HTML approach.

## Features

- 50+ search providers across general search, AI, social, privacy, and media categories
- Direct search results without homepage clutter
- Favorites/pinned services for your most-used tools
- Search engine suggestions while typing
- Default engine selection from the settings panel
- Theme switching and layout toggling
- Built-in calendar widget
- Todo list stored in local storage
- Fast, client-side-only experience
- Responsive UI for desktop and mobile

## How it works

1. Type your query in the main search bar.
2. Optionally specify a service using an inline selector such as `@google`, `@github`, or `@youtube`.
3. Hit Enter or click the search button.
4. Search opens in a new tab instantly, without landing on a noisy homepage.

## Tech stack

- React 19
- Vite
- Tailwind CSS
- JavaScript
- LocalStorage for saved preferences and tasks

## Project structure

```bash
open_search/
├── docs/                  # Production build output for GitHub Pages
├── public/                # Static assets
├── src/
│   ├── App.jsx            # Main UI and application logic
│   ├── App.css            # App-specific styling
│   ├── index.css          # Global styles
│   ├── main.jsx           # React entry point
│   └── data/
│       └── searchEngineData.js
├── index.html             # Root HTML template
├── package.json           # Scripts and dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js       # Linting rules
├── README.md              # Project documentation
├── LICENSE                # MIT License
└── .gitignore             # Git ignore rules
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will start in development mode, usually at `http://localhost:5173`.

### Build production bundle

```bash
npm run build
```

This writes the production build into the `docs/` folder, which is suitable for GitHub Pages deployment.

### Preview production build

```bash
npm run preview
```

## Deployment

This project is configured to build into `docs/` and can be deployed as a static site on GitHub Pages or any static hosting provider.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## A note

Open Search is built for speed and focus. The goal is simple: one search interface, direct results, and fewer distractions while you work.
