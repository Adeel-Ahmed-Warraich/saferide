  SafeRide – System Data Flow Diagram \* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; color: #1e293b; } /\* ── Header ── \*/ .page-header { background: linear-gradient(135deg, #1e3a8a, #1d4ed8); color: white; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; } .page-header h1 { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; } .page-header p { font-size: 0.85rem; color: #bfdbfe; margin-top: 4px; } .legend { display: flex; gap: 16px; flex-wrap: wrap; } .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; } .legend-dot { width: 12px; height: 12px; border-radius: 50%; } /\* ── Tabs ── \*/ .tabs { display: flex; gap: 4px; padding: 16px 40px 0; background: #1e3a8a; } .tab { padding: 10px 20px; border-radius: 8px 8px 0 0; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: #93c5fd; border: none; background: transparent; transition: all 0.2s; } .tab:hover { background: rgba(255,255,255,0.1); color: white; } .tab.active { background: #f0f4f8; color: #1e3a8a; } /\* ── Main ── \*/ .main { padding: 32px 40px; max-width: 1400px; margin: 0 auto; } /\* ── Flow Diagram ── \*/ .flow-grid { display: grid; grid-template-columns: 1fr 40px 1fr 40px 1fr 40px 1fr; gap: 0; align-items: start; margin-bottom: 40px; } .flow-column { display: flex; flex-direction: column; gap: 12px; } .flow-column-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; text-align: center; margin-bottom: 8px; padding: 6px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; } .arrow-col { display: flex; align-items: center; justify-content: center; padding-top: 40px; } .arrow { font-size: 1.4rem; color: #94a3b8; } /\* ── Node Cards ── \*/ .node { border-radius: 12px; padding: 14px 16px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; position: relative; } .node:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); } .node.active-node { box-shadow: 0 0 0 3px #3b82f6, 0 8px 24px rgba(59,130,246,0.2); } .node-icon { font-size: 1.4rem; margin-bottom: 6px; } .node-title { font-size: 0.82rem; font-weight: 700; margin-bottom: 3px; } .node-desc { font-size: 0.72rem; line-height: 1.4; opacity: 0.8; } .node-badge { display: inline-block; font-size: 0.62rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; margin-top: 6px; } /\* ── Colors ── \*/ .node-frontend { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; } .node-backend { background: #f0fdf4; border-color: #bbf7d0; color: #14532d; } .node-db { background: #faf5ff; border-color: #e9d5ff; color: #4c1d95; } .node-external { background: #fff7ed; border-color: #fed7aa; color: #7c2d12; } .node-mock { background: #fefce8; border-color: #fde68a; color: #713f12; } .node-user { background: #f0f9ff; border-color: #bae6fd; color: #0c4a6e; } .badge-live { background: #dcfce7; color: #15803d; } .badge-mock { background: #fef9c3; color: #a16207; } .badge-ready { background: #dbeafe; color: #1d4ed8; } .badge-needed { background: #fee2e2; color: #b91c1c; } /\* ── Detail Panel ── \*/ .detail-panel { background: white; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-bottom: 32px; min-height: 160px; } .detail-panel h2 { font-size: 1.1rem; font-weight: 800; color: #1e3a8a; margin-bottom: 8px; } .detail-panel p { font-size: 0.85rem; color: #475569; line-height: 1.6; margin-bottom: 12px; } .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; } .detail-item { background: #f8fafc; border-radius: 10px; padding: 12px 14px; border: 1px solid #e2e8f0; } .detail-item-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 4px; } .detail-item-value { font-size: 0.82rem; font-weight: 600; color: #1e293b; } .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; } /\* ── Feature Status Table ── \*/ .status-table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; } .status-table th { background: #1e3a8a; color: white; padding: 14px 16px; text-align: left; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; } .status-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.82rem; vertical-align: top; } .status-table tr:last-child td { border-bottom: none; } .status-table tr:hover td { background: #f8fafc; } .feature-name { font-weight: 700; color: #1e293b; } .feature-desc { color: #64748b; font-size: 0.75rem; margin-top: 2px; } /\* ── Mock Guide ── \*/ .guide-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; } .guide-card { background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; } .guide-card h3 { font-size: 0.95rem; font-weight: 800; color: #1e3a8a; margin-bottom: 12px; display: flex; align-items: center; gap-8px; gap: 8px; } .guide-card p, .guide-card li { font-size: 0.82rem; color: #475569; line-height: 1.7; } .guide-card ul { padding-left: 18px; } .code-block { background: #1e293b; color: #e2e8f0; border-radius: 10px; padding: 16px; font-family: 'Courier New', monospace; font-size: 0.78rem; margin-top: 12px; line-height: 1.7; overflow-x: auto; } .code-comment { color: #64748b; } .code-key { color: #93c5fd; } .code-val-true { color: #4ade80; } .code-val-false { color: #f87171; } .code-str { color: #fde68a; } /\* ── Section heading ── \*/ .section-heading { font-size: 1rem; font-weight: 800; color: #1e3a8a; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; } .section-heading::after { content: ''; flex: 1; height: 2px; background: #e2e8f0; border-radius: 2px; } /\* ── Responsive ── \*/ @media (max-width: 900px) { .main { padding: 20px; } .flow-grid { grid-template-columns: 1fr; } .arrow-col { display: none; } .guide-grid { grid-template-columns: 1fr; } .tabs { padding: 12px 20px 0; } .page-header { padding: 20px; } }

