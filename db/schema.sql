CREATE TABLE verification_token(
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
    id SERIAL,
    "userID" INTEGER NOT NULL,
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
    Role VARCHAR(255) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE destinations (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location POINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reviews (
    "userId" INTEGER NOT NULL,
    "destId" INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    PRIMARY KEY ("userId", "destId"),
    FOREIGN KEY ("userId") REFERENCES users(id),
    FOREIGN KEY ("destId") REFERENCES destinations(id)
);

CREATE TABLE keywords (
    id SERIAL,
    name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE destination_keys (
    "destId" INT NOT NULL,
    "keyId" INT NOT NULL,
    PRIMARY KEY ("destId", "keyId"),
    FOREIGN KEY ("destId") REFERENCES destinations(id),
    FOREIGN KEY ("keyId") REFERENCES keywords(id)
);

CREATE TABLE user_favorites (
    "userId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    PRIMARY KEY ("userId", "destId"),
    FOREIGN KEY ("userId") REFRENCES users(id),
    FOREIGN KEY ("destId") REFRENCES destinations(id)
);

CREATE TABLE destination_images (
    id SERIAL,
    "destId" INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("destId") REFRENCES destinations(id)
);

CREATE TABLE review_images (
    id SERIAL,
    "reviewId" INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("reviewId") REFRENCES reviews(id)
);