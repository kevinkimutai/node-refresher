import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    resetToken: { type: String },
    resetTokenExpires: {},
  },
  { timestamps: true }
);

//Hash Instance Method
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

//Generate and save Reset tokens
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetToken = crypto
    .createHash("SHA256")
    .update(resetToken)
    .digest("hex");

  console.log({ HASHED: this.resetToken }, resetToken);

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