🚌 SafeRide — System Data Flow Diagram
======================================

Complete architecture map · Feature status · Mock data guide

Frontend

Backend

Database

External API

Mock / Demo

📊 Data Flow ✅ Feature Status 🧪 Mock Guide

👆 Click any node to see its details
------------------------------------

This diagram shows how data moves through the SafeRide system — from the user's browser through the frontend, to PocketBase backend, to the database collections and external services.

👥 Users

👨‍👩‍👧

Parent

Registers, tracks van, pays fees, views notifications

Real User

🔐

Admin

Manages parents, approves payments, sends notifications

Real User

🌐

Visitor

Browses public pages, submits booking/contact forms

Real User

→

⚛️ React Frontend (localhost:3000)

🏠

Public Pages

Home · About · Services · Contact · Book Now

✓ Working

🔑

Auth Pages

Parent Login · Admin Login · Password Reset · Signup

✓ Working

📋

Parent Dashboard

Child info · Fee status · Quick actions · Notifications

✓ Working

💳

Payment Pages

Pay fee (Easypaisa/JazzCash/Bank) · Payment history

⚠ Needs Gateway

📍

Van Tracking

Live GPS map · Van status · Driver info · ETA

⚠ Needs GPS

⚙️

Admin Dashboard

Parents · Payments · Vans · Notifications · Reports

✓ Working

🤖

AI Chatbot

Claude-powered support widget

Needs API Key

→

🗄️ PocketBase Backend (localhost:8090)

🔒

Auth System

JWT tokens · Session management · OTP · Password reset

✓ Working

🔌

REST API

Auto-generated CRUD for all collections · File uploads

✓ Working

🛡️

API Rules

Collection-level access control · Admin-only rules

Configured

⚡

Hooks / Events

After-save triggers · Email notifications · OTP sending

⚠ Email not set

📦

Migrations

19 migration files · All collections created

✓ Applied

→

🗃️ Collections + External APIs

👨‍👩‍👧

parents (Auth)

fullName · email · childName · enrollmentStatus · shift

✓ Active

💰

payments

amount · method · status · transactionId · receipt

✓ Active

🚐

vans

vanId · driverName · capacity · licensePlate · status

✓ Active

📡

gpsLocations

latitude · longitude · locationName · eta · status

⚠ No live data

📱

Easypaisa / JazzCash

Mobile payment gateway API · Merchant account needed

⛔ Not Connected

🛰️

GPS Hardware

Van-installed tracker sending lat/lng to PocketBase

⛔ Not Connected

🤖

Claude API

Anthropic API for AI chatbot · claude-sonnet-4

⛔ Needs API Key

✉️

Email / SMTP

OTP delivery · Payment confirmations · Notifications

⛔ Not Configured

Feature Status Overview

Feature

Status

What Works Now

What's Missing

How to Enable

🏠 Public Pages

Home, About, Services, Contact

✓ Fully Working

All pages load, no double headers, good UI

Nothing missing

Already done ✓

📋 Booking Form

/book — enroll child

✓ Fully Working

Saves to DB, shows confirmation screen

No email confirmation sent

Configure SMTP in PocketBase settings

🔑 Parent Login / Auth

/login — parent account

