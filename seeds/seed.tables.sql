BEGIN;

TRUNCATE
  "word",
  "language",
  "user"
RESTART IDENTITY CASCADE;

--password = pass
INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'French', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'bonjour', 'hello', 2),
  (2, 1, 'parler', 'to speak', 3),
  (3, 1, 'aider', 'to help', 4),
  (4, 1, 'programmation', 'to program', 5),
  (5, 1, 'aller', 'to go', 6),
  (6, 1, 'ecoute', 'to listen', 7),
  (7, 1, 'fumer', 'to smoke', 8),
  (8, 1, 'manger', 'to eat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
