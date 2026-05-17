<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Kids Play Store - Game Builder Platform

A full-stack Next.js application enabling customers to build customized games for kids with multi-format export capabilities (web, PDF, Play Store, shareable links).

### Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Frontend**: React 19+
- **Styling**: Tailwind CSS
- **Game Engine**: Phaser.js 3.x (for 2D game rendering and physics)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payment**: Stripe integration
- **PDF Generation**: pdfkit or html2pdf
- **API**: RESTful with Next.js API routes
- **Validation**: Zod for schema validation
- **State Management**: React Context + TanStack Query

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (dashboard)/       # User dashboard
│   ├── api/               # API routes
│   │   ├── games/
│   │   ├── users/
│   │   ├── auth/
│   │   └── export/
│   ├── builder/           # Game builder interface
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── GameBuilder/       # Game customization UI
│   ├── GameEngine/        # Phaser.js integration
│   ├── Editor/            # Editor components
│   └── UI/                # Common UI components
├── lib/                   # Utility functions
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database utilities
│   ├── api/               # API client helpers
│   └── game/              # Game logic utilities
├── types/                 # TypeScript type definitions
├── hooks/                 # React custom hooks
├── context/               # React context providers
└── utils/                 # Helper functions
```

### Key Features

1. **Game Customization Builder**: Drag-and-drop UI for creating games
2. **Game Engine**: Phaser.js-based rendering and physics
3. **User Management**: Authentication, profiles, game collections
4. **Game Execution**: Run games in browser with full Phaser support
5. **Multi-Format Export**:
   - Web (playable link)
   - PDF (printable/downloadable)
   - Mobile App (iOS/Android)
   - Shareable Links with QR codes
6. **Monetization**: Play Store distribution, in-app purchases
7. **Admin Dashboard**: Game management, analytics, user management

### Development Guidelines

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Component-based architecture with reusable components
- API-first approach for all backend functionality
- Implement proper error handling and validation
- Use Prisma migrations for database changes
- Environment variables in `.env.local`
- ESLint for code quality

### Environment Variables Required

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_API_URL=...
```

### Running the Project

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when configured)
- `npm run db:migrate` - Run Prisma migrations
