-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "site_name" VARCHAR(200) NOT NULL DEFAULT 'PulseFit',
    "site_tagline" VARCHAR(300) NOT NULL DEFAULT 'Transform Your Body, Transform Your Life',
    "primary_color" VARCHAR(20) NOT NULL DEFAULT '#dc2626',
    "secondary_color" VARCHAR(20) NOT NULL DEFAULT '#991b1b',
    "accent_color" VARCHAR(20) NOT NULL DEFAULT '#fbbf24',
    "hero_title" VARCHAR(300) NOT NULL DEFAULT 'Transform Your Body',
    "hero_subtitle" TEXT NOT NULL DEFAULT 'Join PulseFit today and start your fitness journey with expert trainers',
    "hero_button_text" VARCHAR(50) NOT NULL DEFAULT 'Get Started',
    "about_title" VARCHAR(300) NOT NULL DEFAULT 'Why Choose PulseFit?',
    "about_description" TEXT NOT NULL DEFAULT 'We offer world-class facilities, expert trainers, and a supportive community',
    "contact_email" VARCHAR(200) NOT NULL DEFAULT 'info@pulsefit.com',
    "contact_phone" VARCHAR(50) NOT NULL DEFAULT '+1 (555) 123-4567',
    "contact_address" TEXT NOT NULL DEFAULT '123 Fitness Street, Workout City, WC 12345',
    "map_latitude" VARCHAR(50) NOT NULL DEFAULT '40.7128',
    "map_longitude" VARCHAR(50) NOT NULL DEFAULT '-74.0060',
    "map_zoom" INTEGER NOT NULL DEFAULT 15,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "twitter_url" TEXT,
    "youtube_url" TEXT,
    "business_hours" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
