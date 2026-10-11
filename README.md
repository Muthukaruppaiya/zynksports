# Zynk Cricket Store — Client Wireframe

Interactive UI wireframe for **[@zynkcricketstore](https://www.instagram.com/zynkcricketstore/)**.

Built for client approval on Netlify. After confirmation, this becomes a full React + Node + MongoDB/PostgreSQL ecommerce + admin + billing system.

## Features in this wireframe

- Glassy storefront (hero, shop, product detail, cart)
- Floating Instagram-style video player (draggable, sitewide)
- Floating WhatsApp order button
- User account + order details with status bar
- Public reviews + admin moderation
- Admin portal: products, orders, reviews, billing, handle/reels

## Local development

```bash
npm install
npm run dev
```

## Netlify deploy

1. Push this repo to GitHub
2. New site on Netlify → import repo
3. Build command: `npm run build`
4. Publish directory: `dist`

`netlify.toml` already configures SPA redirects.

## Update store details

Edit `src/data/store.js`:

- WhatsApp number (`whatsapp`)
- Phone / email / address
- Products, reviews, sample orders

## Full build (after approval)

Planned stack:

- Frontend: React (this UI)
- Backend: Node / Express
- Database: MongoDB or PostgreSQL
- Auth, payments, GST invoices, inventory, printers
