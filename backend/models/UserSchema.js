const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^\d{10}$/, "Invalid phone number"],
    },
    password: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["admin", "student", "subadmin"],
        default: "student",
    },
    name: {
        type: String,
        default: null,
    },
    dob: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    profilePic: {
        type: String,
        default: null,
    },
    selectedCategory: {
        type: String,
        default: null,
    },
    targetYear: {
        type: String,
        default: null,
    },
    isOnboardingComplete: {
        type: Boolean,
        default: false,
    },
    welcomeEmailSent: {
        type: Boolean,
        default: false,
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true }
    },
    streak: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
    enrolledCourses: [
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["locked", "unlocked"],
      default: "locked",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    selectedExam: {
        type: String,
        default: null,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    bannedAt: {
        type: Date,
        default: null,
    },
    bannedReason: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
}
,{ timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