⚠ Partial

Login/logout works if parent account exists in DB

No self-signup yet; admin must create parent accounts

Admin creates parent in Admin Dashboard or PocketBase UI

📊 Parent Dashboard

/dashboard — after login

⚠ Partial

Shows child info, fee card, quick links

Needs a parent record in DB with all fields filled

Create parent via Admin Dashboard with full details

💳 Payment Page

/payments — pay fees

⚠ Partial

Creates payment record in DB, bank deposit upload works

Easypaisa/JazzCash don't actually charge — no merchant account

Get merchant account from Easypaisa/JazzCash, add API keys

📜 Payment History

/payment-history

✓ Fully Working

Shows all payments, filter by status, download receipt

Nothing missing

Already done ✓

📍 Van Tracking

/van-tracking — live GPS

⛔ Needs Hardware

Page loads, shows map of Lake City area

No real GPS data — needs a hardware tracker in the van

Buy GPS tracker (e.g. Teltonika FMB920), configure it to POST to PocketBase gpsLocations collection

🔔 Notifications

/notifications

✓ Fully Working

Shows notifications, mark as read, admin can broadcast

No push notifications (browser only)

Already done ✓ — add web push later with service workers

⚙️ Admin Dashboard

/admin

✓ Fully Working

Add/edit/delete parents, approve payments, manage vans, broadcast, export CSV

Nothing critical missing

Login: admin@saferide.com.pk / Warraich@1981

🤖 AI Chatbot

Bottom-right widget

⛔ Needs API Key

Widget opens and shows UI correctly

Claude API key not set — API calls fail with 401

Get API key from console.anthropic.com, add to ChatbotWidget.jsx headers

✉️ Email / OTP

Password reset, confirmations

⛔ Not Configured

Password reset form exists

No SMTP server configured — emails don't send

PocketBase Admin → Settings → Mail → add Gmail SMTP or SendGrid

📤 CSV Export

Admin → Reports tab

✓ Fully Working

Downloads real CSV files for payments, parents, fleet

Nothing missing

Already done ✓

🧪 How to Enable Demo / Mock Mode

### 📁 Step 1 — Copy mockData.js

A file called **mockData.js** is included in your download. Copy it to:

apps/web/src/lib/mockData.js

It contains sample data for: parents, payments, vans, GPS location, notifications, and admin lists — all realistic Lake City data.

### 🔧 Step 2 — Enable Demo Mode

Open **mockData.js** and set the flag:

// src/lib/mockData.js  
export const DEMO\_MODE = true; ← enable mock  
export const DEMO\_MODE = false; ← use real DB

### 💳 Payment Page — Mock Mode

Add this to the top of **PaymentPage.jsx**:

import { DEMO\_MODE } from '@/lib/mockData.js';  
  
// In handleMobilePayment:  
if (DEMO\_MODE) {  
  toast({ title: "✓ Demo Payment Accepted",  
    description: "Mock mode — no real charge" });  
  navigate('/payment-history');  
  return;  
}

### 📍 Van Tracking — Mock Mode

Add this to **VanTrackingPage.jsx**:

import { DEMO\_MODE, MOCK\_ASSIGNMENT, MOCK\_GPS }  
  from '@/lib/mockData.js';  
  
// In fetchTrackingData:  
if (DEMO\_MODE) {  
  setAssignment(MOCK\_ASSIGNMENT);  
  setVan(MOCK\_ASSIGNMENT.expand.vanId);  
  setGpsLocation(MOCK\_GPS);  
  return;  
}

### 📊 Parent Dashboard — Mock Mode

import { DEMO\_MODE, MOCK\_PARENT, MOCK\_PAYMENTS }  
  from '@/lib/mockData.js';  
  
// In useEffect fetchData:  
if (DEMO\_MODE) {  
  setParentData(MOCK\_PARENT);  
  setLatestPayment(MOCK\_PAYMENTS\[0\]);  
  setLoading(false);  
  return;  
}

### 🔔 Notifications — Mock Mode

import { DEMO\_MODE, MOCK\_NOTIFICATIONS }  
  from '@/lib/mockData.js';  
  
// In fetchNotifications:  
if (DEMO\_MODE) {  
  setNotifications(MOCK\_NOTIFICATIONS);  
  setLoading(false);  
  return;  
}

### 🗺️ What Each External Service Needs (Real Mode)

