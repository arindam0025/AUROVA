# Overview

PortfolioIQ is a comprehensive portfolio analysis dashboard that enables users to input their investment holdings and receive detailed financial health reports. The application provides portfolio performance tracking, risk assessment, sector allocation analysis, and AI-powered investment recommendations. Users can add stock holdings with purchase details, view real-time market data, and get personalized insights to optimize their investment strategy.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript, implementing a modern component-based architecture. The application uses Vite as the build tool for fast development and optimized production builds. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system.

**Key Frontend Decisions:**
- **React Router Alternative**: Uses Wouter for lightweight client-side routing instead of React Router to reduce bundle size
- **State Management**: Leverages TanStack Query (React Query) for server state management, eliminating the need for Redux or similar global state solutions
- **Styling**: Implements Tailwind CSS with CSS variables for theming, allowing for easy customization and dark mode support
- **Form Handling**: Uses React Hook Form with Zod validation for type-safe form management and validation

## Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript. The server implements a layered architecture with clear separation between routes, business logic, and data access layers.

**Key Backend Decisions:**
- **Database Abstraction**: Uses an in-memory storage implementation (MemStorage) that implements the IStorage interface, allowing for easy migration to a persistent database later
- **API Integration**: Integrates with Alpha Vantage API for real-time stock data with fallback mock data for development
- **Validation**: Implements Zod schemas shared between frontend and backend for consistent data validation
- **Error Handling**: Centralized error handling middleware for consistent API responses

## Data Storage Solutions
The application currently uses an in-memory storage system for rapid prototyping and development. The database schema is designed with Drizzle ORM and PostgreSQL in mind for future migration.

**Database Schema Design:**
- **Users**: Authentication and user profile management
- **Portfolios**: User-specific portfolio containers
- **Holdings**: Individual stock positions with purchase history
- **Stock Data**: Cached market data to reduce API calls

**Storage Strategy:**
- In-memory storage for development with interface-based design for easy database migration
- Drizzle ORM configuration ready for PostgreSQL deployment
- Schema-first approach using Drizzle-Zod for type safety

## Portfolio Analysis Engine
The application includes a sophisticated portfolio calculation engine that processes holdings data to generate comprehensive financial analysis.

**Analysis Features:**
- Real-time portfolio valuation and performance tracking
- Sector allocation analysis for diversification insights
- Risk assessment based on portfolio concentration
- AI-powered recommendations for portfolio optimization
- Gain/loss calculations with percentage returns

# External Dependencies

## Stock Market Data
- **Alpha Vantage API**: Primary source for real-time stock quotes, company information, and market data
- **Fallback Data**: Mock data system for development and API failure scenarios

## UI Component Library
- **Radix UI**: Provides accessible, unstyled UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Chart.js**: Charting library for portfolio performance and sector allocation visualizations

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **ESBuild**: Fast JavaScript bundler for production builds

## Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM for database operations
- **PostgreSQL**: Configured as the target database for production deployment
- **Drizzle Kit**: Migration tool for database schema management

## Validation and Forms
- **Zod**: Runtime type validation for API endpoints and form data
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

## State Management and API
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **Date-fns**: Utility library for date manipulation and formatting