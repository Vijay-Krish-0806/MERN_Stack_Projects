const mongoose = require('mongoose');

const connectToMongo = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));
};

module.exports = connectToMongo;
