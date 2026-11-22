# 📱 Logistik Palu — Frontend Web Application

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-JSON-009688?style=for-the-badge)

A mobile-first web application built with **React JS** and **Tailwind CSS** to streamline daily delivery scheduling and multi-trip route navigation for perishable product distribution (**UMKM Air Tahu Gurih**). 

This frontend interfaces with a Python REST API running a **Hybrid Sweep & Simulated Annealing** optimization engine, translating complex capacitated vehicle routing calculations into an intuitive, courier-friendly mobile interface.

---

## 🎯 Business Impact & Key Highlights

* **22.99% Route Distance Reduction:** Cuts daily delivery travel from `45.54 km` (manual routing) down to `35.07 km`.
* **100% Freshness Guarantee:** Breaks deliveries into capacity-compliant trips (`≤ 50 bottles/trip`), ensuring every route completes well under the `120-minute` room-temperature spoilage threshold.
* **Zero Paid Maps API Cost:** Uses dynamic **Google Maps URL Schemes (`waypoints`)** to launch native turn-by-turn navigation directly on the courier's smartphone without incurring Google Distance Matrix or Maps SDK billing.

---

## 🎨 UI/UX Design Principles

1. **One-Handed Mobile Ergonomics:** Designed primarily for smartphone screens with large touch targets, clear visual hierarchy, and card-based route breakdowns for couriers operating in the field.
2. **Frictionless Daily Scheduling:** Because retail store locations are fixed while daily order quantities fluctuate, the main scheduling screen uses a fast **checkbox + inline demand editor** workflow rather than repetitive data entry.
3. **Clear Load & Sequence Visibility:** Each trip card clearly displays total bottle load (`e.g., Muatan: 50 Botol`), estimated duration, and chronological stops from Depot to Depot to prevent loading errors.

---

## ✨ Core Features & User Workflow

### 1. Store Master Management (`/customers`)
* View all registered partner retail outlets with total store counters, GPS coordinate previews, and store location photos.
* **Auto-Coordinate Extraction:** Adding a new store only requires pasting a Google Maps share link—the system automatically parses the `latitude` and `longitude` coordinates.

### 2. Daily Route Scheduling (`/` — Home)
* Select active ordering stores for the current delivery day via checkboxes.
* Adjust daily bottle demand (`demand`) per store before triggering the backend optimization engine.

### 3. Multi-Trip Route Breakdown (`/trip-detail`)
* Displays high-level operational KPIs: Courier Name, Total Daily Distance (`km`), and Total Estimated Duration.
* Organizes deliveries into sequential **Trip Cards (`Trip Pengiriman #1` – `#5`)**, listing every stop and drop-off quantity.
* **One-Tap Navigation:** Each trip card includes a direct action button that opens the native **Google Maps app** pre-loaded with all stops in optimal sequence.
