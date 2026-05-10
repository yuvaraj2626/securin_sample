import mongoose from 'mongoose';

export const connectDB = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB.');
        return mongoose.connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
