# SRH Strapi CMS + Frontend

A full-stack application with Strapi CMS backend and Next.js frontend.

## 🚀 Features

- **Backend**: Strapi CMS with REST API
- **Authentication**: Role-based access control (RBAC), sign in, sign up
- **Content Management**: Data schemas with i18n, file storage, and relations
- **Frontend**: Protected dashboard with SSR (Next.js)
- **Events**: Multi-language support (English, German)
- **Disability Cards**: Management with file uploads
- **Account Settings**: User profile management
- **UI/UX**: Dark mode, responsive design with Tailwind CSS

## 🛠️ Setup

1. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Start Development**
   ```bash
   # Start Strapi backend
   npm run develop
   
   # In another terminal, start frontend
   cd frontend && npm run dev
   ```

## 🌐 URLs

- **Strapi Admin**: http://localhost:1337
- **Frontend**: http://localhost:3000

## 🔐 Admin Credentials

```
Email: me@ctoofeverything.dev
Password: 123123123abcABC
```