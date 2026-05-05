const mongoose = require('mongoose');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/smartwaste');
        console.log('Connected to MongoDB');
        
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const users = await User.find({});
        
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkUsers();
