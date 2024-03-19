// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose.pluralize(null);

let isConnected;

// configure mongoose
export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }
  console.log("=> using new database connection");
  return mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};
