const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/smartwaste');
        console.log('Connected to MongoDB');
        
        const User = mongoose.model('User', new mongoose.Schema({ email: String, password: { type: String, required: true } }));
        const user = await User.findOne({ email: 'test@example.com' });
        
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('password123', salt);
        await user.save();
        
        console.log('Password reset successfully to: password123');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

resetPassword();
