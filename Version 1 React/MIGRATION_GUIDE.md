# Rare Earth Rescue React Migration Guide

## Run the React app locally

1. Open Terminal.
2. Go into the React app:
   `cd "/Users/jindal/Documents/RER Web codex/Version 1 React"`
3. Start the dev server:
   `npm run dev`
4. Open the local URL shown in Terminal.
   It is usually `http://localhost:5173`

## What is already set up

- React + Vite
- Tailwind CSS
- React Router
- Framer Motion
- GSAP

## Current direction

- Use React for the full site structure
- Keep the visual language from the current Rare Earth Rescue design
- Add GSAP only where it improves the homepage experience
- Reuse components instead of rebuilding each page from scratch

## Migration order

1. Homepage
   Move the current static homepage and auth visual language into reusable React sections
2. Sign in / create account
   Convert the custom auth screen into a React route and reconnect Clerk
3. Marketplace pages
   Migrate listings, listing detail, onboarding, and dashboard pages
4. Shared layout
   Finalize header, footer, buttons, badges, cards, and motion helpers
5. Deployment
   Build the React app and publish the production `dist` output

## Recommended homepage animation split

- Framer Motion:
  Use for reveal animations, tab transitions, hover states, modal motion, and section entry
- GSAP:
  Use for hero sequencing, layered parallax, scroll-linked transforms, and premium storytelling moments

## Next implementation target

- Replace the current homepage content in `src/pages/HomePage.tsx` with the newest Rare Earth Rescue homepage structure
- Create a dedicated React auth page route
- Add Clerk to the React app once the auth page layout is in place
