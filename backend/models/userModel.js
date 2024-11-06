// models/userModel.js

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const ErrorHandler = require('../utils/errorhandler'); // Ensure the path is correct
const crypto = require("crypto");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// Validation messages
const validationMessages = {
  required: (field) => `Please enter your ${field}`,
  maxLength: (field, limit) => `${field} cannot exceed ${limit} characters`,
  minLength: (field, limit) => `${field} should have more than ${limit} characters`,
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, validationMessages.required('name')],
      maxLength: [30, validationMessages.maxLength('Name', 30)],
      minLength: [4, validationMessages.minLength('Name', 4)],
      trim: true,
    },
    email: {
      type: String,
      required: [true, validationMessages.required('email')],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      lowercase: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerificationAttempts: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      required: false,
      validate: {
        validator: (v) => !v || validator.isMobilePhone(v, 'any'), // Validate if phone is provided
        message: "Please enter a valid phone number."
      },
      trim: true,
      set: (v) => (v ? v.replace(/\s+/g, "") : v), // Remove spaces in phone numbers
    },
    password: {
      type: String,
      required: [true, validationMessages.required('password')],
      minLength: [8, validationMessages.minLength('Password', 8)],
      select: false, // Do not select the password by default
    },
    dob: Date,
    country: String,
    mt5Id: {
      type: String,
      unique: true,
      sparse: true,
    },
    mt5password: {
      type: String,
      unique: true,
      sparse: true,
    },
    brokerName: String,
    plan: {
      type: String,
      enum: ['plana', 'planb', 'planc'], // Only allow specific plan values
    },
    capital: {
      type: Number,
      default: 0,
    },
    referralId: {
      type: String,
      unique: true, // Ensure each user has a unique referral ID
    },
    referralbyIdDirect: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [], // Ensure it defaults to an empty array
    }],
    referralbyIdStage2: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [], // Ensure it defaults to an empty array
    }],
    referralbyIdStage3: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [], // Ensure it defaults to an empty array
    }],
    fortnightlyProfit: {
      type: Number,
      default: 0,
    },
    incentiveDirect: {
      type: Number,
      default: 0,
    },
    incentiveStage2: {
      type: Number,
      default: 0,
    },
    incentiveStage3: {
      type: Number,
      default: 0,
    },
    companyProfitDue: {
      type: Number,
      default: 0,
    },
    companyProfitDueStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    referRequestStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    accountStatus: {
      type: String,
      enum: ["Pending", "Verified", "Trader"],
      default: "Pending",
    },
    payoutRecords: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false, // Lock account after failed attempts
    },
    verificationCode: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date, // Expiry for password reset token
  },
  { timestamps: true }
);

// Virtual field for full name if needed
userSchema.virtual("fullName").get(function () {
  return this.name; // Customize as needed
});

// Check if the account is locked after too many login attempts
userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.accountLocked = true; // Lock the account after 5 failed attempts
  }
  await this.save();
};
// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
  });
};
// Set referral relationships
userSchema.methods.setReferral = async function (referralId) {
  if (!referralId) return; // Exit if no referral ID is provided

  // Find the direct referrer using the provided referral ID
  const directReferrer = await this.constructor.findOne({ referralId });
  if (directReferrer) {
    // Link the new user as a direct referral
    this.referralbyIdDirect.push(directReferrer._id);

    // Ensure referralbyIdDirect is initialized before pushing
    directReferrer.referralbyIdDirect = directReferrer.referralbyIdDirect || [];
    directReferrer.referralbyIdDirect.push(this._id);
    await directReferrer.save();

    // Check if the direct referrer has a referrer
    if (directReferrer.referralbyIdDirect.length > 0) {
      const stage2Referrer = await this.constructor.findById(directReferrer.referralbyIdDirect[0]);
      if (stage2Referrer) {
        stage2Referrer.referralbyIdStage3 = stage2Referrer.referralbyIdStage3 || [];
        stage2Referrer.referralbyIdStage3.push(this._id);
        await stage2Referrer.save();
      }
    }
  }
  await this.save(); // Save changes for the new user
};

// Reset login attempts after successful login
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.accountLocked = false;
  await this.save();
};

// Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing password'); // Handle error appropriately
  }
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and add resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken; // Return the plain token to send to the user
};

// Check if the reset token is expired
userSchema.methods.isResetTokenExpired = function () {
  return this.resetPasswordExpires < Date.now();
};

// Update account status
userSchema.methods.updateAccountStatus = async function (status) {
  if (!["Pending", "Verified", "Trader"].includes(status)) {
    throw new Error('Invalid account status');
  }
  this.accountStatus = status;
  await this.save();
};

// Handle Validation Errors
userSchema.post('validate', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return next(new ErrorHandler(messages.join(', '), 400));
  }
  next();
});

// Export the user model
module.exports = mongoose.model("User", userSchema);
