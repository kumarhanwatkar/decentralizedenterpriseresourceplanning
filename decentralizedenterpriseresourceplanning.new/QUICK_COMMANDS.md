# 🚀 QUICK COMMANDS TO RUN THE PROJECT

## **ONE-LINER QUICK START**

### **Option 1: Using NPM (Recommended)**
```bash
# Terminal 1 - Start Backend
cd d:\Finalproject2\backend && npm run dev

# Terminal 2 - Start Frontend  
cd d:\Finalproject2 && npm run dev
```

Then open: **http://localhost:3001/decentralizedenterpriseresourceplanning/**

---

## **TESTING EVERYTHING**

### **Login Credentials**
```
Admin Account:
  Email:    admin@erp.com
  Password: password123

Employee Account:
  Email:    emp@erp.com
  Password: password123
```

### **Test Each Page**

| Page | URL | Test |
|------|-----|------|
| Home | `/` | Click "Get Started" → Goes to Login |
| About | `/about` | Mission statement visible |
| Contact | `/contact` | Fill form → Submit |
| Login | `/login` | Enter credentials → Login |
| Admin | `/admin` | View dashboard + stats |
| Payroll | `/admin/payroll` | Check payroll overview |
| Resources | `/admin/resources` | Manage resources |
| Transactions | `/admin/transactions` | Real-time updates (30s) |
| AI Config | `/admin/ai-config` | Try natural language input |
| Employee | `/employee` | View earnings + transactions |

---

## **REAL-TIME TESTING**

### **Transactions Auto-Refresh**
1. Go to `/admin/transactions`
2. Click "Refresh" button
3. New transaction appears (auto-refresh every 30s)
4. Watch the "Date/Time" column update

### **Theme Toggle**
1. Click Moon icon (top right)
2. Page switches to dark/light theme
3. Preference saves to localStorage
4. Revisit page → Theme persists

### **Mobile Responsive**
1. Press `F12` (DevTools)
2. Click device toolbar icon
3. Select different devices
4. Navigate → All buttons work on mobile

---

## **BACKEND API TESTING**

### **Check Backend Health**
```bash
curl https://erp-api-pr9p.onrender.com/health
```

### **Seed Database**
```bash
curl -X POST https://erp-api-pr9p.onrender.com/api/admin/seed \
  -H "x-seed-key: seed_secret_key_12345" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### **Get Employees**
```bash
curl https://erp-api-pr9p.onrender.com/api/employees
```

### **Get Resources**
```bash
curl https://erp-api-pr9p.onrender.com/api/resources
```

---

## **GITHUB OPERATIONS**

### **View Recent Commits**
```bash
cd d:\Finalproject2
git log --oneline -10
```

### **Check Current Status**
```bash
git status
```

### **Make Changes & Push**
```bash
git add -A
git commit -m "Your message here"
git push origin main
```

---

## **BUILD FOR PRODUCTION**

### **Build Frontend**
```bash
cd d:\Finalproject2
npm run build
```

Output: `decentralizedenterpriseresourceplanning/dist/`

### **Preview Production Build**
```bash
npm run preview
```

---

## **COMMON ISSUES & FIXES**

### **Issue: Port Already in Use**
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or let Vite use next available port
```

### **Issue: Blank Page**
```bash
# Clear cache
localStorage.clear()
sessionStorage.clear()

# Hard refresh
Ctrl + Shift + R  (or Cmd + Shift + R on Mac)
```

### **Issue: Changes Not Showing**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install

# Restart dev server
```

### **Issue: Git Conflicts**
```bash
# Abort merge and try again
git merge --abort
git pull origin main
git push origin main
```

---

## **USEFUL SHORTCUTS**

### **VS Code**
```
Ctrl + K + C    → Comment code
Ctrl + K + U    → Uncomment code
Ctrl + /        → Toggle comment
Alt + Up/Down   → Move line up/down
Shift + Alt + D → Delete line
```

### **Browser Dev Tools**
```
F12             → Open DevTools
Ctrl + Shift + I → Open Inspector
Ctrl + Shift + J → Open Console
Ctrl + Shift + K → Open Console (Firefox)
```

---

## **FILE OPERATIONS**

### **View All Pages**
```bash
ls d:\Finalproject2\decentralizedenterpriseresourceplanning\src\pages -Recurse
```

### **Count Lines of Code**
```bash
# Count all TypeScript files
Get-ChildItem -Recurse -Filter "*.tsx" | Measure-Object -Line | Select-Object Lines
```

### **Search for Text**
```bash
# Find all occurrences
grep -r "SearchTerm" d:\Finalproject2\src\
```

---

## **DEPLOYMENT**

### **Deploy Frontend to GitHub Pages**
```bash
cd d:\Finalproject2\decentralizedenterpriseresourceplanning
npm run build
# Push to GitHub → Settings → Pages → Select branch & folder
```

### **Deploy Backend to Render**
```bash
# Already deployed!
# Backend: https://erp-api-pr9p.onrender.com
```

---

## **MONITORING**

### **Check Backend Status**
```bash
curl -I https://erp-api-pr9p.onrender.com/health
# Should return Status: 200 OK
```

### **View Frontend Logs**
```bash
# Browser Console (F12 → Console tab)
console.log('Check for errors')
```

### **View Backend Logs**
```bash
# Render Dashboard
# https://dashboard.render.com
```

---

## **DOCUMENTATION**

### **Project Guides**
```
✓ COMPLETE_FRONTEND_IMPLEMENTATION.md
✓ QUICK_REFERENCE.md
✓ SYSTEM_READY_FOR_DEPLOYMENT.md
✓ COMPREHENSIVE_VERIFICATION_GUIDE.md
```

### **Quick References**
```
✓ README.md              - Project overview
✓ GUIDE_LIBRARY.md       - All guides index
✓ ROADMAP.md             - Development roadmap
```

---

## **PERFORMANCE TIPS**

### **Optimize Build Size**
```bash
npm run build --profile  # Analyze bundle size
```

### **Monitor Network**
```
F12 → Network tab → Check API calls
```

### **Check Performance**
```
F12 → Lighthouse → Run audit
```

---

## **GIT WORKFLOW**

### **Create Branch**
```bash
git checkout -b feature-name
git push -u origin feature-name
```

### **Merge to Main**
```bash
git checkout main
git merge feature-name
git push origin main
```

### **Revert Changes**
```bash
git revert HEAD~1  # Revert last commit
git push origin main
```

---

## **ENVIRONMENT VARIABLES**

### **Frontend**
```bash
# .env.development
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=D-ERP
```

### **Backend**
```bash
# .env
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

---

## **FINAL CHECKLIST**

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3001
- [ ] Can login with credentials
- [ ] Dark mode theme toggle works
- [ ] All pages load without errors
- [ ] Navbar navigation works on all pages
- [ ] Real-time transactions update
- [ ] Forms can be filled and submitted
- [ ] Mobile responsive design works
- [ ] Changes committed to GitHub

---

## **WHAT'S NEXT?**

1. ✅ **Pages Working** → All 8 pages functional
2. ✅ **Navigation Fixed** → All links working
3. ✅ **Dark Mode Done** → Theme toggle complete
4. ✅ **Real-time Ready** → Auto-refresh enabled
5. ⏳ **backend Integration** → Connect forms to backend
6. ⏳ **Authentication** → Real token-based auth
7. ⏳ **Database** → Real data persistence
8. ⏳ **Deployment** → Live on GitHub Pages

---

**Everything is setup and ready to go!** 🎉

Start with the quick start commands above and enjoy! 🚀
