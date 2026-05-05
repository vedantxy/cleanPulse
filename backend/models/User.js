const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['citizen', 'collector', 'admin'],
        default: 'citizen'
    },
    zone: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    ecoCredits: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 'Seedling'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
