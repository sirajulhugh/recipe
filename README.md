# 🍳 Recipe Finder App

Live link: https://recipe-hxuw.vercel.app/

A responsive, user-friendly web application that allows users to search for recipes using ingredients or dish names, save their favorite recipes, and manage their profile. It fetches real-time recipe data from TheMealDB API and uses Supabase for user authentication and persistent storage of favorite recipes.

## ✨ Features

*   **Recipe Search**: Search for thousands of recipes by name or ingredient using TheMealDB API.
*   **Interactive Landing Page**: Engaging home page with featured recipes, trending dishes, and popular categories to encourage exploration.
*   **User Authentication**:
    *   Secure sign-up and sign-in functionality.
    *   Email confirmation for new user registration.
    *   User session management.
*   **Favorite Recipes**:
    *   Ability to mark recipes as favorites with a single click.
    *   Persistent storage of favorite recipes in a Supabase database.
    *   View and manage all favorited recipes on a dedicated profile page.
*   **User Profile**:
    *   Personalized profile page for each user.
    *   Displays user information and their collection of favorite recipes.
*   **Responsive Design**: Optimized for seamless experience across various devices (desktop, tablet, mobile).
*   **Toast Notifications**: Provides user feedback for actions like sign-in, sign-up, and adding/removing favorites.

## 🛠️ Technologies Used

*   **Next.js**: React framework for building performant web applications (App Router).
*   **React**: Frontend library for building user interfaces.
*   **Tailwind CSS**: Utility-first CSS framework for rapid styling.
*   **shadcn/ui**: Reusable UI components built with Tailwind CSS and Radix UI.
*   **Supabase**: Open-source Firebase alternative for:
    *   Authentication (Email/Password).
    *   PostgreSQL Database for storing user profiles and favorite recipes.
    *   Row Level Security (RLS) for secure data access.
*   **TheMealDB API**: External API for fetching recipe data.
*   **Lucide React**: Beautiful and customizable open-source icons.

## 🚀 Getting Started

Follow these steps to get your Recipe Finder app up and running locally.

### Prerequisites

*   Node.js (v18.x or higher)
*   npm or Yarn
*   A Supabase project (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/sirajulhugh/recipe.git
cd recipe-finder
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Supabase

1.  **Create a Supabase Project**: If you don't have one, go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get API Keys**:
    *   Navigate to `Project Settings` > `API` in your Supabase dashboard.
    *   Copy your `Project URL` and `anon public` key.
3.  **Set up Environment Variables**:
    *   Create a `.env.local` file in the root of your project.
    *   Add the following environment variables, replacing the placeholders with your actual Supabase keys:

    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

### 4. Database Setup

Run the following SQL script in your Supabase SQL Editor to set up the necessary tables and Row Level Security (RLS) policies for user profiles and favorites.

```sql
-- Simple and reliable authentication setup
-- This script creates a minimal working auth system

-- Drop existing tables and functions to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with simpler structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_image TEXT,
  recipe_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies for profiles
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Simple RLS policies for favorites
CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON favorites TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ☁️ Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js.

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Import to Vercel**: Go to [Vercel Dashboard](https://vercel.com/dashboard), click "Add New..." > "Project", and import your Git repository.
3.  **Configure Environment Variables**: During the Vercel setup, add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables. Make sure they are configured for the "Production" environment.
4.  **Deploy**: Vercel will automatically build and deploy your application.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
```

This README provides a clear and concise overview of your project, making it easy for others (or your future self!) to understand, set up, and contribute to the Recipe Finder app.

