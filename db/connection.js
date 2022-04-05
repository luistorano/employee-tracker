const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection({
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'Lockheart.15.',
        database: 'heart_of_the_cards'
    },
    console.log('Connected to the heart_of_the_cards database.')
);

module.exports = db;