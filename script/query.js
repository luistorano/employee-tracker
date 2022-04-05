const cTable = require("console.table");
const db = require('../db/connection')

function displayData(sql) {
    db.query(sql, (err, rows) => {
        console.table(rows);
    });
};

module.exports = displayData;