# 🚌 SafeRide — School Transport Management System

A full-stack web application for managing school van transport services in Lake City, Lahore, Pakistan.

**Live:** [saferide.com.pk](https://saferide.com.pk)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui |
| Backend | PocketBase v0.28.2 |
| Hosting | Hostinger Business Web Hosting |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```
saferide/
├── apps/
│   ├── api/              ← PocketBase backend + Node.js wrapper
│   │   ├── src/
│   │   │   └── main.js   ← Express proxy (Hostinger Passenger compatible)
│   │   ├── pb_migrations/← Database schema migrations
│   │   └── pb_data/      ← SQLite database (gitignored)
│   └── web/              ← React frontend
│       ├── src/
│       │   ├── pages/    ← Route pages
│       │   ├── components/
│       │   ├── contexts/ ← AuthContext
│       │   └── lib/      ← pocketbaseClient, utils
│       └── public/       ← Static assets
└── start.bat             ← Local dev launcher (Windows)
```

---

## Local Development

### Prerequisites

- Node.js 20+
- PocketBase binary (see below)

### 1 — Download PocketBase

Download **PocketBase v0.28.2** for your OS:

- **Windows:** [pocketbase_0.28.2_windows_amd64.zip](https://github.com/pocketbase/pocketbase/releases/download/v0.28.2/pocketbase_0.28.2_windows_amd64.zip)
- **Linux:** [pocketbase_0.28.2_linux_amd64.zip](https://github.com/pocketbase/pocketbase/releases/download/v0.28.2/pocketbase_0.28.2_linux_amd64.zip)
- **Mac (Intel):** [pocketbase_0.28.2_darwin_amd64.zip](https://github.com/pocketbase/pocketbase/releases/download/v0.28.2/pocketbase_0.28.2_darwin_amd64.zip)

Extract and place the binary in `apps/api/`:
```
apps/api/pocketbase.exe   ← Windows
apps/api/pocketbase       ← Linux/Mac
```

### 2 — Start Backend

```powershell
cd apps/api
.\pocketbase.exe serve --dir=.\pb_data --migrationsDir=.\pb_migrations
```

PocketBase runs at: `http://127.0.0.1:8090`

### 3 — Create Local Admin Superuser

```powershell
cd apps/api
.\pocketbase.exe superuser upsert admin@saferide.com.pk YourPassword
```

Then create an **Admin Portal** user:
- Open `http://127.0.0.1:8090/_/` → login
- Go to `admins` collection → **New record**
- Enter email + password → Save

### 4 — Start Frontend

```powershell
cd apps/web
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 5 — Environment Variables

Create `apps/web/.env.local`:
```
VITE_PB_URL=http://127.0.0.1:8090
```

### Quick Start (Windows)

Double-click `start.bat` in the project root — starts both backend and frontend automatically.

---

## Pages & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/about` | About SafeRide | Public |
| `/services` | Services & pricing | Public |
| `/contact` | Contact form | Public |
| `/book` | Enrollment form | Public |
| `/login` | Parent login | Public |
| `/admin-login` | Admin login | Public |
| `/password-reset` | Password reset | Public |
| `/dashboard` | Parent dashboard | Parent only |
| `/payments` | Pay fees | Parent only |
| `/payment-history` | Payment history | Parent only |
| `/notifications` | Notifications | Parent only |
| `/van-tracking` | Live GPS tracking | Parent only |
| `/admin` | Admin dashboard | Admin only |
| `/accounting` | Income & expenses | Admin only |

---

## PocketBase Collections

| Collection | Type | Description |
|---|---|---|
| `parents` | Auth | Parent accounts + child info |
| `admins` | Auth | Admin portal users |
| `enrollments` | Base | Booking form submissions |
| `payments` | Base | Fee payment records |
| `vans` | Base | Fleet management |
| `assignments` | Base | Parent ↔ Van assignments |
| `notifications` | Base | System notifications |
| `gpsLocations` | Base | Real-time GPS coordinates |
| `income_records` | Base | Accounting — income |
| `vehicle_expenses` | Base | Accounting — expenses |

---

## Deployment

### Frontend (saferide.com.pk)

```powershell
cd apps/web
# Create production env
echo VITE_PB_URL=https://YOUR-API-URL > .env.production
# Build
npx vite build --outDir dist
# Upload dist/ contents to Hostinger public_html
```

### Backend (Node.js App on Hostinger)

```bash
# SSH into server
cd /home/USERNAME/domains/YOUR-DOMAIN/nodejs

# Run migrations
./pocketbase migrate up --dir=/home/USERNAME/pb_data_production --migrationsDir=./pb_migrations

# Create superuser
./pocketbase superuser upsert admin@saferide.com.pk YourPassword
```

**Environment Variables (set in Hostinger hPanel):**
```
PB_DATA_DIR = /home/USERNAME/pb_data_production
```

---

## Features

- ✅ Enrollment / booking form
- ✅ Parent portal (dashboard, payments, notifications)
- ✅ Admin dashboard (full CRUD, CSV export)
- ✅ Accounting module (income, expenses, P&L)
- ✅ AI chatbot (requires Anthropic API key)
- ⚠️ Van GPS tracking (requires hardware tracker)
- ⚠️ Easypaisa/JazzCash (requires merchant account)
- ⚠️ Email/OTP (requires SMTP configuration)

---

## Configuration Checklist

- [ ] Gmail SMTP → PocketBase Admin → Settings → Mail
- [ ] Anthropic API key → `ChatbotWidget.jsx`
- [ ] GPS tracker hardware → Teltonika FMB920 (~Rs. 15,000)
- [ ] Easypaisa merchant account → easypaisa.com.pk/merchant
- [ ] JazzCash merchant account → jazzcash.com.pk/corporate

---

## Branch Strategy

```
main      ← production (auto-deploys to Hostinger)
develop   ← active development
feature/* ← new features (branch off develop)
hotfix/*  ← urgent fixes
```

**Deploy to production:**
```powershell
git checkout main
git merge develop
git push origin main
git checkout develop
```

---

## License

Private — SafeRide School Transport, Lake City, Lahore, Pakistan
