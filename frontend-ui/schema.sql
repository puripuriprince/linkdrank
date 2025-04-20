-- Custom composite type for dates
CREATE TYPE custom_date AS (
    day SMALLINT,
    month SMALLINT,
    year INTEGER NOT NULL
    );

-- Lookup tables
CREATE TABLE location
(
    id      SERIAL PRIMARY KEY,
    city    VARCHAR(100) NOT NULL,
    state   VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    UNIQUE (city, state, country)
);

CREATE TABLE industry
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE school
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) UNIQUE NOT NULL,
    logo_url     VARCHAR(500),
    linkedin_url VARCHAR(500)
);

CREATE TABLE organization
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(255) UNIQUE NOT NULL,
    logo_url     VARCHAR(500),
    linkedin_url VARCHAR(500)
);

-- Core profile
CREATE TABLE profiles
(
    id                   SERIAL PRIMARY KEY,
    linkedin_id          VARCHAR(100) UNIQUE NOT NULL,
    first_name           VARCHAR(100)        NOT NULL,
    last_name            VARCHAR(100)        NOT NULL,
    headline             VARCHAR(255),
    summary              TEXT,
    profile_picture_url  VARCHAR(500),
    background_image_url VARCHAR(500),
    location_id          INTEGER             REFERENCES location (id) ON DELETE SET NULL,
    industry_id          INTEGER             REFERENCES industry (id) ON DELETE SET NULL,
    connections_count    INTEGER DEFAULT 0,
    followers_count      INTEGER DEFAULT 0
);

-- Education history
CREATE TABLE education
(
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    school_id      INTEGER NOT NULL REFERENCES school (id) ON DELETE RESTRICT,
    degree_name    VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date     custom_date,
    end_date       custom_date,
    description    TEXT
);

-- Professional experience
CREATE TABLE experience
(
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    organization_id INTEGER NOT NULL REFERENCES organization (id) ON DELETE RESTRICT,
    title           VARCHAR(255),
    description     TEXT,
    start_date      custom_date,
    end_date        custom_date,
    location_id     INTEGER REFERENCES location (id) ON DELETE SET NULL
);

-- Certifications
CREATE TABLE certification
(
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER      NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    name           VARCHAR(255) NOT NULL,
    authority      VARCHAR(100),
    display_source VARCHAR(100),
    license_number VARCHAR(100),
    url            VARCHAR(500),
    start_date     custom_date,
    end_date       custom_date
);

-- Skills
CREATE TABLE skill
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_skill
(
    user_id  INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skill (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

-- Languages
CREATE TYPE proficiency_level AS ENUM (
    'NATIVE_OR_BILINGUAL',
    'FULL_PROFESSIONAL',
    'PROFESSIONAL_WORKING',
    'LIMITED_WORKING',
    'ELEMENTARY'
);

CREATE TABLE language
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_language
(
    user_id     INTEGER           NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    language_id INTEGER           NOT NULL REFERENCES language (id) ON DELETE CASCADE,
    proficiency proficiency_level NOT NULL,
    PRIMARY KEY (user_id, language_id)
);

-- Volunteer work
CREATE TABLE volunteer
(
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    organization_id INTEGER NOT NULL REFERENCES organization (id) ON DELETE RESTRICT,
    role            VARCHAR(255),
    cause           VARCHAR(100),
    description     TEXT,
    start_date      custom_date,
    end_date        custom_date
);

-- Publications
CREATE TABLE publication
(
    id        SERIAL PRIMARY KEY,
    user_id   INTEGER      NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    name      VARCHAR(255) NOT NULL,
    pub_date  custom_date,
    publisher VARCHAR(255),
    url       VARCHAR(500)
);

-- Awards
CREATE TABLE award
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    award_date  custom_date,
    issuer      VARCHAR(255)
);

-- Projects
CREATE TABLE project
(
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    start_date  custom_date,
    end_date    custom_date
);
