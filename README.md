# WA Direct

![License](https://img.shields.io/badge/License-MIT-blue) ![HTML](https://img.shields.io/badge/HTML-5-orange) ![CSS](https://img.shields.io/badge/CSS-3-blue) ![Status](https://img.shields.io/badge/Status-Active-green) ![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7)

Message anyone on WhatsApp without saving their number.

A simple, one-page generator that creates ready-to-share WhatsApp links with an optional pre-filled message.

```
https://wa.me/{number}?text={message}
```

## Features

- **Instant contact-free messaging** - Start a chat with anyone without saving their number
- **Country code support** - Default to India (+91) or choose from multiple countries
- **Pre-filled messages** - Include an optional message that opens automatically in WhatsApp
- **QR code generation** - Scannable links for hands-free sharing
- **Copy & share** - One-click link copying or direct WhatsApp opener
- **Mobile responsive** - Fully optimized for phone and desktop
- **Zero backend** - Pure static HTML + CSS. No server, no tracking

## How it works

### 1. Enter number

Choose the country code (🇮🇳 +91 by default) and type the phone number you want to reach.

### 2. Get link

Generate a clean WhatsApp link with an optional pre-filled message that appears when the recipient opens the chat.

Example:
```
https://wa.me/9198765xxxxx?text=Hi%2C%20I%20found%20your%20number%20on%20WA%20Link%20and%20would%20like%20to%20chat.
```

### 3. Share anywhere

- Copy the link and paste it in email, social media, or chat
- Open in WhatsApp directly from the tool
- Download the QR code and scan on any device

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Dark theme with WhatsApp green accents, fully responsive
- **Vanilla JS** - No dependencies, lightweight

## Deploying to Netlify

This project is zero-config. No build step required.

### Option A - Connect Git

1. Push this repo to GitHub
2. In Netlify: **Add new site** → **Import an existing project** → select your repo
3. Leave **Build command** empty and **Publish directory** as `.` (root)
4. Deploy



## File structure

```
wa-direct/
├── index.html          # Page markup + structure
├── styles.css          # Dark theme, responsive layout
├── README.md           # This file
└── LICENSE             # MIT license
```

## Usage

1. Open [https://wa-direct-app.netlify.app](https://wa-direct-app.netlify.app)
2. Select country code and enter phone number
3. (Optional) Add a pre-filled message
4. Click **Generate Link**
5. Copy, open in WhatsApp, or download QR code
6. Share with anyone instantly

## Browser support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers on iOS and Android

## License

MIT © [Darshan](https://github.com/imDarshanGK)

---

Built with 💚 for WhatsApp users who want to skip the contact-saving dance.

**Live:** [wa-direct-app.netlify.app](https://wa-direct-app.netlify.app)  
**Repository:** [github.com/imDarshanGK/wa-direct](https://github.com/imDarshanGK/wa-direct)
