-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    summary TEXT,
    experience TEXT,
    skills TEXT[],
    education TEXT,
    linkedin_url TEXT,
    embedding vector(768),  -- Dimension based on the model used
    elo_rating INTEGER DEFAULT 1500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    query_text TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    query_id UUID REFERENCES queries(id),
    winner_profile_id UUID REFERENCES profiles(id),
    loser_profile_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indices for vector search
CREATE INDEX IF NOT EXISTS profiles_embedding_idx ON profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
