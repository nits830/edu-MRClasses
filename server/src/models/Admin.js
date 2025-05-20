const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    role: {
      type: String,
      
      default: 'ADMIN'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Admin creation validation
const validateAdmin = (admin) => {
  const errors = [];

  if (!admin.email) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(admin.email)) {
    errors.push('Invalid email format');
  }

  if (!admin.password) {
    errors.push('Password is required');
  } else if (admin.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!admin.firstName) {
    errors.push('First name is required');
  }

  if (!admin.lastName) {
    errors.push('Last name is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
  Admin,
  validateAdmin
}; 