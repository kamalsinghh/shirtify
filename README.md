# Shirtify

Shirtify is a full-stack 3D T-shirt customization app. Users can change the shirt color, upload artwork as a logo or full-shirt texture, preview the result on an interactive 3D model, and share designs with the community.

## Features

- Interactive 3D T-shirt preview built with React Three Fiber and Drei
- Color, logo, and full-texture customization
- Clerk authentication and user profiles
- Community design feed with pagination
- Cloudinary image storage
- Vercel Postgres persistence
- Responsive light and dark themes

## Tech stack

- Next.js 14 App Router and TypeScript
- Tailwind CSS
- Three.js, React Three Fiber, and Drei
- Valtio state management
- Clerk authentication
- Vercel Postgres and Cloudinary

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and provide your Clerk, Cloudinary, and Postgres credentials.
3. Start the app with `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Security

Never commit `.env` or `.env.local`. Server-side design, profile, and connection mutations verify the authenticated Clerk user before changing data.
