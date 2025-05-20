# User Model Documentation

## Overview
The User model is a Mongoose schema that represents users in the Learning Management System (LMS). It handles authentication, user profiles, roles, learning preferences, and academic progress tracking.

## Schema Structure

### Authentication Fields
- `email` (String, Required)
  - Unique email address
  - Validated using regex pattern
  - Trimmed and converted to lowercase
- `password` (String, Required)
  - Minimum 8 characters
  - Automatically hashed using bcrypt
  - Not returned in queries (select: false)

### Profile Information
- `firstName` (String, Required)
  - User's first name
  - Trimmed
- `lastName` (String, Required)
  - User's last name
  - Trimmed
- `profilePicture` (String)
  - URL or path to profile picture
  - Default: 'default-avatar.png'

### Role and Permissions
- `role` (String)
  - Enum: ['student', 'teacher', 'admin']
  - Default: 'student'

### Learning Preferences
```javascript
learningPreferences: {
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  accessibilitySettings: {
    fontSize: {
      type: String,
      default: 'medium'
    },
    highContrast: {
      type: Boolean,
      default: false
    }
  }
}
```

### Academic Information
- `enrolledCourses` (Array)
  - References to Course model
  - Tracks currently enrolled courses
- `completedCourses` (Array)
  - References to Course model
  - Tracks completed courses

### Progress Tracking
```javascript
progress: {
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  quizScores: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    completedAt: Date
  }]
}
```

### Account Status
- `isActive` (Boolean)
  - Default: true
- `lastLogin` (Date)
  - Timestamp of last login

### Timestamps
- `createdAt` (Date)
  - Automatically set on creation
- `updatedAt` (Date)
  - Automatically updated on changes

## Methods

### Instance Methods

#### comparePassword(candidatePassword)
Compares a provided password with the stored hashed password.
```javascript
const isMatch = await user.comparePassword('password123');
```

#### getFullName()
Returns the user's full name.
```javascript
const fullName = user.getFullName(); // Returns "John Doe"
```

#### isEnrolledInCourse(courseId)
Checks if user is enrolled in a specific course.
```javascript
const isEnrolled = user.isEnrolledInCourse(courseId);
```

#### hasCompletedCourse(courseId)
Checks if user has completed a specific course.
```javascript
const hasCompleted = user.hasCompletedCourse(courseId);
```

### Static Methods

#### findByRole(role)
Finds all users with a specific role.
```javascript
const teachers = await User.findByRole('teacher');
```

## Middleware

### Password Hashing
The model includes a pre-save middleware that automatically hashes passwords before saving:
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

## Usage Examples

### Creating a New User
```javascript
const newUser = await User.create({
  email: 'student@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'student'
});
```

### Finding a User
```javascript
const user = await User.findOne({ email: 'student@example.com' });
```

### Updating User Preferences
```javascript
const user = await User.findById(userId);
user.learningPreferences.preferredLanguage = 'es';
await user.save();
```

### Enrolling in a Course
```javascript
const user = await User.findById(userId);
user.enrolledCourses.push(courseId);
await user.save();
```

## Dependencies
- mongoose: ^7.5.0
- bcryptjs: ^2.4.3

## Related Models
- Course
- Lesson
- Quiz 