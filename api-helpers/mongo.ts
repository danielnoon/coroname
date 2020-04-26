import * as mongoose from 'mongoose';

export const connect = () => {
  console.log(mongoose);
  mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/coroname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
