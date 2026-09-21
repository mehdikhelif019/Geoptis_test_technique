CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  cuisine_type VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, phone_number) VALUES
('Le Comptoir du Relais', '9 Carrefour de l''Odéon, 75006 Paris, France', 48.8529, 2.3387, 'Française', '+33 1 44 27 07 97'),
('L''As du Fallafel', '34 Rue des Rosiers, 75004 Paris, France', 48.8571, 2.3599, 'Méditerranéenne', '+33 1 48 87 63 60'),
('Breizh Café', '109 Rue Vieille du Temple, 75003 Paris, France', 48.8606, 2.3639, 'Française', '+33 1 42 72 13 77'),
('Pink Mamma', '20 Rue de Douai, 75009 Paris, France', 48.8825, 2.3286, 'Italienne', '+33 1 42 21 20 00'),
('Yam''Tcha', '121 Rue Saint-Honoré, 75001 Paris, France', 48.8606, 2.3376, 'Asiatique', '+33 1 40 26 08 07');