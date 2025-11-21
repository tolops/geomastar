# Coolify Deployment Guide for Business Intelligence App

## Prerequisites

1. **Coolify Instance**: Have Coolify installed and running
2. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket
3. **Domain** (optional): Custom domain for your app
4. **PostgreSQL Database**: Ensure you have access to a PostgreSQL instance

## Required Environment Variables

Create these in Coolify's environment variables section:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# API Keys (for enrichment features)
TAVILY_API_KEY=your-tavily-key
EXA_API_KEY=your-exa-key
FIRECRAWL_API_KEY=your-firecrawl-key
OPENAI_API_KEY=your-openai-key

# Server
NODE_ENV=production
PORT=3000

# Client (for production build)
VITE_API_URL=https://your-api-domain.com/api
```

## Deployment Steps

### Option 1: Using Docker Compose (Recommended)

1. **Connect Repository to Coolify**
   - In Coolify dashboard, click "New Resource" → "Application"
   - Select "Docker Compose" as deployment type
   - Connect your Git repository
   - Set root directory to `/` 
   - Select the `docker-compose.yml` file

2. **Configure Build**
   - Build pack: Docker Compose
   - Branch: `main` (or your production branch)

3. **Set Environment Variables**
   - Add all variables listed above in Coolify's environment section

4. **Deploy Database First**
   - In Coolify, create a PostgreSQL database
   - Copy the connection string to `DATABASE_URL`

5. **Initial Setup (One-time)**
   After first deployment, run these commands in Coolify's terminal:
   ```bash
   # Run database migrations
   cd server && npm run db:push
   
   # Seed admin user
   cd server && npx tsx seed-admin.ts
   ```

6. **Deploy**
   - Click "Deploy" in Coolify
   - Wait for build to complete
   - Access your app via the provided URL

### Option 2: Separate Services (Advanced)

If you want more control, deploy backend and frontend as separate services:

#### Backend Service

1. **Create Application**
   - Type: Dockerfile
   - Repository: Your repo
   - Dockerfile path: `server/Dockerfile`
   - Port: 3000

2. **Environment Variables**
   - Add all backend env vars
   - Set `NODE_ENV=production`

3. **Health Check**
   - Path: `/api/search` (or create a `/health` endpoint)

#### Frontend Service

1. **Create Application**
   - Type: Dockerfile
   - Repository: Your repo
   - Dockerfile path: `client/Dockerfile`
   - Port: 80 (nginx serves on 80)

2. **Environment Variables**
   - `VITE_API_URL=https://your-backend-url.com/api`

3. **Build Args**
   - Ensure `VITE_API_URL` is passed during build

## Post-Deployment

### 1. Database Setup
```bash
# SSH into your backend container
docker exec -it <container-name> sh

# Run migrations
npm run db:push

# Seed admin
npx tsx seed-admin.ts
```

### 2. Verify Deployment
- Login with `admin` / `admin123`
- Change admin password immediately
- Create test users
- Run a test search

### 3. SSL/HTTPS
- Coolify automatically provisions SSL certificates
- Ensure your domain is properly configured

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check if PostgreSQL is accessible from container
- Ensure SSL settings match your database config

### Build Failures
- Check Coolify build logs
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles: `npm run build`

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running and accessible

## Coolify Configuration Files

Your project already has:
- ✅ `server/Dockerfile` - Backend container
- ✅ `client/Dockerfile` - Frontend container  
- ✅ `docker-compose.yml` - Orchestration

## Maintenance

### Updating the App
1. Push code to your repository
2. In Coolify, click "Redeploy"
3. Wait for build to complete

### Database Backups
- Use Coolify's backup feature for PostgreSQL
- Schedule regular backups (recommended: daily)

### Monitoring
- Check Coolify logs for errors
- Monitor API usage and costs
- Review user activity in admin dashboard

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong `JWT_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Restrict database access
- [ ] Set up firewall rules
- [ ] Regular security updates: `npm audit`
- [ ] Monitor API key usage

## Quick Reference

**Admin Login**: `admin` / `admin123` (CHANGE THIS!)

**Endpoints**:
- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/api`
- Health Check: `https://your-domain.com/api/auth/users` (requires auth)

**Common Commands**:
```bash
# View logs
docker logs -f <container-name>

# Access container
docker exec -it <container-name> sh

# Restart service
docker restart <container-name>
```

## Support

If you encounter issues:
1. Check Coolify documentation
2. Review application logs
3. Verify all environment variables
4. Test locally with Docker first
