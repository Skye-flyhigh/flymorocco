# 🪂 FlyMorocco

**Multilingual paragliding hub for pilots exploring the skies of Morocco.**  
Built with Next.js, Tailwind CSS, and the occasional chaos-fueled tea session.

---

## 🚀 Project Overview

Flymorocco is a fully static, SEO-friendly, and i18n-ready web app tailored for paragliding pilots looking to fly in Morocco.  
It serves guide pages for multiple flying sites, dynamically rendered and maintained by a single JSON data source, localized in both **English** and **French**.

---

## ✨ Features

- 🌍 Multilingual with `next-intl` (EN/FR)
- 🪁 Dynamic site guides powered by slug-based routing
- 🖼️ Visual-first layout to highlight the beauty of flying sites
- 🔍 SEO-ready with custom meta tags per page
- ⚙️ No accounts, no CMS — everything is dev-managed
- 📦 Deployed on [Vercel](https://vercel.com/)

---

## 🧠 Dev Stack

- [Next.js 15](https://nextjs.org/) the goat 🐐
- [Tailwind CSS](https://tailwindcss.com/) the 1000 pieces jigsaw puzzle of styling 🧩
- [DaisyUI](https://daisyui.com/) the picture of the box of the puzzle 🧩
- [Lucide React](https://lucide.dev/) for clean, consistent icons
- [Zod](https://zod.dev/?id=objects) to break my app again
- [React Leaflet](https://react-leaflet.js.org/), who does like a good map?

---

## 🧠 Setup

    bash
    git clone https://github.com/skye-flyhigh/flymorocco.git
    cd flymorocco
    npm install
    npm run dev

---

## 📂 Folder Structure Highlights

    app/
    ├── [locale]/
    │   ├── layout.tsx         # Locale-aware layout << Dev Lore story happened here
    │   ├── page.tsx           # Localized homepage
    │   ├── components/        # NavBar, Footer, etc.
    │   └── site-guides/       # Dynamic pages (per location)
    ├── layout.tsx             # Language overlay
    ├── lib/
    │   └── site.ts
    ├── types/
    │   └── siteMeta.ts        # Zod's schema validation for site guide meta
    ├── i18n/                  # next-intl language package
    └── middleware.ts          # i18n routing redirect

The messages folder for the translations are living outside of the src/app folder according to next-intl docs.

    📂
    ├── messages/
    │   ├── en.json                 
    │   └── fr.json   
    ├── public/images/
    ├── src/app/


---

## 🔥 Developer Lore

> **“The Case of the Missing E”**

During the i18n setup, a rogue param named `local` (missing the "e") hijacked the entire layout and crashed the app via a top-level `await`.  
After hours of meticulous logs, terminal therapy, and a *French-accented scream*, the bug was identified.

🧪 Resolved by explicitly setting:

   
    const { local: locale } = resolvedParams;
    // Official docs said it returns { locale }... THEY LIED. IT'S 'local'.
    // Yes, I logged it. Yes, I screamed.
   

Also the correct solution is in `middleware.ts`, to force the correct `param` key

    createMiddleware({
        ...routing,
        localeParam: 'locale' // << WITH a 'e'
    })

This project will proudly wear the battle scars of this journey.

---

##🪂 Author

Skye – Paraglider pilot and instructor, Chaos Wielder, Front-End Dev, AI Architect, Mint Tea Enthusiast

---

## 🧙‍♂️ Want to Contribute?

This is a personal dev playground, not open source (yet).
You’re welcome to star, fork, or fly by.

---

© 2025 Skye.cmd / FlyMorocco. All rights reserved.  
This project is **not open source**. No reuse, redistribution, or derivative works permitted without express permission.