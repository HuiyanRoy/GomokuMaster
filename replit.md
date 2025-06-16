# Gomoku Game Application

## Overview

This is a full-stack web application implementing the Gomoku (5-in-a-row) board game with AI opponents. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM with PostgreSQL for data persistence. Players can compete against AI with multiple difficulty levels and track their game statistics.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks with local component state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for optimized bundling

### Game Logic Architecture
- **AI Implementation**: Multi-level difficulty system with position evaluation
- **Game State**: Centralized state management with move history tracking
- **Win Detection**: Efficient algorithm checking all four directions (horizontal, vertical, diagonal)
- **Board Representation**: 10x10 grid with numeric cell values (0=empty, 1=human, 2=AI)

## Key Components

### Database Schema
The application defines two main tables:
- **users**: Stores user authentication data (id, username, password)
- **game_stats**: Tracks win/loss/draw statistics per user

### Game Components
- **GameBoard**: Renders the 10x10 Gomoku board with click handling and win highlighting
- **ControlPanel**: Provides difficulty selection, game controls, and statistics display
- **GameModal**: Shows game outcome dialogs with play again options

### AI System
- **Difficulty Levels**: 6 levels from simple random moves to expert master-level play
- **Advanced Threat Detection**: AI can identify and block three-in-a-row patterns with open ends
- **Fork Creation**: Expert level creates multiple simultaneous threats for guaranteed wins
- **Deep Lookahead**: Expert AI analyzes multi-step consequences and pattern formations
- **Position Evaluation**: Scores board positions based on potential winning patterns
- **Strategic Blocking**: Higher difficulty levels prioritize blocking human threats and creating counter-attacks
- **Move Selection**: Balances offensive and defensive strategies with sophisticated pattern recognition

### Storage Interface
- **Memory Storage**: Development-friendly in-memory data persistence
- **Database Ready**: Interface designed for easy PostgreSQL integration
- **Type Safety**: Full TypeScript integration with Drizzle schemas

## Data Flow

1. **Game Initialization**: Board state initialized, AI difficulty selected
2. **Move Processing**: User click → validation → board update → win check
3. **AI Response**: Difficulty-based move calculation → board update → win check  
4. **Game Completion**: Winner determination → statistics update → modal display
5. **Statistics Persistence**: Local storage for immediate feedback, database for long-term tracking

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL adapter (@neondatabase/serverless)

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Development Tools
- Vite with React plugin and TypeScript support
- ESBuild for production bundling
- Replit-specific plugins for development environment integration

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` - Runs server with tsx for TypeScript execution
- **Hot Reload**: Vite dev server with HMR for frontend changes
- **Database**: PostgreSQL 16 module in Replit environment
- **Port Configuration**: Backend on 5000, frontend proxied through Vite

### Production Build
- **Frontend**: `vite build` outputs to `dist/public`
- **Backend**: `esbuild` bundles server to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Environment**: Production mode with optimized assets

### Database Management
- **Schema**: Defined in `shared/schema.ts` with Drizzle
- **Migrations**: `drizzle-kit push` for schema synchronization
- **Connection**: Environment variable `DATABASE_URL` for database connection

## Changelog
- June 16, 2025: Initial setup with complete Gomoku game implementation
- June 16, 2025: Enhanced AI intelligence with advanced threat detection and strategic blocking capabilities
- June 16, 2025: Added Expert difficulty level with master-level AI featuring fork creation and deep pattern analysis

## User Preferences

Preferred communication style: Simple, everyday language.