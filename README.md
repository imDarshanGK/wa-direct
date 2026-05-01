# WA Link

![License](https://img.shields.io/badge/License-MIT-blue) ![HTML](https://img.shields.io/badge/HTML-5-orange) ![CSS](https://img.shields.io/badge/CSS-3-blue) ![Status](https://img.shields.io/badge/Status-Active-green) ![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7)

WA Link is a clean, static WhatsApp link generator that lets you message anyone without saving their number.

It creates a direct `wa.me` link, a short shareable link, and a QR code from the same number and message.

## Features

- **Direct WhatsApp links** - Generate a chat link without adding the contact first
- **Country selector** - Start with India by default and switch to other countries quickly
- **Optional message** - Pre-fill a message before sending
- **Short link + QR** - Share a compact link or scan a QR code on mobile
- **Recent numbers** - Reuse recently entered numbers with one tap
- **Copy and open actions** - Copy links, open WhatsApp, or download the QR


## How It Works

### 1. Enter the number

Choose a country code, type the phone number, and optionally add a message.

### 2. Generate the link

The app builds a WhatsApp URL in this format:

```text
https://wa.me/{number}?text={message}
```

### 3. Share it

- Copy the primary or short link
- Open the chat in WhatsApp directly
- Use the QR code for quick mobile scanning

## Tech Stack

- **HTML5** - Semantic page structure
- **CSS3** - Dark, responsive UI with WhatsApp green accents
- **Vanilla JavaScript** - No framework, no build step

## Deploying to Netlify

This project is ready for Netlify as a static site.

### Netlify settings

- **Build command:** leave empty
- **Publish directory:** `.`

### Git deploy

1. Push the repo to GitHub
2. In Netlify, choose **Add new site** → **Import an existing project**
3. Select this repository
4. Keep the settings above and deploy

## Local Preview

You can open `index.html` directly in the browser or use a static server like Live Server in VS Code.

## File Structure

```text
wa-direct/
├── index.html   # App markup
├── styles.css   # Layout, theme, and responsiveness
├── script.js    # Link generation and interactions
├── README.md    # Project notes
└── LICENSE      # MIT license
```

## Browser Support

- Chrome / Edge
- Firefox
- Safari
- Mobile browsers on iOS and Android

## License

MIT © [Darshan](https://github.com/imDarshanGK)


Built for fast, contact-free WhatsApp messaging 💚 .

**Repository:** [github.com/imDarshanGK/wa-direct](https://github.com/imDarshanGK/wa-direct)

**Live demo:** [https://walinkify.netlify.app](https://walinkify.netlify.app)
