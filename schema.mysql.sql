-- FoodBuddy schema (MySQL 8)
-- One database, several tables. Foreign keys (the *_id columns) connect them.

-- PLACEHOLDER: Alexys's login code owns the real users table. Keep the id column
-- (user_allergens points at it) and swap in her version when she pushes.
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  display_name  VARCHAR(100),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- The allergens a user can choose from (corn, peanut, milk, ...)
CREATE TABLE IF NOT EXISTS allergens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Every name an allergen can hide behind on a label.
--   definite = always comes from this allergen          (maltodextrin -> corn)
--   possible = often comes from it, label doesn't say   (citric acid -> often corn)
--   exclude  = looks like a match but isn't             (cocoa butter is not dairy)
CREATE TABLE IF NOT EXISTS derivatives (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  allergen_id INT NOT NULL,
  term        VARCHAR(100) NOT NULL,
  match_type  ENUM('definite','possible','exclude') NOT NULL,
  note        VARCHAR(255),
  UNIQUE KEY uq_allergen_term (allergen_id, term),
  FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vague label terms that could hide anything ("natural flavors", "spices")
CREATE TABLE IF NOT EXISTS unclear_terms (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  term VARCHAR(100) NOT NULL UNIQUE,
  note VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Junction table: which allergens each user has, and how severe (many-to-many)
CREATE TABLE IF NOT EXISTS user_allergens (
  user_id     INT NOT NULL,
  allergen_id INT NOT NULL,
  severity    ENUM('severe','moderate','preference') NOT NULL,
  PRIMARY KEY (user_id, allergen_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products store the ingredient label exactly as printed; the engine parses it.
CREATE TABLE IF NOT EXISTS products (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  name               VARCHAR(200) NOT NULL,
  brand              VARCHAR(100),
  category           VARCHAR(50),
  ingredients_text   TEXT,
  allergen_statement VARCHAR(500),
  INDEX idx_products_name (name),
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
