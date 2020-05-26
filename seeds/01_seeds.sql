INSERT INTO users (name, email, password)
VALUES ('Josh Lampen', 'joshlampen@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('John Doe', 'johndoe@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Jane Smith', 'janesmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Downtown Loft', 'description', 'imgur.com/asoids', 'imgur.com/aisud', 50, 1, 2, 'Canada', 'Oak St.', 'Vancouver', 'BC', 'V8R 4G2'),
       (2, 'Country Cottage', 'description', 'imgur.com/apsd', 'imgur.com/asdo', 40, 2, 3, 'Canada', '158 Ave.', 'Muskoka', 'ON', 'M5T 2B1'),
       (3, 'Frat House', 'description', 'imgur.com/aposd', 'imgur.com/asbjd', 30, 1, 5, 'Canada', 'Frontenac St.', 'Kingston', 'ON', 'K7L 3Y9');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 1),
       ('2019-01-04', '2019-02-01', 1, 3),
       ('2021-10-01', '2021-10-14', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 5, 'message'),
       (3, 1, 2, 4, 'message'),
       (2, 3, 3, 1, 'message');