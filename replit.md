# Energy Communities Laboratory Application

## Overview

This is a web application for the "Laboratorio Nacional de Comunidades Energéticas" (National Laboratory of Energy Communities), designed to manage information, monitoring, and processes for energy communities. The application provides a platform for community registration, administrative oversight, monitoring dashboards, and news management with a focus on promoting democratic participation in the energy sector transition.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state and React Context for authentication
- **Forms**: React Hook Form with Zod schema validation
- **Design Pattern**: Component-based architecture with reusable UI components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Architecture Pattern**: RESTful API with route-based organization
- **Authentication**: JWT tokens with bcrypt for password hashing
- **File Uploads**: Multer middleware for handling document uploads
- **Middleware**: Custom authentication and authorization middleware with role-based access control

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Schema Design**: 
  - Users table with role-based access (administrador/comunidad)
  - Communities table for energy community registrations
  - News table for announcements and articles
  - Carousel slides table for landing page content
- **Migrations**: Drizzle Kit for schema migrations and database management

### Authentication & Authorization
- **Strategy**: JWT-based authentication with role-based authorization
- **Roles**: Two primary roles - "administrador" (administrator) and "comunidad" (community)
- **Protection**: Route-level protection with middleware for API endpoints and component-level protection for frontend routes
- **Session Management**: Token storage in localStorage with automatic verification

### Application Structure
- **Monorepo Layout**: 
  - `/client` - React frontend application
  - `/server` - Express backend API
  - `/shared` - Shared TypeScript schemas and types
- **Component Organization**: UI components in `/components/ui` with business logic components in `/components`
- **Page Structure**: Role-based dashboards (admin, community, monitoring) with protected routes

## External Dependencies

### Core Technologies
- **@neondatabase/serverless** - Neon PostgreSQL serverless database client
- **drizzle-orm** - TypeScript ORM for database operations
- **@tanstack/react-query** - Server state management and caching
- **@radix-ui/** - Headless UI component primitives
- **react-hook-form** - Form state management and validation
- **zod** - Schema validation library

### Authentication & Security
- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing and verification
- **multer** - File upload handling middleware

### Development Tools
- **vite** - Frontend build tool and development server
- **tsx** - TypeScript execution for development
- **esbuild** - Backend bundling for production
- **tailwindcss** - Utility-first CSS framework
- **@replit/vite-plugin-runtime-error-modal** - Development error handling

### UI and Styling
- **class-variance-authority** - Component variant management
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind class merging utility
- **lucide-react** - Icon library

The application uses environment variables for database configuration and JWT secrets, with deployment targeting Replit's hosting platform.