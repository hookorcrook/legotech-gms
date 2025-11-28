# Quick Start Guide - PulseFit Gym Website

## ⚡ Fast Setup (5 minutes)

### Step 1: Setup PostgreSQL Database

```bash
# Start PostgreSQL (if not running)
# macOS:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Create database and run schema
psql -U postgres -c "CREATE DATABASE gym_management;"
cd backend
psql -U postgres -d gym_management -f schema.sql
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend running at: http://localhost:5000

### Step 3: Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Website running at: http://localhost:3000

### Step 4: View the Website

Open your browser and navigate to: **http://localhost:3000**

---

## 🎨 What You'll See

- **Hero Section** - Dynamic stats counter animation
- **Programs** - 3 training programs from database
- **Coaches** - 4 trainer profiles
- **Pricing** - 3 membership tiers with calculator
- **Testimonials** - Member reviews
- **Contact Form** - Functional form saving to database
- **Dark Mode** - Toggle theme (persisted to localStorage)

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Get Programs
```bash
curl http://localhost:5000/api/programs
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","message":"Test"}'
```

---

## 🗄️ Database Access

View your data:

```bash
psql -U postgres -d gym_management

# List all programs
SELECT * FROM programs;

# List all trainers
SELECT * FROM trainers;

# View contact form submissions
SELECT * FROM contact_forms ORDER BY created_at DESC;
```

---

## 🔧 Common Issues

### Port Already in Use

**Backend (5000):**
```bash
# Change PORT in backend/.env
PORT=5001
```

**Frontend (3000):**
Next.js will automatically prompt you to use port 3001

### Database Connection Error

Check your credentials in `backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gym_management
```

### Can't Connect to API

Ensure `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📝 Making Changes

### Add New Program
```sql
INSERT INTO programs (category, title, description, features)
VALUES ('Cardio', 'Running Club', 'Group runs every morning', '["5K training", "Marathon prep", "Social runs"]');
```

Refresh the website to see your new program!

### Add New Trainer
```sql
INSERT INTO trainers (name, specialty, image_url)
VALUES ('Your Name', 'Your Specialty', 'https://your-image-url.com');
```

---

## 🚀 Next Steps

1. **Customize Content** - Update database records with your gym's data
2. **Modify Styling** - Edit `frontend/app/globals.css` for colors
3. **Add Features** - Extend API with booking system, member portal
4. **Deploy** - Follow deployment guide in main README.md

---

## 📞 Need Help?

- Check the main **README.md** for detailed documentation
- Review **backend/schema.sql** for database structure
- Inspect **frontend/app/page.tsx** for component usage

Happy Coding! 💪
