const mongoose = require('mongoose');
const Student = require('./models/studentModel');
require('dotenv').config();

async function migrateDebtField() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");

        // Find students where:
        // 1. debt is a number (type 1 = double, 16 = int)
        // 2. debt field is missing
        const usersToUpdate = await Student.find({
            $or: [
                { debt: { $type: 1 } },
                { debt: { $type: 16 } },
                { debt: { $exists: false } }
            ]
        });

        console.log(`🔍 Found ${usersToUpdate.length} users to migrate`);

        for (const user of usersToUpdate) {
            const oldDebt = typeof user.debt === 'number' ? user.debt : 0;

            user.debt = {
                value: oldDebt,
                message: ""
            };

            await user.save({ validateBeforeSave: false });
            console.log(`✅ Updated ${user.name}'s debt`);
        }

        console.log("🎉 Migration complete");
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrateDebtField();
