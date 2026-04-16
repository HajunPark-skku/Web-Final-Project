const mongoose = require("mongoose");

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  const user = "root";
  const pass = encodeURIComponent("7942");
  const uri = `mongodb://${user}:${pass}@127.0.0.1:27017/nodejs?authSource=admin`;

  mongoose.connect(uri)
    .then(() => {
      console.log("MongoDB Connection Success");
    })
    .catch((err) => {
      console.error("MongoDB Connection Error", err);
    });
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB Connection Error", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB Disconnected. Trying to reconnect...");
  connect();
});

module.exports = connect;
