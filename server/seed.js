require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Facility = require('./model/Facility');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mindfit";

async function seedFacilities() {
    console.log("🌱 Starting seeding process...");

    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ MongoDB connected");

        // Clear existing facilities
        await Facility.deleteMany({});
        console.log("🗑️  Cleared existing facilities");

        const facilities = [];
        const filePath = path.join(__dirname, 'data', 'kspo_facilities.csv');

        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            process.exit(1);
        }

        console.log(`📂 Reading CSV from ${filePath}...`);

        const stream = fs.createReadStream(filePath)
            .pipe(csv());

        for await (const row of stream) {
            if (!row.FCLTY_NM) continue; // Skip if no name

            const lat = parseFloat(row.FCLTY_LA);
            const lon = parseFloat(row.FCLTY_LO);

            // Validate coordinates
            if (isNaN(lat) || isNaN(lon)) continue;

            const facilityName = row.FCLTY_NM.trim();
            // Combine address parts if specific address is missing
            const address = row.RDNMADR_NM
                ? row.RDNMADR_NM.trim()
                : `${row.ROAD_NM_CTPRVN_NM || ''} ${row.ROAD_NM_SIGNGU_NM || ''}`.trim();

            facilities.push({
                facilityName,
                address,
                latitude: lat,
                longitude: lon,
                location: {
                    type: 'Point',
                    coordinates: [lon, lat]
                },
                metadata: {
                    tel: row.RSPNSBLTY_TEL_NO
                }
            });

            // Batch insert every 1000 records to manage memory
            if (facilities.length >= 1000) {
                await Facility.insertMany(facilities);
                process.stdout.write('.'); // Progress indicator
                facilities.length = 0;
            }
        }

        // Insert remaining
        if (facilities.length > 0) {
            await Facility.insertMany(facilities);
        }

        console.log("\n✅ Facilities seeding completed!");

        // Create a text index for search if not exists (though mongoose model handles it via schema options usually, explicitly creating helps)
        // Actually schema didn't define text index, but we search via Regex so it's fine. 
        // Geo index is defined in schema.

    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Database disconnected");
        process.exit(0);
    }
}

seedFacilities();
