# Brain-BreakBuddy 🧠✨

<div align="center">
https://img.shields.io/badge/BrainBreak-Buddy-8A2BE2
https://img.shields.io/badge/React-18.2-61DAFB
https://img.shields.io/badge/TypeScript-5.0-3178C6
https://img.shields.io/badge/Supabase-2.39-3ECF8E
https://img.shields.io/badge/Tailwind-3.4-06B6D4
https://img.shields.io/badge/License-MIT-green

Learn, Compete, and Stay Tech-Savvy - One Riddle at a Time 🚀

Live Demo •
Report Bug •
Request Feature

<img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200" alt="BrainBreak Buddy Banner" width="800"/></div>
📋 Table of Contents
Overview

✨ Features

🛠️ Tech Stack

📁 Project Structure

🚀 Quick Start

🗄️ Database Setup

🔧 Configuration

📖 Usage Guide

🎨 UI/UX Design

📊 Database Schema

🔒 Security

🚢 Deployment

🤝 Contributing

📝 License

👨‍💻 Author

📖 Overview
BrainBreak Buddy is a daily riddle-solving web application with gamification, social features, and multilingual support. Users solve tech/Sci-Fi riddles daily, maintain streaks, earn points, follow friends, and compete on weekly leaderboards. The app features AI-powered tech news integration and supports English, Tamil, and Tanglish.

🎯 Core Purpose
Transform daily brain breaks into engaging, competitive, and social learning experiences through riddles while keeping users updated with cutting-edge technology news.

✨ Features
🔐 Authentication System
Email/password signup & login

Automatic profile creation

Session management

Protected routes

🎯 Daily Riddle System
One random riddle per day

Multilingual support (English, Tamil, Tanglish)

Instant answer validation

Streak tracking

Points system (10 points per correct answer)

📊 Streak & Gamification
Achievement	Days/Requirement	Icon
Rookie	3-Day Streak	🌟
Enthusiast	1-Week Streak	🔥
Dedicated	1-Month Streak	🏆
Legendary	100 Days!	👑
Perfectionist	Perfect Week	🎯
Social	Follow 5 Friends	👥
Master	Solve 100 Riddles	🧠
👥 Social Features
Discover users - Search by username/email

Follow/unfollow - Build your network

Followed users feed - See their progress

Profile viewing - Check others' streaks

🏆 Weekly Leaderboard
Rankings reset every Monday

Top 3 badges: 🥇 Gold, 🥈 Silver, 🥉 Bronze

Current user rank highlighted

People You Follow section

🌍 Multilingual Support
javascript
// English    → "What has keys but can't open locks?"
// Tamil      → "சாவி இருந்தும் பூட்டை திறக்க முடியாதது எது?"
// Tanglish   → "Savi irundhum pootai thirakka mudiyadhadhu yedhu?"
🤖 Tech News Integration
AI & Social Media Revolution news

Curated articles from top sources

Image-rich cards

News carousel with navigation

⚙️ User Settings
Preferred riddle time

Language selection (EN/TA/TA_EN)

Profile customization

Account management

🛠️ Tech Stack
Frontend
text
├── React 18 + TypeScript
├── Vite - Build Tool
├── Tailwind CSS - Styling
├── shadcn/ui - Component Library
├── React Router DOM v6 - Routing
├── TanStack Query - Data Fetching
└── Lucide React - Icons
Backend
text
├── Supabase - PostgreSQL Database
├── Supabase Auth - Authentication
├── Row Level Security (RLS)
├── Database Triggers & Functions
└── Real-time Subscriptions
DevOps & Tools
text
├── Vercel/Netlify - Hosting
├── Git - Version Control
├── npm - Package Manager
└── VS Code - IDE
📁 Project Structure
text
brainbreak-buddy/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 ui/                 # shadcn/ui components
│   │   ├── 📄 RiddleCard.tsx      # Daily riddle component
│   │   ├── 📄 StreakDisplay.tsx   # Streak & achievements
│   │   ├── 📄 TechNews.tsx        # AI/Tech news
│   │   ├── 📄 DiscoverUsers.tsx   # User search
│   │   └── 📄 UserSearch.tsx      # Search functionality
│   │
│   ├── 📂 pages/
│   │   ├── 📄 Dashboard.tsx       # Main hub
│   │   ├── 📄 Auth.tsx           # Login/Signup
│   │   ├── 📄 Leaderboard.tsx    # Weekly rankings
│   │   ├── 📄 Profile.tsx        # User profile
│   │   ├── 📄 Discover.tsx       # Find & follow users
│   │   ├── 📄 Settings.tsx       # Preferences
│   │   └── 📄 NotFound.tsx       # 404 page
│   │
│   ├── 📂 hooks/
│   │   ├── 📄 use-toast.ts       # Toast notifications
│   │   └── 📄 use-mobile.tsx     # Responsive hooks
│   │
│   ├── 📂 integrations/
│   │   └── 📂 supabase/
│   │       ├── 📄 client.ts      # Supabase client
│   │       └── 📄 types.ts       # TypeScript types
│   │
│   ├── 📂 lib/
│   │   └── 📄 utils.ts           # Utility functions
│   │
│   ├── 📄 App.tsx                # Routing & providers
│   ├── 📄 main.tsx              # Entry point
│   └── 📄 index.css             # Global styles
│
├── 📄 .env.example              # Environment variables
├── 📄 .gitignore               # Git ignore rules
├── 📄 package.json             # Dependencies
├── 📄 tailwind.config.js       # Tailwind config
├── 📄 vite.config.ts          # Vite config
├── 📄 tsconfig.json           # TypeScript config
└── 📄 README.md               # Documentation
🚀 Quick Start
Prerequisites
Ensure you have the following installed:

