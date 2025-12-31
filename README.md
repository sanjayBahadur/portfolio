# Portfolio Globe

A stunning single-page portfolio website featuring an interactive 3D globe that showcases your journey around the world.

## Features

- **Interactive 3D Globe**: Built with react-globe.gl and Three.js
  - Hover to see place information
  - Click to lock selection
  - Unique glow colors for each visited region
  - Particle effects and ring pulses

- **Matrix Theme**: Elegant "Matrix terminal luxury" aesthetic
  - Deep black backgrounds with green accents
  - Scanline and noise overlays
  - Glassy terminal panels

- **Responsive Design**: Works beautifully on all devices
  - Desktop: Globe left, card right
  - Mobile: Stacked layout with sticky header

- **WebGL Fallback**: Timeline view for unsupported browsers

- **Static Export**: Optimized for Cloudflare Pages free tier

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: react-globe.gl / Three.js
- **Geographic Data**: world-atlas, us-atlas, topojson-client

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd portfolio

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Build static export
npm run build
```

This generates a static site in the `out/` directory.

## Deployment to Cloudflare Pages

1. Push your code to a GitHub repository

2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)

3. Create a new project and connect your repository

4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Node.js version**: `18` (or later)

5. Deploy!

## Customization

### Edit Your Journey

Update `src/data/journey.ts` to add your own visited places:

```typescript
{
  kind: "country", // or "us_state"
  key: "JPN", // ISO3 code for countries, state name for US states
  displayName: "Japan",
  lat: 36.2048,
  lng: 138.2529,
  year: 2023,
  tags: ["travel", "culture"],
  whatIDid: "Explored Tokyo and Kyoto...",
  experience: "An amazing blend of tradition and technology...",
}
```

### Edit Your Projects

Update `src/data/projects.ts` to showcase your work:

```typescript
{
  id: "project-id",
  title: "Project Name",
  description: "What this project does...",
  tags: ["React", "TypeScript"],
  link: "https://example.com",
  github: "https://github.com/...",
  featured: true,
}
```

### Add Your Resume

Replace `public/resume.pdf` with your actual resume.

### Update Contact Links

Edit the social links in `src/components/Footer.tsx`.

## Project Structure

```
portfolio/
├── public/
│   └── resume.pdf            # Your resume
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles + Matrix theme
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── AboutSection.tsx  # About section
│   │   ├── FallbackTimeline.tsx  # WebGL fallback
│   │   ├── Footer.tsx        # Footer with links
│   │   ├── JourneyGlobe.tsx  # 3D globe component
│   │   ├── PlaceCard.tsx     # Place info card
│   │   └── ProjectsSection.tsx  # Projects grid
│   ├── data/
│   │   ├── journey.ts        # Visited places data
│   │   └── projects.ts       # Projects data
│   ├── lib/
│   │   ├── colors.ts         # Color utilities
│   │   └── geo.ts            # Geographic data processing
│   └── types/
│       └── atlas.d.ts        # Type declarations
├── next.config.ts            # Next.js config (static export)
├── tailwind.config.ts        # Tailwind theme
└── package.json
```

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

- Globe visualization: [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- Geographic data: [world-atlas](https://github.com/topojson/world-atlas), [us-atlas](https://github.com/topojson/us-atlas)
- Icons: Heroicons
