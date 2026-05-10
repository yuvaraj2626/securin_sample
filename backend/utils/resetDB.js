import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CVE, Progress } from './models/cveModels.js';

dotenv.config();

const resetDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected successfully');

        console.log('Dropping CVE collection...');
        await CVE.collection.drop().catch(() => console.log('CVE collection not found, skipping...'));

        console.log('Dropping Progress collection...');
        await Progress.collection.drop().catch(() => console.log('Progress collection not found, skipping...'));

        console.log('Database reset complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
};

resetDatabase();
