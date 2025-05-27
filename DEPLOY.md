# Deployment Guide

## Strapi Cloud (Recommended for CMS)

**Easiest way to deploy Strapi:**

1. **Push** your Strapi code to GitHub/GitLab
2. **Connect** to [Strapi Cloud](https://cloud.strapi.io)
3. **Deploy** → Automatic from git repo
4. **Get API URL** → Use in frontend environment variables

No server management, automatic scaling, built-in database.

## Vercel (Frontend)

1. **Connect repo** to Vercel
2. **Environment variables**:
    - `NEXT_PUBLIC_STRAPI_URL` → Your Strapi Cloud URL
    - `STRAPI_API_TOKEN` → Your Strapi API token
3. **Deploy** → Automatic on push
