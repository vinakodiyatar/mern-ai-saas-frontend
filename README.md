# Frontend - AI Marketing SaaS (React)

## Overview

This is the frontend application built using React.js for an AI-powered digital marketing SaaS platform.

Users can:

- Register and login
- Generate marketing content using AI
- View their past generated content
- Track their usage limits

---

## Tech Stack

- React.js (Hooks)
- Context API (Global State)
- Tailwind CSS
- Fetch API

---

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/vinakodiyatar/mern-ai-saas-frontend.git
cd frontend
```

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in root:

```bash
VITE_API_BASE=
```

Example:

```bash
VITE_API_BASE=https://your-backend.onrender.com
```

---

## Live Application

[https://mern-ai-saas-frontend-nq03gkqnj-vinas-projects-3fd858f7.vercel.app]

---

## 🔗 Backend Connection

This frontend communicates with the backend API hosted at:

[https://mern-ai-saas-backend.onrender.com]

---

## Features

- User authentication (Login/Register)
- AI content generation interface
- Usage quota display
- History page
- Loading states
- Error handling
- Responsive UI

---
##  Supported Use Cases

The application supports multiple digital marketing workflows:

### 1. Product / Service Content Generation
- Input:
  - Product or Service (required)
  - Target Audience
  - Optional Keywords
- Output:
  - Marketing content (captions, ad copy, etc.)

### 2. SEO / Google Ads Content
- Input:
  - Target Keyword (required)
  - Reference URL or Topic (optional)
- Output:
  - SEO-optimized content
  - Google Ads style copy

Different prompt structures are used for each use case to generate more relevant and high-quality AI responses.

## SaaS Behavior

- Each user can only access their own data
- API calls are authenticated using JWT
- Usage limit enforced via backend

---

## Limitations

- Basic UI design
- No caching
- Limited quota system

---

## Future Improvements

- Improve UI/UX
- Add streaming responses
- Add export functionality
- Add subscription tiers

---
