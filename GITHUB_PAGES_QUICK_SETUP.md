# GitHub Pages Setup - Final Step

## Quick Setup (2 minutes)

1. Go to GitHub: https://github.com/kumarhanwatkar/decentralizedenterpriseresourceplanning
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`

5. Click **Save**

## Wait & Visit

- GitHub will process for 1-2 minutes
- Then your site will be live at:
  ```
  https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
  ```

## Verify Deployment

1. Check GitHub Pages status:
   - Go to **Settings** → **Pages**
   - Look for green checkmark: "Your site is live at https://..."

2. Open your site in browser:
   ```
   https://kumarhanwatkar.github.io/decentralizedenterpriseresourceplanning/
   ```
   You should see your ERP landing page!

## Troubleshooting

**If you see "404 - GitHub Pages"**:
- Verify dist/index.html exists on GitHub
- Check browser console for errors (F12)
- Wait 2-3 minutes for Pages to rebuild

**If you see "white page"**:
- Open DevTools (F12) → Console
- Look for errors
- Usually means API not connecting (check Render URL in frontend)

**If styles look wrong**:
- Clear browser cache (Ctrl+Shift+Delete)
- Check base path is correct: `/decentralizedenterpriseresourceplanning/`
