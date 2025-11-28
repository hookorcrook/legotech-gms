# PulseFit Gym - Dynamic Website

A modern, full-stack gym management website built with Next.js, Node.js, Express, and PostgreSQL. This project converts the static reference landing page into a dynamic, database-driven application while maintaining the same sleek design language.

## 📁 Project Structure

```
Gym Management/
├── frontend/          # Next.js application
├── backend/           # Node.js + Express API
└── reference/         # Original static site reference
    └── website-landing/
```

## 🚀 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend
- **Prisma ORM** - Next-generation ORM with type safety
- **PostgreSQL** - Relational database

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
cd "Gym Management"
```

### 2. Database Setup

#### Install PostgreSQL
- **macOS**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql-14`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

#### Create Database

```bash
# Start PostgreSQL service
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql

# Create database
createdb gym_management
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Update .env file with your database credentials

# Push Prisma schema to database
npm run prisma:push

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at `http://localhost:3000`

## 🎨 Features

### Dynamic Content Management
- **Programs** - Strength, Conditioning, Mobility training programs
- **Trainers** - Coach profiles with specialties
- **Memberships** - Flexible pricing plans (Basic, Pro, Elite)
- **Testimonials** - Member reviews and ratings
- **Contact Forms** - Lead capture for day passes
- **Stats** - Dynamic member, coach, and class counts

### Design Features
- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Mobile-first design
- **Smooth Animations** - Counter animations, transitions
- **Accessibility** - ARIA labels, keyboard navigation
- **SEO Optimized** - Meta tags, semantic HTML

## 📡 API Endpoints

### Programs
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create new program

### Trainers
- `GET /api/trainers` - Get all trainers
- `POST /api/trainers` - Create new trainer

### Memberships
- `GET /api/memberships` - Get all membership plans
- `POST /api/memberships` - Create new membership

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial

### Contact & Stats
- `POST /api/contact` - Submit contact form
- `GET /api/stats` - Get gym statistics

## 🗄️ Database Schema

### Tables
- `programs` - Training programs and features
- `trainers` - Coach profiles
- `memberships` - Pricing plans
- `testimonials` - Customer reviews
- `contact_forms` - Contact submissions
- `stats` - Gym statistics

See `backend/schema.sql` for complete schema definition.

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gym_management
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📦 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Heroku, Railway, or VPS)
```bash
cd backend
npm run build
npm start
```

Update `NEXT_PUBLIC_API_URL` in frontend to your production API URL.

## 🎯 Design Philosophy

This project maintains the original design language of the reference static site:
- **Color Scheme**: Primary red (#ef4444) with slate grays
- **Typography**: Inter font family
- **Layout**: Clean, modern, card-based design
- **Interactions**: Smooth transitions and hover effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for your gym or fitness business!

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Next.js will prompt to use alternative port

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check `NEXT_PUBLIC_API_URL` in frontend

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ for PulseFit Gym
