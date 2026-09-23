# 🌱 TerraCrop – Precision Agriculture & Farm Intelligence

TerraCrop is an AI-powered precision agriculture platform designed to help farmers make data-driven decisions. It combines crop health monitoring, field intelligence, weather insights, smart irrigation, AI-based crop disease diagnosis, agronomic recommendations, and farm economics in a single platform.

## 🚀 Features

* 🗺️ **Field Intelligence** – Monitor field-level crop and environmental data.
* 🌿 **Crop Health Monitoring** – Analyze NDVI and other crop health indicators.
* 💧 **Smart Irrigation** – Monitor soil moisture and manage irrigation zones.
* 🌦️ **Weather Intelligence** – View weather conditions and agricultural insights.
* 🩺 **AI Crop Doctor** – Analyze crop symptoms and get AI-assisted disease insights.
* 🤖 **AI Agronomist** – Get AI-powered recommendations based on field conditions.
* 🚜 **Farm Operations** – Manage agricultural operations and activities.
* 💰 **Farm Economics** – Estimate yield, revenue, costs, margins, and break-even yield.
* 📈 **Commodity Market** – Monitor agricultural commodity information.

## 🤖 AI Capabilities

TerraCrop uses Google's Gemini AI to provide:

* Crop disease diagnosis
* Disease severity and confidence analysis
* Suggested treatment and preventive measures
* Field-specific agronomic recommendations
* Data-driven farming insights

## 🛠️ Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* TypeScript

**AI**

* Google Gemini API

**Other**

* Lucide React
* Motion
* Agricultural field and crop datasets

## 📂 Project Structure

```text
TerraCrop/
├── src/
│   ├── assets/images
│   ├── components/
│   ├── data/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/llax78/TerraCrop.git
cd TerraCrop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example` and add your required API configuration.

**Never commit your actual API keys or secrets to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

## 🎯 Objective

The goal of TerraCrop is to bring multiple aspects of precision agriculture into one intelligent platform, helping farmers understand field conditions, monitor crop health, manage irrigation, receive AI-assisted recommendations, and make more informed farm-management decisions.

## 🔮 Future Scope

* Real-time IoT sensor integration
* Satellite and drone imagery
* Live weather APIs
* Real-time farm databases
* Advanced crop yield prediction
* Automated irrigation control
* Multi-farm and multi-user management

