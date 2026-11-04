CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS vacations (
  vacation_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  destination VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_file_name VARCHAR(255) NOT NULL,
  CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  vacation_id INTEGER NOT NULL REFERENCES vacations(vacation_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, vacation_id)
);

INSERT INTO vacations (destination, description, start_date, end_date, price, image_file_name)
SELECT * FROM (VALUES
  ('Paris, France', 'Stroll along the Seine, visit the Louvre and the Eiffel Tower, and enjoy the cafes of Montmartre.', DATE '2027-04-12', DATE '2027-04-18', 1450.00, 'paris.jpg'),
  ('Rome, Italy', 'Explore the Colosseum, the Roman Forum and the Vatican Museums, then end the day with pasta in Trastevere.', DATE '2027-05-03', DATE '2027-05-09', 1280.00, 'rome.jpg'),
  ('Barcelona, Spain', 'Discover Gaudi''s Sagrada Familia and Park Guell, walk La Rambla and relax on Barceloneta Beach.', DATE '2027-05-20', DATE '2027-05-26', 1190.00, 'barcelona.jpg'),
  ('Santorini, Greece', 'Watch the sunset over the caldera from Oia, swim at the volcanic beaches and taste local wines.', DATE '2027-06-08', DATE '2027-06-14', 1720.00, 'santorini.jpg'),
  ('Reykjavik, Iceland', 'Tour the Golden Circle, see waterfalls and geysers, and soak in the geothermal Blue Lagoon.', DATE '2027-06-22', DATE '2027-06-29', 2640.00, 'reykjavik.jpg'),
  ('New York, USA', 'See Times Square, Central Park and the Statue of Liberty, and catch a Broadway show.', DATE '2027-07-05', DATE '2027-07-13', 2890.00, 'new-york.jpg'),
  ('Bali, Indonesia', 'Visit the rice terraces and temples of Ubud, surf in Canggu and unwind at a tropical beach villa.', DATE '2027-08-02', DATE '2027-08-12', 2150.00, 'bali.jpg'),
  ('Tokyo, Japan', 'Experience Shibuya Crossing and the Senso-ji Temple, sample authentic sushi and take a day trip to Mount Fuji.', DATE '2027-09-14', DATE '2027-09-24', 3350.00, 'tokyo.jpg'),
  ('Marrakech, Morocco', 'Wander the souks of the Medina, visit the Majorelle Garden and ride camels at the edge of the Agafay Desert.', DATE '2027-10-04', DATE '2027-10-10', 980.00, 'marrakech.jpg'),
  ('Cape Town, South Africa', 'Ride the cable car up Table Mountain, meet the penguins of Boulders Beach and tour the Cape Winelands.', DATE '2027-11-08', DATE '2027-11-17', 2780.00, 'cape-town.jpg'),
  ('Bangkok, Thailand', 'Admire the Grand Palace and Wat Arun, cruise the Chao Phraya River and explore the street food markets.', DATE '2028-01-10', DATE '2028-01-19', 1650.00, 'bangkok.jpg'),
  ('Dubai, UAE', 'Go up the Burj Khalifa, take a desert safari and shop at the Dubai Mall and the traditional gold souk.', DATE '2028-02-14', DATE '2028-02-20', 1890.00, 'dubai.jpg')
) AS seed_data
WHERE NOT EXISTS (SELECT 1 FROM vacations);
