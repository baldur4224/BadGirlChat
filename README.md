# BadGirlChat

BadGirlChat ist eine einfache, unzensierte Chat-App mit Tab-Navigation für Chat, Einstellungen, Erinnerungen und Fotos. Nachrichten, Erinnerungen und Bilder werden lokal gespeichert. Ein Vertrauenslevel lässt sich im Chat per +/- anpassen.

## Installation

```bash
npm install
```

## Start

```bash
npm start
```

Anschließend ist die App unter [http://localhost:3000](http://localhost:3000) erreichbar.

Chat-Verläufe werden in `data/messages.json` abgelegt, hochgeladene Bilder liegen unter `public/uploads/`, Erinnerungen als Textdateien unter `data/memories/` und das Vertrauenslevel in `data/trust.json`.
