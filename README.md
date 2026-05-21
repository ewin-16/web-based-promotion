# 🌴 DealKerala — Local Business Ad Platform

> Connecting Local Businesses with Local Customers across all 14 districts of Kerala.

DealKerala is a hyper-local advertising platform built for Kerala's small and medium businesses. It allows business owners to post deals, offers, and promotions to reach customers in their exact district — from Kasaragod to Thiruvananthapuram.

---

## 📁 Project Structure

```
Online Ad and Pro/
├── index.html          # Landing page (home/entry point)
├── home.html           # Deals feed — browse active ads
├── post_ad.html        # Post a new advertisement
├── pricing.html        # Pricing plans page
├── about.html          # About Us page (team, story, contact)
│
├── css/
│   ├── index.css       # Styles for landing page
│   ├── home.css        # Styles for deals feed
│   ├── post_ad.css     # Styles for post ad form
│   ├── pricing.css     # Styles for pricing page
│   └── about.css       # Styles for about page
│
├── js/
│   ├── index.js        # Landing page JS (animations, interactions)
│   ├── home.js         # Deals feed JS (filtering, modals)
│   ├── post_ad.js      # Post ad form JS (validation, submission)
│   ├── pricing.js      # Pricing page JS (plan selection)
│   └── about.js        # About page JS (counter animations, mobile nav)
│
└── dist_pics/          # District images & team photos
    ├── alapuzha.jpg
    ├── ernakulam.png
    ├── ewinsheen.jpg.jpeg
    ├── vishal.jpg.jpeg
    ├── sanat.jpg.png
    ├── sreeved.jpg.jpeg
    └── ... (all 14 district images)
```

---

## 🚀 Features

### 🏠 Landing Page (`index.html`)
- Hero section with animated headline and CTA buttons
- District selector — browse ads by any of Kerala's 14 districts
- Live deal ticker and promotional highlights
- Smooth scroll animations and particle effects

### 📋 Deals Feed (`home.html`)
- Browse all active local business advertisements
- Filter by district and category
- Detailed ad modal popup with full information
- Responsive card grid layout

### 📢 Post an Ad (`post_ad.html`)
- Multi-step form for businesses to submit their advertisement
- Image upload for promotional poster
- District and category selection
- Plan picker with live price calculation

### 💰 Pricing (`pricing.html`)
- Three ad size tiers: **Small**, **Medium**, and **Banner**
- Dynamic duration selector (3, 7, 14, 30 days)
- Live price calculator
- Spring-physics animated plan selection

### ℹ️ About Us (`about.html`)
- Company story and mission
- Animated statistics strip (14 districts, 500+ ads, 200+ businesses)
- Why Choose Us — 6 key value cards
- How It Works — 4-step animated guide
- **Our Team** — clickable team cards with real profile photos and portfolio links
- Contact section with email & social links

---

## 👥 Our Team

| Name | Portfolio |
|---|---|
| Ewin Sheen | [ewin-16.github.io/portfolio](https://ewin-16.github.io/portfolio/) |
| Vishal V Shenoy | [msximuswrathx.github.io/project](https://msximuswrathx.github.io/project/) |
| Sanat Santhosh | [sanatsanthoshnair2006.github.io/Portfolio_sanat](https://sanatsanthoshnair2006.github.io/Portfolio_sanat/) |
| Sreeved Prasad | [sreeved-prasad.github.io/PORTFOLIO](https://sreeved-prasad.github.io/PORTFOLIO/) |

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--clr-primary` | `#f05a1a` | Orange — CTA buttons, accents |
| `--clr-teal` | `#00a896` | Teal — secondary accents |
| `--clr-gold` | `#f5a623` | Gold — highlights, premium |
| `--clr-bg` | `#fff8f0` | Warm white background |
| `--clr-text` | `#1a1208` | Dark text |

### Typography
- **Headings**: [Outfit](https://fonts.google.com/specimen/Outfit) — weights 700–900
- **Body**: [Inter](https://fonts.google.com/specimen/Inter) — weights 400–600

### Animations
- Scroll-triggered fade-up animations on all sections
- Shimmer gradient effects on cards and buttons
- Spring-physics hover transforms (`cubic-bezier(.34,1.56,.64,1)`)
- Animated stat counters (ease-out number count-up)
- Glassmorphism cards with backdrop-filter blur

---

## 📱 Responsiveness

| Breakpoint | Layout |
|---|---|
| `> 900px` | Full desktop — 4-column grids, side-by-side sections |
| `≤ 900px` | Tablet — 2-column grids, stacked story section |
| `≤ 600px` | Mobile — Single column, hamburger nav menu |

### Mobile Navigation
On mobile, the navbar links collapse and a **hamburger button** (☰) appears. Tapping it reveals a full-width dropdown menu. Tapping a link or outside the menu closes it.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS (custom design system) |
| Logic | Vanilla JavaScript (ES5 compatible) |
| Fonts | Google Fonts (Outfit, Inter) |
| Images | Local (`dist_pics/`) |
| No frameworks | No React, Vue, Tailwind, or jQuery |

---

## ▶️ Getting Started

This is a pure HTML/CSS/JS project — no build step required.

1. **Clone or download** the project folder.
2. Open `index.html` in any modern browser.
3. That's it! No server, no npm install needed.

```bash
# Option: serve locally with VS Code Live Server
# Install the "Live Server" extension in VS Code
# Right-click index.html → "Open with Live Server"
```

---

## 📄 Pages & Navigation

```
index.html  ──►  home.html  ──►  [ad modal]
     │                │
     ▼                ▼
post_ad.html      pricing.html
     │
     ▼
about.html
```

---

## 📬 Contact

- **Email**: hello@dealkerala.in
- **Phone**: +91 484 234 5678
- **Location**: Kochi, Ernakulam, Kerala

---

## 📜 License

This project is built for educational and portfolio purposes.  
© 2025 DealKerala Team. All rights reserved.
