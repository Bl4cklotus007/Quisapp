// Function to load and display materials
async function loadMateri(subject) {
    try {
        const response = await fetch('../../data/materi.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Get the container where we'll display the materials
        const container = document.getElementById('materi-container');
        if (!container) return;

        // Get materials for the specific subject
        const subjectMateri = data.materi[subject];
        if (!subjectMateri) {
            container.innerHTML = '<p>Materi tidak ditemukan</p>';
            return;
        }

        // Create HTML for each topic
        let html = '';
        for (const [topicKey, topic] of Object.entries(subjectMateri)) {
            html += `
                <div class="materi-card">
                    <h2>${topic.judul}</h2>
                    <div class="materi-preview">
                        ${getPreviewContent(topic.konten)}
                    </div>
                    <a href="${topicKey}.html" class="btn-materi">Pelajari Materi</a>
                </div>
            `;
        }

        container.innerHTML = html;

        // Add click event listeners after content is loaded
        const materiCards = document.querySelectorAll('.materi-card');
        materiCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-materi')) {
                    const link = card.querySelector('.btn-materi');
                    if (link) {
                        link.click();
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading materials:', error);
        document.getElementById('materi-container').innerHTML = 
            '<p>Terjadi kesalahan saat memuat materi. Silakan coba lagi nanti.</p>';
    }
}

// Function to get preview content
function getPreviewContent(konten) {
    if (konten.pengertian) {
        return `<p>${konten.pengertian}</p>`;
    }
    
    // If no pengertian, try to get first available content
    for (const [key, value] of Object.entries(konten)) {
        if (typeof value === 'string') {
            return `<p>${value}</p>`;
        } else if (Array.isArray(value)) {
            return `<ul><li>${value[0]}</li></ul>`;
        } else if (typeof value === 'object') {
            const firstValue = Object.values(value)[0];
            if (typeof firstValue === 'string') {
                return `<p>${firstValue}</p>`;
            }
        }
    }
    
    return '<p>Materi tersedia</p>';
} 