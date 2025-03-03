-- Function for profile matching based on vector similarity
CREATE OR REPLACE FUNCTION match_profiles(
    query_embedding vector,
    match_threshold float,
    match_count int
) RETURNS TABLE (
    id uuid,
    user_id uuid,
    name text,
    summary text,
    experience text,
    skills text[],
    education text,
    linkedin_url text,
    elo_rating int,
    similarity float
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.user_id,
        p.name,
        p.summary,
        p.experience,
        p.skills,
        p.education,
        p.linkedin_url,
        p.elo_rating,
        1 - (p.embedding <=> query_embedding) as similarity
    FROM profiles p
    WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC, p.elo_rating DESC
    LIMIT match_count;
END;
$$;
