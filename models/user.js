import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Missing full name field in user schema"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Missing email field in user schema"],
    },
    password: {
      type: String,
      required: [true, "Missing password field in user schema"],
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: [true, "Missing full name field in user schema"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    //only run hash fn when modifying/creating new password
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

//compare passwords for login
userSchema.methods.comparePasswords = function (userPass, dbPass) {
  return bcrypt.compareSync(userPass, dbPass);
};

const User = mongoose.model("User", userSchema);

export default User;
