const mongoose = require('mongoose');

export const connect = () => {
  mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/coroname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
