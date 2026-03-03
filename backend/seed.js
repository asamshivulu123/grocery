require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        // Check for existing admin
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit();
        }

        // Drop the firebaseUid index if it exists in the database but not in our current model
        try {
            const collection = mongoose.connection.collection('users');
            const indexes = await collection.indexes();
            const hasFirebaseIndex = indexes.some(idx => idx.name === 'firebaseUid_1');

            if (hasFirebaseIndex) {
                console.log('Dropping obsolete firebaseUid index...');
                await collection.dropIndex('firebaseUid_1');
            }
        } catch (err) {
            // Index might not exist or another error, but we want to proceed
            console.warn('Note: Could not drop index, assuming it is fine.');
        }

        const admin = await User.create({
            name: 'Site Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });

        if (admin) {
            console.log('✅ Admin user created successfully!');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