Node.js 18+ (https://nodejs.org)

npm 9+ (comes with Node.js)

Git (https://git-scm.com)

Supabase Account (https://supabase.com)

1️⃣ Clone the Repository
bash
# Using HTTPS
git clone https://github.com/Ashw-in2006/Brain-BreakBuddy.git

# Using SSH
git clone git@github.com:Ashw-in2006/Brain-BreakBuddy.git

# Navigate to project directory
cd Brain-BreakBuddy
2️⃣ Install Dependencies
bash
# Install all required packages
npm install

# This will install:
# - React & React DOM
# - Supabase client
# - TanStack Query
# - Tailwind CSS
# - shadcn/ui components
# - And all other dependencies
3️⃣ Set Up Supabase
Create a Supabase project at https://supabase.com

Copy your project URL and anon key from Settings → API

Run the database schema (see Database Setup)

4️⃣ Configure Environment Variables
bash
# Copy the example environment file
cp .env.example .env

# Open .env and add your Supabase credentials
.env file:

env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GNEWS_API_KEY=your_gnews_api_key  # Optional, for live news
5️⃣ Start Development Server
bash
# Start the Vite development server
npm run dev

# Your app will be available at:
# http://localhost:8080
6️⃣ Build for Production
bash
# Create production build
npm run build

# Preview production build locally
npm run preview
📦 Package.json Scripts
json
{
  "scripts": {
    "dev": "vite",              # Start dev server
    "build": "tsc && vite build", # Build for production
    "preview": "vite preview",  # Preview production build
    "lint": "eslint .",         # Run linter
    "format": "prettier --write ." # Format code
  }
}
🗄️ Database Setup
1️⃣ Create Tables
Run this SQL in your Supabase SQL Editor:

sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  preferred_time TIME DEFAULT '09:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RIDDLES TABLE
CREATE TABLE IF NOT EXISTS riddles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  difficulty TEXT DEFAULT 'Easy',
  explanation TEXT,
  text_en TEXT,
  text_ta TEXT,
  text_ta_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER ANSWERS TABLE
CREATE TABLE IF NOT EXISTS user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  riddle_id UUID REFERENCES riddles(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TECH NEWS TABLE
CREATE TABLE IF NOT EXISTS tech_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  source_url TEXT,
  source_name TEXT,
  category TEXT[],
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WEEKLY SCORES TABLE
CREATE TABLE IF NOT EXISTS user_weekly_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE,
  score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  UNIQUE(user_id, week_start)
);
2️⃣ Create Triggers
sql
-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
3️⃣ Set Up RLS Policies
sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Follows policies
CREATE POLICY "Users can view their own follows"
ON user_follows FOR SELECT
USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can follow others"
ON user_follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON user_follows FOR DELETE
USING (auth.uid() = follower_id);
4️⃣ Seed Sample Data
sql
-- Insert sample riddles
INSERT INTO riddles (question, answer, text_en, text_ta, text_ta_en, category) VALUES
('What has keys but can''t open locks?', 'piano', 'What has keys but can''t open locks?', 'சாவி இருந்தும் பூட்டை திறக்க முடியாதது எது?', 'Savi irundhum pootai thirakka mudiyadhadhu yedhu?', 'General'),
('The more you take, the more you leave behind. What am I?', 'footsteps', 'The more you take, the more you leave behind. What am I?', 'நீங்கள் எடுக்கும் அளவுக்கு, பின்னால் விடுகிறீர்கள். நான் என்ன?', 'Neengal edukkum alavukku, pinnaal vidukireergal. Naan enna?', 'General');

-- Insert sample tech news
INSERT INTO tech_news (title, description, image_url, source_name, category) VALUES
('OpenAI''s GPT-5: The Next Revolution in AI', 'OpenAI is developing GPT-5 with enhanced reasoning capabilities, expected to revolutionize how we interact with AI assistants.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995', 'AI Research', ARRAY['AI', 'Revolution']),
('Meta''s AI-Powered Social Media Future', 'Meta is integrating AI across Facebook, Instagram, and WhatsApp, creating personalized content feeds and AI chatbots for users.', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7', 'TechCrunch', ARRAY['Social Media', 'AI']);
🔧 Configuration
Tailwind CSS Configuration
javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
Vite Configuration
typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
});
📖 Usage Guide
👤 For Users
Sign Up / Login

Create account with email

Verify email (optional)

Complete profile setup

Daily Routine

Visit Dashboard

Check current streak

Solve today's riddle

Read tech news

Maintain streak

Social Features

Go to Discover page

Search for friends

Follow interesting users

Check Leaderboard

Track Progress

View profile stats

Check achievements

Monitor weekly rank

Compare with friends

🛠️ For Developers
Adding New Riddles:

sql
INSERT INTO riddles (question, answer, text_en, text_ta, text_ta_en, category, difficulty, explanation)
VALUES (
  'Your riddle question?',
  'answer',
  'English version',
  'Tamil version',
  'Tanglish version',
  'Tech/Sci-Fi',
  'Medium',
  'Explanation here...'
);
Adding Tech News:

sql
INSERT INTO tech_news (title, description, image_url, source_name, category)
VALUES (
  'News Title',
  'News Description',
  'https://image-url.com',
  'Source Name',
  ARRAY['AI', 'Social Media']
);
🎨 UI/UX Design
Color Palette
css
/* Gradient Primary */
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);

/* Status Colors */
success: #22c55e;
warning: #f97316;
danger:  #ef4444;
accent:  #a855f7;

/* Neutral Colors */
background: #ffffff;
card:      #ffffff;
border:    #e2e8f0;
text:      #0f172a;
muted:     #64748b;
Typography
css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
h1: 1.875rem (30px) - Bold
h2: 1.5rem   (24px) - Semibold
h3: 1.25rem  (20px) - Medium
body: 1rem    (16px) - Regular
small: 0.875rem (14px) - Regular
Components
All UI components are from shadcn/ui and fully customizable:

✅ Button - Multiple variants

✅ Card - Container with shadow

✅ Input - Form fields

✅ Avatar - User profiles

✅ Badge - Status indicators

✅ Toast - Notifications

✅ Tabs - Content organization

✅ Dialog - Modal windows

📊 Database Schema
Entity Relationship Diagram
text
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   auth.users│───────│  profiles   │───────│user_follows │
└─────────────┘       └─────────────┘       └─────────────┘
        │                    │                      │
        │                    │                      │
        ▼                    ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│user_answers │       │achievements │       │weekly_scores│
└─────────────┘       └─────────────┘       └─────────────┘
        │
        │
        ▼
┌─────────────┐
│  riddles    │
└─────────────┘
Key Relationships
profiles.id → auth.users.id (1:1)

user_answers.user_id → profiles.id (M:1)

user_answers.riddle_id → riddles.id (M:1)

user_follows.follower_id → profiles.id (M:1)

user_follows.following_id → profiles.id (M:1)

user_achievements.user_id → profiles.id (M:1)

user_weekly_scores.user_id → profiles.id (M:1)

🔒 Security
Row Level Security (RLS)
All tables are protected with RLS policies:

sql
-- Example: Users can only modify their own data
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
Environment Variables
Never commit sensitive data:

bash
# .gitignore
.env
.env.local
.env.production
API Protection
Supabase anon key has limited permissions

RLS prevents unauthorized access

CORS configured for your domain only

🚢 Deployment
Deploy to Vercel
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up environment variables
# - Choose production
# - Deploy!
Deploy to Netlify
bash
# Install Netlify CLI
npm i -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist
Environment Variables for Production
Set these in your hosting platform:

text
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
🤝 Contributing
We welcome contributions! Follow these steps:

Fork the repository

bash
git clone https://github.com/your-username/Brain-BreakBuddy.git
cd Brain-BreakBuddy
Create a feature branch

bash
git checkout -b feature/amazing-feature
Commit your changes

bash
git add .
git commit -m '✨ Add some amazing feature'
Push to branch

bash
git push origin feature/amazing-feature
Open a Pull Request

Contribution Guidelines
✅ Follow TypeScript best practices

✅ Use meaningful commit messages

✅ Add comments for complex logic

✅ Update documentation

✅ Test your changes thoroughly

📝 License
This project is MIT Licensed - see below for details:

text
MIT License

Copyright (c) 2026 Ashwin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
👨‍💻 Author
Ashwin

🌐 GitHub: @Ashw-in2006

📧 Email: rajashwin2006@gmail.com

💼 LinkedIn: Ashwin R

🙏 Acknowledgments
Supabase for the amazing backend platform

shadcn/ui for beautiful components

Unsplash for stock images

Lucide for open-source icons

All contributors and users of BrainBreak Buddy!

📊 Project Status
javascript
{
  "version": "1.0.0",
  "status": "Production Ready",
  "lastUpdate": "February 2026",
  "features": {
    "implemented": 32,
    "inProgress": 5,
    "planned": 12
  },
  "metrics": {
    "users": "12+",
    "riddles": "50+",
    "achievements": "7",
    "languages": "3"
  }
}
<div align="center">
⭐ Star this repository if you find it useful! ⭐

Report Bug ·
Request Feature ·
Read Documentation

Made with ❤️ by Ashwin

</div> ```
