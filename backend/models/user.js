// import mongoose from 'mongoose'; // Use ES module import
// const { Schema } = mongoose;

// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   // city: {
//   //   type: String,
//   //   required: true,
//   // },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// const User = mongoose.model('User', UserSchema);

// // Use export default to export the model
// export default User;


import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
