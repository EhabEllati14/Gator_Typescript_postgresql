# Gator 🐊  
Terminal-Based RSS Feed Aggregator  
Built by Ehab Ellati

---

## Overview

Gator is a terminal-based RSS feed aggregation system built with Node.js, TypeScript, PostgreSQL, and Drizzle ORM.

The application allows users to:

- Register and login
- Add RSS feeds
- Follow and unfollow feeds
- Automatically scrape and store posts
- Browse the latest posts from followed feeds
- Persist all data using a relational database

This project demonstrates backend architecture, database design, middleware patterns, and CLI tooling.

---

## Tech Stack

- Node.js (v20+)
- TypeScript
- PostgreSQL
- Drizzle ORM
- Fast XML Parser

---

## Requirements

Before running gator, make sure you have:

- Node.js v20 or higher
- npm
- PostgreSQL running locally

---

## Installation

Clone the repository:

git clone https://github.com/EhabEllati14/Gator_Typescript_postgresql.git  
cd Gator_Typescript_postgresql  

Install dependencies:

npm install

---

## Database Setup

Make sure PostgreSQL is running.

Create a database:

CREATE DATABASE gator;

Push the schema:

npx drizzle-kit push:pg

---

## Running the CLI

All commands are executed using:

npm run start <command>

---

## Available Commands

Reset database:

npm run start reset

Register a user:

npm run start register <username>

Login:

npm run start login <username>

Add a feed:

npm run start addfeed "Feed Name" "https://feed-url.com/rss"

Follow a feed:

npm run start follow "https://feed-url.com/rss"

Unfollow a feed:

npm run start unfollow "https://feed-url.com/rss"

Show followed feeds:

npm run start following

Browse posts (default 2):

npm run start browse

Browse with custom limit:

npm run start browse 5

---

## How It Works

- Feeds are stored in PostgreSQL.
- Users can follow multiple feeds (many-to-many relationship).
- RSS feeds are fetched and parsed.
- Posts are saved in the database.
- Duplicate posts are prevented using a unique URL constraint.
- Posts are ordered by newest first when browsing.

---

## Author

Ehab Ellati  
Computer Science Graduate  
GitHub: https://github.com/EhabEllati14

---

## License

This project was built for educational purposes as part of the Boot.dev backend course.
