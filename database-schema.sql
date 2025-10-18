-- =============================================
--  ███     Grind Clock Database Schema
--  ███     Run these commands in your Supabase SQL editor
--  ███
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    study_preferences JSONB DEFAULT '{
        "defaultSessionDuration": 25,
        "reminderEnabled": true,
        "reminderTime": "09:00",
        "darkMode": false,
        "focusMode": false
    }',
    academic_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#f59e0b',
    difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    target_hours_per_week DECIMAL(4,2) DEFAULT 0,
    target_hours_per_day DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Sessions Table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 5),
    notes TEXT DEFAULT '',
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Goals Table
CREATE TABLE IF NOT EXISTS study_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    subject_ids UUID[] DEFAULT '{}',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    target_date TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_exam BOOLEAN DEFAULT false,
    exam_date TIMESTAMP WITH TIME ZONE,
    exam_time TEXT,
    exam_location TEXT,
    study_hours_target DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule Slots Table (for future use)
CREATE TABLE IF NOT EXISTS schedule_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_slots ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Subjects Policies
CREATE POLICY "Users can view own subjects" ON subjects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subjects" ON subjects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subjects" ON subjects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subjects" ON subjects
    FOR DELETE USING (auth.uid() = user_id);

-- Study Sessions Policies
CREATE POLICY "Users can view own sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON study_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON study_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Study Goals Policies
CREATE POLICY "Users can view own goals" ON study_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON study_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON study_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON study_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Schedule Slots Policies
CREATE POLICY "Users can view own schedule" ON schedule_slots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule" ON schedule_slots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule" ON schedule_slots
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule" ON schedule_slots
    FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject_id ON study_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON study_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_study_goals_user_id ON study_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_user_id ON schedule_slots(user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_goals_updated_at BEFORE UPDATE ON study_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();