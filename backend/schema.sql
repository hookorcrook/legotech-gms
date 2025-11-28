-- Gym Management Database Schema

-- Create database (run this separately if needed)
-- CREATE DATABASE gym_management;

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainers table
CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    specialty VARCHAR(200) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    author VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact forms table
CREATE TABLE IF NOT EXISTS contact_forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats table (single row for gym statistics)
CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    members INTEGER NOT NULL DEFAULT 0,
    coaches INTEGER NOT NULL DEFAULT 0,
    classes_per_week INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

-- Programs
INSERT INTO programs (category, title, description, features) VALUES
('Strength', 'Barbell & Kettlebell', 'Progressive overload cycles to build power and muscle safely.', '["Technique workshops", "1:1 coaching available", "Strength testing"]'),
('Conditioning', 'HIIT & Row', 'Short, intense intervals to spike metabolism and endurance.', '["Assault bikes", "Row Erg + SkiErg", "Heart-rate zones"]'),
('Mobility', 'Stretch & Yoga', 'Reduce pain, improve range of motion, and recover faster.', '["Daily classes", "Recovery lab", "Breathwork"]')
ON CONFLICT DO NOTHING;

-- Trainers
INSERT INTO trainers (name, specialty, image_url) VALUES
('Alex Rivera', 'Strength • Powerlifting', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop'),
('Mia Chen', 'Conditioning • CrossFit', 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1200&auto=format&fit=crop'),
('Sam Patel', 'Mobility • Yoga', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop'),
('Jess Morgan', 'Nutrition • Wellness', 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop')
ON CONFLICT DO NOTHING;

-- Memberships
INSERT INTO memberships (name, price, features, is_popular) VALUES
('Basic', 29.00, '["Gym access (06:00–22:00)", "2 classes/week", "Locker + showers"]', FALSE),
('Pro', 59.00, '["24/7 access", "Unlimited classes", "1x PT session/month", "Free analyzer scan"]', TRUE),
('Elite', 129.00, '["24/7 access", "Unlimited PT sessions", "Recovery suite", "Guest passes x4"]', FALSE)
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (rating, content, author) VALUES
(5, 'I''ve lost 18 lbs and feel stronger than ever. Coaches are super knowledgeable.', 'Jamie R.'),
(5, 'Great community and flexible hours. The 24/7 access is a game changer.', 'Chris P.'),
(5, 'PT sessions fixed my shoulder pain. I''m moving better than in years.', 'Priya S.')
ON CONFLICT DO NOTHING;

-- Stats
INSERT INTO stats (members, coaches, classes_per_week) VALUES
(1200, 35, 50)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_trainers_specialty ON trainers(specialty);
CREATE INDEX IF NOT EXISTS idx_memberships_popular ON memberships(is_popular);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created ON contact_forms(created_at DESC);