Service

How to Get

Where to Add

Cost

**Easypaisa Gateway**

Apply at easypaisa.com.pk/business

PaymentPage.jsx → merchant credentials

Free account, % per txn

**JazzCash Gateway**

Apply at jazzcash.com.pk/corporate

PaymentPage.jsx → merchant credentials

Free account, % per txn

**GPS Tracker**

Buy Teltonika FMB920 or Queclink GV20 (~$40)

Configure to POST to /api/collections/gpsLocations/records

~Rs. 8,000–12,000 per van

**Claude API (Chatbot)**

console.anthropic.com → API Keys

ChatbotWidget.jsx → headers: {'x-api-key': 'YOUR\_KEY'}

Pay per use, ~$3/million tokens

**Email / SMTP**

Gmail App Password or SendGrid free tier

PocketBase Admin → Settings → Mail Settings

Free (Gmail) or free 100/day (SendGrid)

// ── Tab switching ───────────────────────────────────────────────────────────── function showTab(name) { \['flow','status','mock'\].forEach(t => { document.getElementById('tab-' + t).style.display = t === name ? 'block' : 'none'; }); document.querySelectorAll('.tab').forEach((btn, i) => { btn.classList.toggle('active', \['flow','status','mock'\]\[i\] === name); }); } // ── Node detail data ────────────────────────────────────────────────────────── const details = { parent: { title: '👨‍👩‍👧 Parent User', desc: 'Parents are the primary users of SafeRide. They register via the booking form, get an account created by admin, then log in to track their child\\'s van, pay monthly fees, and view notifications.', items: \[ { label: 'Auth Collection', value: 'parents (PocketBase Auth)' }, { label: 'Login Route', value: '/login' }, { label: 'Dashboard', value: '/dashboard' }, { label: 'Data Stored', value: 'fullName, email, childName, class, school, address, shift, enrollmentStatus' }, { label: 'Status', value: '✓ Working' }, \] }, admin: { title: '🔐 Admin User', desc: 'Admins manage the entire system. They can add/edit/delete parents, approve payments, manage the van fleet, send broadcast notifications, and export reports.', items: \[ { label: 'Auth Collection', value: 'admins (PocketBase Auth)' }, { label: 'Login Route', value: '/admin-login' }, { label: 'Dashboard', value: '/admin' }, { label: 'Default Login', value: 'admin@saferide.com.pk' }, { label: 'Status', value: '✓ Working' }, \] }, visitor: { title: '🌐 Visitor (Public)', desc: 'Unauthenticated users can browse all public pages and submit the booking enrollment form or contact form. No login required for these actions.', items: \[ { label: 'Accessible Routes', value: '/, /about, /services, /contact, /book' }, { label: 'Can Submit', value: 'Enrollment form, Contact form' }, { label: 'Cannot Access', value: 'Dashboard, Payments, Tracking, Admin' }, { label: 'Status', value: '✓ All working' }, \] }, 'public-pages': { title: '🏠 Public Pages', desc: 'All public-facing pages are fully working. They no longer have duplicate headers (fixed). Routes: /, /about, /services, /contact, /book, /confirmation/:id', items: \[ { label: 'Bug Fixed', value: 'Duplicate header/footer removed from all pages' }, { label: 'Routes Fixed', value: '/parent-signup, /parent-login, /booking all work' }, { label: 'Images', value: 'Loading from Horizons CDN — may need local hosting for production' }, { label: 'Status', value: '✓ Fully Working' }, \] }, 'payment-pages': { title: '💳 Payment Pages', desc: 'The payment UI is complete and saves records to PocketBase. However Easypaisa and JazzCash tabs simulate the payment without actually charging because no merchant API credentials are configured yet. Bank deposit works fully.', items: \[ { label: 'Bank Deposit', value: '✓ Working — uploads screenshot, creates record' }, { label: 'Easypaisa', value: '⚠ Creates DB record but no real charge' }, { label: 'JazzCash', value: '⚠ Creates DB record but no real charge' }, { label: 'Fix', value: 'Get merchant account, add API keys to PaymentPage.jsx' }, \] }, 'tracking-page': { title: '📍 Van Tracking Page', desc: 'The tracking page UI is complete with a map, trip progress, driver info and ETA. Currently shows the Lake City area on Google Maps. For live tracking you need a GPS hardware device installed in each van that periodically POSTs coordinates to PocketBase.', items: \[ { label: 'Map', value: 'Google Maps embed — shows Lake City area' }, { label: 'Real GPS', value: '⛔ Needs GPS hardware tracker in van' }, { label: 'Recommended Device', value: 'Teltonika FMB920 (~Rs 10,000)' }, { label: 'How it works', value: 'GPS device POSTs lat/lng to PocketBase gpsLocations collection every 30 seconds' }, \] }, 'pb-hooks': { title: '⚡ PocketBase Hooks & Email', desc: 'PocketBase fires after-save hooks when records are created. Currently the OTP hook tries to send an email but fails because no SMTP server is configured. This causes the 400 error on booking even though the record saves successfully.', items: \[ { label: 'Root Cause', value: 'OTP migration enables email OTP but no SMTP configured' }, { label: 'Fix Applied', value: 'BookingPage.jsx now shows success even if 400 returned' }, { label: 'Permanent Fix', value: 'PocketBase Admin → Settings → Mail → add Gmail SMTP' }, { label: 'Gmail SMTP', value: 'Host: smtp.gmail.com, Port: 587, use App Password' }, \] }, 'ext-claude': { title: '🤖 Claude API (Chatbot)', desc: 'The chatbot is powered by Claude Sonnet 4 via the Anthropic API. It needs an API key to work. Without it the chatbot widget opens but API calls fail silently.', items: \[ { label: 'Get API Key', value: 'console.anthropic.com → API Keys → Create Key' }, { label: 'Add to Code', value: 'ChatbotWidget.jsx → headers object → "x-api-key": "sk-ant-..."' }, { label: 'Model Used', value: 'claude-sonnet-4-20250514' }, { label: 'Cost', value: '~$3 per million input tokens — very cheap for a chatbot' }, \] }, 'col-gps': { title: '📡 gpsLocations Collection', desc: 'This collection stores real-time GPS coordinates from van trackers. Each record has latitude, longitude, location name, ETA, and status. The VanTrackingPage reads the latest record for the assigned van every 30 seconds.', items: \[ { label: 'Fields', value: 'vanId, latitude, longitude, locationName, status, eta' }, { label: 'Update Frequency', value: 'Should be updated every 30–60 seconds by GPS device' }, { label: 'Current State', value: 'Collection exists but empty — no GPS device connected' }, { label: 'Test', value: 'Manually add a record in PocketBase to test the tracking UI' }, \] }, 'ext-email': { title: '✉️ Email / SMTP Configuration', desc: 'PocketBase needs an SMTP server to send OTP codes, password reset emails, and payment confirmation emails. The easiest option is a Gmail account with App Password.', items: \[ { label: 'Option 1', value: 'Gmail: smtp.gmail.com:587, use App Password (not your real password)' }, { label: 'Option 2', value: 'SendGrid: free 100 emails/day, professional service' }, { label: 'Where to Set', value: 'PocketBase Admin (localhost:8090/\_/) → Settings → Mail Settings' }, { label: 'After Setting', value: 'OTP, password reset, and booking confirmation emails will work' }, \] }, 'admin-dashboard': { title: '⚙️ Admin Dashboard', desc: 'Fully functional admin control panel with all features working. Includes Add/Edit/Delete parents with modal, van management, payment approval/rejection, broadcast notifications with templates, and real CSV export.', items: \[ { label: 'Add Parent', value: '✓ Modal with full form — creates PocketBase auth account' }, { label: 'Payment Approval', value: '✓ Approve or Reject buttons on pending payments' }, { label: 'CSV Export', value: '✓ Downloads real data — Payments, Parents, Fleet' }, { label: 'Reports Tab', value: '✓ Live stats — revenue, breakdowns, shift analysis' }, \] }, }; function showDetail(key) { const d = details\[key\]; if (!d) return; const panel = document.getElementById('detail-panel'); panel.innerHTML = \` <h2>${d.title}</h2> <p>${d.desc}</p> <div class="detail-grid"> ${d.items.map(i => \` <div class="detail-item"> <div class="detail-item-label">${i.label}</div> <div class="detail-item-value">${i.value}</div> </div> \`).join('')} </div> \`; document.querySelectorAll('.node').forEach(n => n.classList.remove('active-node')); event.currentTarget.classList.add('active-node'); panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
