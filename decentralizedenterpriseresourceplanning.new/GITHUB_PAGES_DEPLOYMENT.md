# GitHub Pages Deployment Guide

## ✅ Frontend Ready for Deployment!

Your frontend has been built and is ready to deploy to GitHub Pages. The distribution files are in the `dist/` folder.

## Step 1: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/kumarhanwatkar/decentralizedenterpriseresourceplanning
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**

GitHub will automatically start deploying your site.

## Step 2: Wait for Deployment

- GitHub Pages will build and deploy your site
- Check the **Actions** tab to see the deployment progress
- Once complete, your site will be available at: **https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/**

## Step 3: Access Your Live Application

Once deployment completes:
- **Frontend**: https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
- **Backend API**: https://erp-api-pr9p.onrender.com

The frontend automatically points to the production backend API.

## Deployment Details

### Build Configuration
- **Build Tool**: Vite (React)
- **Base Path**: `/decentralizedenterpriseresourceplanning/`
- **API Endpoint**: `https://erp-api-pr9p.onrender.com/api`
- **Build Output**: `dist/` folder

### Environment Files
- **Production (.env.local)**:
  ```
  VITE_API_BASE_URL=https://erp-api-pr9p.onrender.com/api
  VITE_ENVIRONMENT=production
  VITE_BASE_PATH=/decentralizedenterpriseresourceplanning
  ```

### Automatic Redeployment
GitHub Pages will automatically redeploy whenever you push changes to the `main` branch.

## Troubleshooting

### Build Issues
If the build fails, check your GitHub Actions console:
1. Go to **Actions** tab
2. Click on the failing workflow
3. Check the logs for errors

### Frontend Not Loading Assets
If styles/JS don't load:
- Check browser console for 404 errors
- Verify the base path matches in `vite.config.ts`
- Clear browser cache and reload

### API Connection Issues
- Verify backend is running: https://erp-api-pr9p.onrender.com/health
- Check CORS headers in backend
- Verify environment variables in `.env.local`

## What's Deployed

✅ **Frontend**:
- React application with Vite bundler
- All pages and components
- Context providers for state management
- Responsive UI with styling

✅ **Backend** (Already Live):
- Node.js/Express API on Render
- MongoDB database
- Authentication system
- All API endpoints

## Next Steps

1. Access your live application
2. Test the frontend with the backend
3. Monitor GitHub Actions for any deployment issues
4. Update content as needed - changes push automatically

---

**Status**: Ready for GitHub Pages deployment  
**Frontend Build**: ✅ Complete  
**Backend API**: ✅ Running at https://erp-api-pr9p.onrender.com  
**Last Updated**: 2026-04-12
