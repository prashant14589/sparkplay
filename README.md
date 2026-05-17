# Kids Play Store - Game Builder Platform

A full-stack Next.js application that enables customers to create customized games for kids with multi-format export capabilities.

**Current Phase**: MVP (Minimal Infrastructure, Quick Revenue)

## 🚀 MVP Phase 1 Features (4-6 weeks)

- **Game Builder**: Simple drag-and-drop interface with pre-built templates
- **User Authentication**: Supabase Auth (free tier)
- **Save Games**: User library in Supabase
- **Export Options**:
  - PDF (printable)
  - Web links (shareable + QR codes)
- **Monetization**: Stripe integration for one-time purchases
- **Minimal Infrastructure**: $0/month (Supabase free tier + Vercel free tier)

**[View Full Phased Plan →](./PHASED_DEVELOPMENT_PLAN.md)**

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Frontend**: React 19+, Tailwind CSS
- **Game Engine**: Phaser.js (simplified for MVP)
- **Database**: Supabase (PostgreSQL + Auth)
- **Payment**: Stripe API
- **PDF Export**: html2pdf or pdfkit

## Infrastructure Costs

| Phase            | Monthly Cost | Status  |
| ---------------- | ------------ | ------- |
| MVP (Phase 1)    | ~$0          | Current |
| Growth (Phase 2) | ~$50         | Planned |
| Scale (Phase 3)  | ~$250+       | Planned |

See [PHASED_DEVELOPMENT_PLAN.md](./PHASED_DEVELOPMENT_PLAN.md) for complete cost breakdown.

## Project Structure

```
src/
├── app/               # Next.js App Router pages and API routes
├── components/        # Reusable React components
├── lib/              # Utility functions and helpers
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
├── context/          # React context providers
└── utils/            # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

3. Configure database:

```bash
npm run db:migrate
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run test suite
- `npm run db:migrate` - Run Prisma database migrations

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/kids_play_store
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development Guidelines

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Component-based architecture for reusability
- API-first approach for backend functionality
- Implement proper error handling and validation
- Keep components focused and single-responsibility

## Contributing

Please follow the existing code structure and patterns. Ensure all TypeScript types are properly defined and ESLint passes before submitting.

## License

MIT
