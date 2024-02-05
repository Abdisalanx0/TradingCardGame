-- This file is for populating the database with seed (test) data

INSERT INTO tcg_user (username, password_hash) VALUES (
  'admin',
  "$2y$10$bDKXK7pxePpSKPzPU4doIOY2SMsXyLwjZBQrUnQXEy3by4dsVrB7m"
);
--password = 1234

-- replace null with a password hash when you know what tech you'll be using to hash passwords
-- also make a note at the top of this file like, "923#@$IYGUbkjhdjkdo&*& is the hash for 'fakepassword'" so we can reference it during development