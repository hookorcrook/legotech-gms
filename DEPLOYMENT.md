# Deployment Guide

## 🌐 Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend + Database)

#### Backend + Database on Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the `backend` directory

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a database

4. **Configure Environment Variables**
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=${DATABASE_URL}  # Auto-populated by Railway
   ```

5. **Run Schema**
   - Connect to Railway Postgres:
   ```bash
   psql $DATABASE_URL -f schema.sql
   ```

6. **Get Your Backend URL**
   - Note your Railway backend URL (e.g., `https://your-app.railway.app`)

#### Frontend on Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "New Project"
   - Import your Git repository
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-app.vercel.app`

---

### Option 2: Single VPS (DigitalOcean, AWS, Linode)

#### 1. Setup Ubuntu Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE gym_management;
CREATE USER gymadmin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE gym_management TO gymadmin;
\q

# Run schema
psql -U gymadmin -d gym_management -f /path/to/schema.sql
```

#### 3. Deploy Backend

```bash
# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name gym-api
pm2 save
pm2 startup
```

#### 4. Deploy Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name gym-frontend -- start
pm2 save
```

#### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/gym
```

Add configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/gym /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

### Option 3: Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: gym_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      PORT: 5000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: gym_management
      DB_USER: postgres
      DB_PASSWORD: postgres
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Deploy:
```bash
docker-compose up -d
```

---

## 📊 Post-Deployment Checklist

- [ ] Database is seeded with initial data
- [ ] Environment variables are set correctly
- [ ] SSL certificates are installed (HTTPS)
- [ ] CORS is configured for production domain
- [ ] API endpoints are accessible
- [ ] Frontend can communicate with API
- [ ] Contact form submissions work
- [ ] Dark mode persists
- [ ] Images load correctly
- [ ] Mobile responsiveness works
- [ ] Set up monitoring (PM2, Datadog, etc.)
- [ ] Set up automated backups for database
- [ ] Configure CDN for static assets (optional)

---

## 🔒 Security Recommendations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong database passwords
   - Rotate secrets regularly

2. **Database**
   - Regular backups
   - Restrict database access by IP
   - Use SSL for database connections

3. **API**
   - Implement rate limiting
   - Add authentication for admin endpoints
   - Validate all user inputs
   - Enable HTTPS only

4. **Frontend**
   - Set security headers
   - Implement CSP (Content Security Policy)
   - Sanitize user inputs

---

## 📈 Monitoring & Maintenance

### Backend Health Check
```bash
curl https://api.yourdomain.com/health
```

### Database Backup
```bash
pg_dump -U gymadmin gym_management > backup_$(date +%Y%m%d).sql
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Update Application
```bash
git pull
cd backend && npm install && npm run build && pm2 restart gym-api
cd ../frontend && npm install && npm run build && pm2 restart gym-frontend
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check logs: `pm2 logs gym-api`
- Verify database connection
- Ensure port 5000 is available

### Frontend can't reach API
- Check CORS configuration
- Verify `NEXT_PUBLIC_API_URL`
- Test API endpoint directly

### Database connection timeout
- Check PostgreSQL is running
- Verify firewall rules
- Test connection string

---

## 📞 Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)

Good luck with your deployment! 🚀
