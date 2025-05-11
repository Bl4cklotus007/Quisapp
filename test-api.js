// Test data
const testMateri = {
    subject: "matematika",
    title: "Aljabar Dasar",
    content: "Materi tentang aljabar dasar untuk pemula"
};

const testSoal = {
    subject: "matematika",
    question: "Berapakah hasil dari 2x + 3 jika x = 4?",
    options: ["7", "11", "8", "10"],
    correctAnswer: 1
};

// Helper function to make API requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${data.message || data.error || 'Unknown error'}`);
        }
        
        return { status: response.status, data };
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
        throw error;
    }
}

// Test API endpoints
async function testAPI() {
    const baseUrl = 'https://my-projec12213-4jr46u71e-riyan-maulanas-projects.vercel.app/api';
    
    try {
        // Test health check
        console.log('\nTesting health check...');
        const healthResponse = await makeRequest(`${baseUrl}/health`);
        console.log('Health check response:', healthResponse);

        // Test GET materi
        console.log('\nTesting GET /materi...');
        const materiResponse = await makeRequest(`${baseUrl}/materi`);
        console.log('GET /materi response:', materiResponse);

        // Test POST materi
        console.log('\nTesting POST /materi...');
        const postMateriResponse = await makeRequest(`${baseUrl}/materi`, {
            method: 'POST',
            body: JSON.stringify(testMateri)
        });
        console.log('POST /materi response:', postMateriResponse);

        // Test GET soal
        console.log('\nTesting GET /soal...');
        const soalResponse = await makeRequest(`${baseUrl}/soal`);
        console.log('GET /soal response:', soalResponse);

        // Test POST soal
        console.log('\nTesting POST /soal...');
        const postSoalResponse = await makeRequest(`${baseUrl}/soal`, {
            method: 'POST',
            body: JSON.stringify(testSoal)
        });
        console.log('POST /soal response:', postSoalResponse);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('\nTest failed:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
        process.exit(1);
    }
}

// Run the tests
console.log('Starting API tests...');
testAPI(); 