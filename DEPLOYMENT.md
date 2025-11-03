# Deployment Guide

## Deploy to Vercel (Recommended - Free)

### Option 1: Deploy via Vercel CLI (Quick)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the project directory:**
   ```bash
   cd global-disease-tracker
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **global-disease-tracker** (or your choice)
   - In which directory is your code located? **./** (current directory)
   - Want to override settings? **N**

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**

2. **Sign up/Login** with GitHub account

3. **Click "Add New Project"**

4. **Import your GitHub repository:**
   - Select `pranoybasu/global-disease-tracker`
   
5. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Click "Deploy"**

7. **Your app will be live at:** `https://global-disease-tracker-[random].vercel.app`

### Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Alternative: Deploy to Netlify (Free)

### Via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd global-disease-tracker
   netlify deploy --prod
   ```

### Via Netlify Dashboard

1. **Go to [netlify.com](https://netlify.com)**

2. **Sign up/Login** with GitHub

3. **Click "Add new site" → "Import an existing project"**

4. **Connect to GitHub** and select `global-disease-tracker`

5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (leave empty)

6. **Click "Deploy site"**

---

## Alternative: Deploy to GitHub Pages (Free)

### Setup

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "homepage": "https://pranoybasu.github.io/global-disease-tracker",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts:**
   ```typescript
   export default defineConfig({
     base: '/global-disease-tracker/',
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository settings
   - Pages → Source → `gh-pages` branch
   - Save

---

## Alternative: Deploy to Cloudflare Pages (Free)

1. **Go to [pages.cloudflare.com](https://pages.cloudflare.com)**

2. **Connect GitHub account**

3. **Select `global-disease-tracker` repository**

4. **Build configuration:**
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`

5. **Click "Save and Deploy"**

---

## Environment Variables (If Needed for Real APIs)

### Vercel
```bash
vercel env add VITE_COVID_API_KEY
```

### Netlify
Add in: Site settings → Environment variables

### GitHub Pages
Not supported - use public APIs only

---

## Build Verification

Before deploying, verify the build locally:

```bash
npm run build
npm run preview
```

Visit http://localhost:4173 to test the production build.

---

## Deployment Checklist

- [ ] Code committed and pushed to GitHub
- [ ] Build runs successfully locally (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] Choose deployment platform (Vercel recommended)
- [ ] Deploy and verify live URL
- [ ] Test responsive design on live site
- [ ] Test all disease selections
- [ ] Verify map interactions work
- [ ] Share production URL!

---

## Troubleshooting

### Build fails on platform but works locally
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Blank page after deployment
- Check browser console for errors
- Verify `base` path in vite.config.ts
- Check that all assets are loading (Network tab)

### Map not loading
- Check Leaflet CSS is imported
- Verify map container has height
- Check browser console for tile loading errors

---

## Post-Deployment

1. **Update README.md** with live demo link
2. **Share the URL** on your portfolio/resume
3. **Monitor** with Vercel Analytics (free tier)
4. **Iterate** based on user feedback

---

## Cost: $0/month

All recommended platforms offer generous free tiers:
- **Vercel**: Unlimited bandwidth, 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month, 300 build minutes
- **GitHub Pages**: Unlimited for public repos
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month

---

Happy deploying! 🚀