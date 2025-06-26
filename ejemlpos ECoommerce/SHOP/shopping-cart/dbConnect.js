import { connect } from "mongoose";

const dbConnect = async() => {
  connect(process.env.MONGO_CART_URI)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default dbConnect;
