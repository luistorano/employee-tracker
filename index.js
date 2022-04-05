const db = require('./db/connection');
const allQuestions = require('./script/questions.js')


  // Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
     allQuestions();
  });