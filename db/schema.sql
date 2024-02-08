CREATE TABLE verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
    id SERIAL,
    "userId" INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE sessions (
    id SERIAL,
    "userId" INTEGER NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id SERIAL,
    name VARCHAR(255),
    email VARCHAR(255),
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE destinations (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location POINT NOT NULL,
    images TEXT [],
    PRIMARY KEY (id)
);

CREATE TABLE reviews (
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    image TEXT,
    PRIMARY KEY ("userId", "destinationId"),
    FOREIGN KEY ("userId") REFERENCES users(id),
    FOREIGN KEY ("destinationId") REFERENCES destinations(id)
);

CREATE TABLE keywords (
    id SERIAL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE destination_keywords (
    "destinationId" INTEGER NOT NULL,
    "keywordId" INTEGER NOT NULL,
    PRIMARY KEY ("destinationId", "keywordId"),
    FOREIGN KEY ("destinationId") REFERENCES destinations(id),
    FOREIGN KEY ("keywordId") REFERENCES keywords(id)
);

CREATE INDEX idx_reviews_userId ON reviews ("userId");