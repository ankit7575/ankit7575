// Import necessary modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const fs = require('fs'); // Import fs for file system operations
const bcrypt = require("bcryptjs");
const crypto = require('crypto'); // Add this line to import the crypto module
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const path = require("path");
const { sendEmailNotification, sendAdminNotification } = require('../utils/receivedmail');  // Ensure path is correct
const { generatePdf } = require("./generatePdf");
const { sendEmail } = require("../utils/sendEmail");

// Helper function to validate input
const validateInput = (inputs) => {
    return inputs.every(input => typeof input === 'string' && input.trim() !== '');
};
const validateRequiredFields = (fields) => fields.every(field => field !== undefined && field !== null && field !== '');

// Helper function to log errors to a file
const logErrorToFile = (error) => {
    const logDir = path.join(__dirname, "../logs"); // Set the log directory
    const logFilePath = path.join(logDir, "error.log"); // Set the log file path

    // Check if the logs directory exists, create it if not
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true }); // Create the directory recursively
    }

    const errorMessage = `${new Date().toISOString()}: ${error}\n`;

    // Use a synchronous method to ensure logs are written immediately
    fs.appendFileSync(logFilePath, errorMessage);
};

// Generate JWT token
const generateToken = (user) => {
    if (!user || !user._id) {
        throw new Error("User object must be provided with an _id.");
    }

    return jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, // Ensure this is set in the environment
    });
};

// Function to send the JWT token in the response
const sendToken = (user, statusCode, res, message = 'Login successful') => {
    const token = generateToken(user); // Generate the token

    // Ensure JWT_EXPIRE is a valid number
    const expireTime = Number(process.env.JWT_EXPIRE) || 1; // Default to 1 day if not set
    const expires = new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000); // Calculate expiration date

    const options = {
        expires, // Use the calculated expiration date
        httpOnly: true, // Prevent client-side access to the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message, // Include the success message in the response
        token, // Send the generated token
    });
};

// Temporary storage for users (consider removing this for production)
const tempUserStore = {}; // Using an object for temporary user storage

// Function to validate required fields
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phoneNumber, password, referralId } = req.body;

    // Validate required fields
    if (!validateRequiredFields([name, email, password])) {
        return next(new ErrorHandler('Missing required fields: name, email, and password', 400));
    }

    // Normalize email and phone
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phoneNumber ? phoneNumber.trim() : null;

    // Validate email format
    if (!validator.isEmail(normalizedEmail)) {
        return next(new ErrorHandler('Please enter a valid email address.', 400));
    }

    // Check if user already exists by email or phone
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
        return next(new ErrorHandler('User already exists with this email', 400));
    }

    const existingUserByPhone = normalizedPhone ? await User.findOne({ phone: normalizedPhone }) : null;
    if (existingUserByPhone) {
        return next(new ErrorHandler('User already exists with this phone number', 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique user ID and referral ID
    const uniqueId = uuidv4();
    const generatedReferralId = uuidv4().slice(0, 8);

    // Create a new user object
    const newUser = new User({
        id: uniqueId,
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        referralId: generatedReferralId,
        role: "referral",
        emailVerified: false, // Email verification status
    });

    try {
        // Handle referral ID if provided
        if (referralId) {
            const referrer = await User.findOne({ referralId });
            if (!referrer) {
                return next(new ErrorHandler('Referral ID is not valid', 400));
            }
            referrer.referralbyIdDirect.push({ userId: newUser.id, incentive: 0 });
            await referrer.save();
        }

        // Generate and send PDF document
        const pdfFilePath = await generatePdf({
            name,
            email: normalizedEmail,
            phoneNumber: normalizedPhone,
        });

        await sendEmail({
            email: normalizedEmail,
            subject: 'Registration - PDF Document',
            message: `Thank you for registering, ${name}! Please find the attached PDF document.`,
            attachments: [{ filename: path.basename(pdfFilePath), path: pdfFilePath }],
        });

        // Generate OTP for email verification
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.verificationCode = otpCode;
        newUser.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Store the user temporarily (consider using a more robust temporary storage mechanism)
        tempUserStore[normalizedEmail] = newUser;

        // Send OTP via email
        await sendEmail({
            email: normalizedEmail,
            subject: 'Your OTP Code',
            message: `Your OTP code is: ${otpCode}`,
        });

        // Send admin email with user registration details
        await sendAdminNotification({
            name,
            email: normalizedEmail,
            phoneNumber: normalizedPhone,
            referralId: generatedReferralId
        });

        // Send response
        res.status(201).json({
            success: true,
            message: 'Registration initiated. Please check your email for the OTP and the PDF document.',
        });
    } catch (error) {
        logErrorToFile(error.message); // Log error to file
        return next(new ErrorHandler(`Error during registration: ${error.message}`, 500));
    }
});
  

// Improved OTP Verification
exports.verifyOtpAndCompleteRegistration = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  // Validate input
  if (!validateInput([email, otp])) {
    return next(new ErrorHandler('Please provide email and OTP.', 400));
  }

  // Retrieve the temporary user from the in-memory store
  const user = tempUserStore[email];
  if (!user) {
    return next(new ErrorHandler('User not found. Please register first.', 404));
  }

  // Check OTP and verify account
  if (user.verificationCode === otp) {
    user.emailVerified = true; // Mark email as verified

    // Now save the user to the database since the email is verified
    await User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      referralId: user.referralId,
      role: user.role,
      referralbyIdDirect: user.referralbyIdDirect,
      referralbyIdStage2: user.referralbyIdStage2,
      referralbyIdStage3: user.referralbyIdStage3,
      emailVerified: true, // Save with emailVerified true
    });

    // Clear the temporary user from the store
    delete tempUserStore[email];

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Registration complete!',
    });
  } else {
    return next(new ErrorHandler('Invalid OTP. Please try again.', 400));
  }
});   


