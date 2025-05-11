const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Path to materi.json
const MATERI_JSON_PATH = path.join(__dirname, '../data/materi.json');
const GENERATE_SCRIPT_PATH = path.join(__dirname, 'generate-materi-html.js');

// Function to check if file exists
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

// Function to run generate-materi-html.js
function generateMateri() {
    console.log('\n🔄 Perubahan terdeteksi pada materi.json');
    console.log('📝 Memulai generate file HTML...\n');

    exec(`node "${GENERATE_SCRIPT_PATH}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error saat generate:', error);
            return;
        }
        if (stderr) {
            console.error('⚠️ Warning:', stderr);
        }
        console.log('✅ Generate selesai:', stdout);
        console.log('\n👀 Menunggu perubahan berikutnya...\n');
    });
}

// Main function to watch materi.json
function watchMateri() {
    // Check if materi.json exists
    if (!fileExists(MATERI_JSON_PATH)) {
        console.error('❌ Error: materi.json tidak ditemukan di', MATERI_JSON_PATH);
        process.exit(1);
    }

    // Check if generate-materi-html.js exists
    if (!fileExists(GENERATE_SCRIPT_PATH)) {
        console.error('❌ Error: generate-materi-html.js tidak ditemukan di', GENERATE_SCRIPT_PATH);
        process.exit(1);
    }

    console.log('👀 Memulai watch mode untuk materi.json...\n');
    console.log('📁 File yang dipantau:', MATERI_JSON_PATH);
    console.log('⚡ Script yang dijalankan:', GENERATE_SCRIPT_PATH);
    console.log('\n🔄 Menunggu perubahan...\n');

    // Watch for changes in materi.json
    fs.watch(MATERI_JSON_PATH, (eventType, filename) => {
        if (eventType === 'change' && filename === 'materi.json') {
            // Add a small delay to ensure file is completely written
            setTimeout(generateMateri, 500);
        }
    });
}

// Start watching
watchMateri(); 