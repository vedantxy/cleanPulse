const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas for seeding');

        // Create Admin
        const adminEmail = 'vedantpatelxy12@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            const admin = new User({
                name: 'Vedant Admin',
                email: adminEmail,
                password: hashedPassword,
                phone: '1234567890',
                role: 'admin',
                zone: 'All',
                ecoCredits: 1000,
                rank: 'Earth Guardian'
            });
            await admin.save();
            console.log('Admin user created successfully! Email:', adminEmail, 'Password: admin123');
        } else {
            console.log('Admin already exists.');
        }

        // Create Collector
        const existingCollector = await User.findOne({ email: 'collector@cleanpulse.com' });
        if (!existingCollector) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('collector123', salt);
            const collector = new User({
                name: 'Eco Collector',
                email: 'collector@cleanpulse.com',
                password: hashedPassword,
                phone: '0987654321',
                role: 'collector',
                zone: 'North Zone'
            });
            await collector.save();
            console.log('Collector user created successfully! Email: collector@cleanpulse.com Password: collector123');
        } else {
            console.log('Collector already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