// Login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
      return next(new ErrorHandler('Please enter email and password', 400));
  }

  // Find user by email and select password field
  const user = await User.findOne({ email }).select('+password'); // Ensure password is included

  // Check if user exists
  if (!user) {
      return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Check if the user's account is verified
  if (!user.emailVerified) {
      return next(new ErrorHandler('Please verify your email before logging in', 401));
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  // Check if password matches
  if (!isPasswordMatched) {
      await user.incrementLoginAttempts(); // Increment login attempts
      return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Generate token
  const token = user.getSignedJwtToken(); // Using the method to generate JWT

  // Send response
  res.status(200).json({
      success: true,
      message: 'Login successful!', // Success message
      token, // Return the token
      user: { // Optionally return user data without password
          id: user._id,
          email: user.email,
          role: user.role, // Include user role
          // Include any other necessary user fields here
      },
  });
});




// Logout user
exports.logoutUser = catchAsyncErrors(async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()), // Expire the token
        httpOnly: true, // Prevent client-side access to the cookie
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});
// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });

    // Check if user exists
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Generate reset token and save it
    const resetToken = user.getResetPasswordToken();
    await user.save({
        validateBeforeSave: false
    }); // Skip validation while saving

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n If you have not requested this email, please ignore it.`;

    try {
        // Send the email with the reset token
        await sendEmail({
            email: user.email,
            subject: 'Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        // Cleanup on failure
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({
            validateBeforeSave: false
        }); // Skip validation while saving

        return next(new ErrorHandler('Error sending email: ' + error.message, 500));
    }
});

// Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const {
        token
    } = req.params;

    // Validate reset token
    if (!token) {
        return next(new ErrorHandler('Reset token is required', 400));
    }

    // Hash the token to compare with the stored hash
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by reset token and check if it's still valid
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
            $gt: Date.now()
        }, // Ensure the token has not expired
    });

    // Check if user exists
    if (!user) {
        return next(new ErrorHandler('Reset Password Token is invalid or has expired', 400));
    }

    // Validate password confirmation
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    // Update user password and clear reset token fields
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save(); // Save the updated user

    // Send JWT token to the user
    sendToken(user, 200, res, 'Password change successful'); // Include success message in the response
});

// Update user password
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const {
        currentPassword,
        newPassword
    } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
        return next(new ErrorHandler('Please provide current and new passwords', 400));
    }

    // Check if user is authenticated
    if (!req.user) {
        return next(new ErrorHandler('User not authenticated', 401));
    }

    // Fetch the user from the database
    const user = await User.findById(req.user._id).select('+password'); // Use _id if it's the actual field name
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if the current password matches
    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Current password is incorrect', 401));
    }

    // Hash and update the new password
    try {
        // Validate new password strength (optional)
        if (newPassword.length < 6) {
            return next(new ErrorHandler('New password must be at least 6 characters long', 400));
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        logErrorToFile(error.message); // Log error to file
        return next(new ErrorHandler('Error updating password. Please try again later.', 500));
    }
});

// Update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        email,
        phoneNumber
    } = req.body;

    // Fetch the user from the database
    const user = await User.findById(req.user._id); // Use _id instead of id

    // If the user is not found, return an error
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if the new email is already in use by another user
    if (email && email.toLowerCase().trim() !== user.email) {
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });
        if (existingUser) {
            return next(new ErrorHandler('Email is already in use by another account.', 400));
        }
        user.email = email.toLowerCase().trim(); // Update email only if it's unique
    }

    // Update user fields with new values or retain existing ones
    user.name = name || user.name;
    user.phone = phoneNumber || user.phone;

    // Save the updated user profile
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
        }, // Optionally exclude sensitive fields like password
    });
});

// Get user details for the authenticated user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user?._id; // Safely get the user ID

    console.log("Attempting to retrieve user details for user ID:", userId);

    // Validate the user ID
    if (!userId) {
        console.error("User ID is undefined or null.");
        return next(new ErrorHandler('User ID is required to fetch details.', 400));
    }

    try {
        // Find the user by ID and exclude the password from the response
        const user = await User.findById(userId).select('-password').lean();

        // Log the fetched user object
        if (user) {
            console.log("User fetched from database:", user);
            // Return user details
            return res.status(200).json({
                success: true,
                user,
            });
        } else {
            console.error("User not found in the database for user ID:", userId);
            return next(new ErrorHandler('User not found', 404));
        }
    } catch (error) {
        // Log the complete error for debugging
        console.error("Error retrieving user details:", error); // Log the error object

        // Check if the error is a Mongoose error
        if (error instanceof mongoose.Error) {
            console.error("Mongoose Error:", error);
        }

        // Log the error to a file for persistent storage
        logErrorToFile(error); // Ensure this function is correctly defined and imported

        // Handle other errors
        return next(new ErrorHandler('Error retrieving user details', 500));
    }
});



// Get All Users (Admin) with Pagination, Filtering, and Sorting
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    // Destructure query parameters for pagination, filtering, and sorting
    const {
        page = 1, limit = 10, sort = 'createdAt', order = 'desc', ...filters
    } = req.query;

    // Set up pagination and sorting options
    const pageOptions = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
    };
    const sortOptions = {
        [sort]: order === 'asc' ? 1 : -1
    };

    // Filter users based on query parameters
    const users = await User.find(filters, '-password') // Exclude password for security
        .sort(sortOptions)
        .skip(pageOptions.skip)
        .limit(pageOptions.limit);

    // Get total count for pagination purposes
    const totalUsers = await User.countDocuments(filters);

    res.status(200).json({
        success: true,
        page: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        users,
    });
});




// Get Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;

    // Check if the userId is a valid ObjectId format
    const isObjectId = mongoose.isValidObjectId(userId);

    let user;

    try {
        if (isObjectId) {
            // Fetch the user from the database using ObjectId
            user = await User.findById(userId).select('-password'); // Exclude sensitive fields
        } else {
            // Fetch the user by UUID if the ID is not an ObjectId
            user = await User.findOne({
                id: userId
            }).select('-password'); // Exclude sensitive fields
        }

        // Check if the user was found
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Return the found user details
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        // Log the error for debugging purposes
        logErrorToFile(error.message); // Assuming logErrorToFile is available for logging
        return next(new ErrorHandler('Error fetching user details', 500));
    }
});




// Update User Role (Admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const {
        role
    } = req.body;

    // Validate that a role is provided
    if (!role) {
        return next(new ErrorHandler('Role must be provided', 400));
    }

    // Validate that the role is one of the allowed values
    const allowedRoles = ['admin', 'user', 'referral']; // Adjust based on your application's roles
    if (!allowedRoles.includes(role)) {
        return next(new ErrorHandler(`Role must be one of the following: ${allowedRoles.join(', ')}`, 400));
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Update the user's role
    user.role = role; // Directly assign the new role
    await user.save();

    // Return a success response
    res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user,
    });
});


// Delete User (Admin) not working
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.remove();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user',
        });
    }
});

  

// Controller method to update user status
exports.updateUserStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Expect status to be 'active' or 'inactive'

    // Validate status value
    if (!['active', 'inactive'].includes(status)) {
        return next(new ErrorHandler("Invalid status. Status must be 'active' or 'inactive'.", 400));
    }

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Update user's status
    user.status = status;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User status updated to ${status}.`,
    });
});



