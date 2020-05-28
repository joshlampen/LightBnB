const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  /// Users
  
  /**
   * Get a single user from the database given their email.
   * @param {String} email The email of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithEmail: function(email) {
    const values = [email];
    
    return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1;
    `, values)
      .then(res => res.rows[0] ? res.rows[0] : null);
  },

  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithId: function(id) {
    const values = [id];
  
    return pool.query(`
    SELECT *
    FROM users
    WHERE id = $1;
    `, values)
      .then(res => res.rows[0] ? res.rows[0] : null);
  },

  /**
   * Add a new user to the database.
   * @param {{name: string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  addUser: function(user) {
    const values = [user.name, user.email, user.password];
  
    return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, values)
      .then(res => res.rows[0] ? res.rows[0] : null);
  },
  
  /// Reservations
  
  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  getAllReservations: function(guest_id, limit = 10) {
    const values = [guest_id, limit];
  
    return pool.query(`
    SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN reservations ON reservations.property_id = properties.id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
    `, values)
      .then(res => res.rows ? res.rows : null);
  },

  /// Properties
  
  /**
   * Get all properties.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the properties.
   */
  
  
  getAllProperties: function(options, limit = 10) {
    const queryParams = [];
  
    let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON property_reviews.property_id = properties.id
    `;
  
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE properties.city LIKE $${queryParams.length}`;
    }
  
    if (options.owner_id) {
      queryParams.push(Number(options.owner_id));
      let firstWord;
      options.city ? firstWord = ' AND' : firstWord = 'WHERE';
      queryString += `${firstWord} properties.owner_id = $${queryParams.length}`;
    }
  
    if (options.minimum_price_per_night) {
      queryParams.push(Number(options.minimum_price_per_night));
      let firstWord;
      options.city || options.owner_id ? firstWord = ' AND' : firstWord = 'WHERE';
      queryString += `${firstWord} properties.cost_per_night >= $${queryParams.length}`;
    }
  
    if (options.maximum_price_per_night) {
      queryParams.push(Number(options.maximum_price_per_night));
      let firstWord;
      options.city || options.owner_id || options.minimum_price_per_night ? firstWord = ' AND' : firstWord = 'WHERE';
      queryString += `${firstWord} properties.cost_per_night <= $${queryParams.length}`;
    }
  
    queryString += `
    GROUP BY properties.id
    `;
  
    if (options.minimum_rating) {
      queryParams.push(Number(options.minimum_rating));
      queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
    }
  
    queryParams.push(limit);
    queryString += `
    ORDER BY properties.cost_per_night
    LIMIT $${queryParams.length};
    `;
  
    return pool.query(queryString, queryParams)
      .then(res => res.rows);
  },

  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  addProperty: function(property) {
    const values = [];
    for (const key in property) {
      values.push(property[key]);
    }
  
    return pool.query(`
    INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `, values)
      .then(res => res.rows[0] ? res.rows[0] : null);
  },

  /**
  * @param {{}} reservation
  * @return {Promise<{}>}
  */

  addReservation: function(reservation) {

    console.log(reservation);

    const values = [];
    for (const key in reservation) {
      values.push(reservation[key]);
    }

    console.log(values);

    return pool.query(`
    INSERT INTO reservations (property_id, start_date, end_date, guest_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, values)
      .then(res => res.rows)
      .catch(e => e);
  }
};





