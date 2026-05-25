# Aaralink Landing Page

Professional landing page for Aaralink - Property Management & Lease Generation Platform

## Features

- ✨ Modern, responsive design
- 🎯 Hero section with CTA
- 📱 Features showcase
- 💰 Pricing tiers
- ⭐ Testimonials
- 📲 App store download buttons
- 🎨 Built with Next.js, React, and Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Production Build

```bash
npm run build
npm start
```

## Structure

```
web/
├── app/
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── styles/
│   └── globals.css     # Global styles
├── public/             # Static assets
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript config
└── next.config.js      # Next.js config
```

## Customization

### Colors
Edit `web/tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#0066cc',
      secondary: '#00cc88',
    },
  },
}
```

### App Store Links
Update the app store links in `web/app/page.tsx`:

```typescript
<a href="https://apps.apple.com/app/aaralink">
<a href="https://play.google.com/store/apps/details?id=com.aaralink">
```

### Pricing Tiers
Modify pricing data in the pricing section of `page.tsx`

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t aaralink-landing .
docker run -p 3000:3000 aaralink-landing
```

### Traditional Hosting

```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- ⚡ Optimized images
- 🚀 Code splitting
- 📦 Bundle size optimized
- ♿ Accessibility compliant

## License

Proprietary - Aaralink Inc.
