const mongoose = require('mongoose');
require('dotenv').config();

function maskMongoUri(uri) {
    if (!uri) return '';
    try {
        return uri.replace(/(mongodb(?:\+srv)?:\/\/)(.*@)/, '$1****@');
    } catch (e) {
        return '****';
    }
}

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('MONGO_URI is not set in environment variables. Please set MONGO_URI in .env.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected successfully (${maskMongoUri(uri)})`, 'db:', mongoose.connection.name);

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected.');
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message || error);
        process.exit(1);
    }
};

module.exports = connectDB;