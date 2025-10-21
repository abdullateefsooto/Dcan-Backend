const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema (structure of the User collection)
const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "pls add a name"] },

    email: { type: String, required: [true, "pls add an email"], unique: true },

    password: { type: String, required: [true, "pls add a password"] },

    // Role of the user — can only be 'user' or 'admin', defaults to 'user'
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, 
{ 
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true 
});

// Mongoose pre-save hook: runs before saving a user document
userSchema.pre("save", async function (next) {
    // If password is not modified (e.g., updating name or email), skip hashing
    if (!this.isModified("password")) {
        next();
    }

    // Generate a salt to strengthen password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the user's password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    // Continue saving the document
    next();
});

// Custom method to compare entered password with hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    // bcrypt.compare() returns true if passwords match, false otherwise
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
