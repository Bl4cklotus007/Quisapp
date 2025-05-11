const fs = require('fs');
const path = require('path');

// Template untuk file HTML
function generateHTMLTemplate(materi, kategori, key) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${materi.judul} - Materi ${kategori}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/style.css">
    <style>
        .materi-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }

        .materi-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .materi-section h2 {
            color: var(--primary);
            margin-bottom: 20px;
            font-size: 1.8rem;
        }

        .materi-section h3 {
            color: var(--primary);
            margin: 20px 0 15px;
            font-size: 1.4rem;
        }

        .materi-section p {
            color: var(--text-dark);
            line-height: 1.8;
            margin-bottom: 15px;
        }

        .materi-section ul {
            list-style-type: none;
            padding-left: 20px;
            margin-bottom: 20px;
        }

        .materi-section ul li {
            color: var(--text-dark);
            margin-bottom: 10px;
            position: relative;
            padding-left: 25px;
        }

        .materi-section ul li:before {
            content: "•";
            color: var(--primary);
            font-size: 1.5em;
            position: absolute;
            left: 0;
            top: -2px;
        }

        .contoh-box {
            background: rgba(79, 70, 229, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
        }

        .contoh-box h3 {
            color: var(--primary);
            margin-bottom: 15px;
        }

        .contoh-box p {
            color: var(--text-dark);
            font-style: italic;
            line-height: 1.8;
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px;
        }

        .back-button {
            display: inline-block;
            padding: 10px 20px;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .quiz-button {
            display: inline-block;
            padding: 12px 25px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .back-button:hover, .quiz-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            .materi-container {
                padding: 10px;
            }

            .materi-section {
                padding: 20px;
            }

            .materi-section h2 {
                font-size: 1.5rem;
            }

            .materi-section h3 {
                font-size: 1.2rem;
            }

            .button-container {
                flex-direction: column;
                gap: 10px;
            }

            .back-button, .quiz-button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="button-container">
        <a href="index.html" class="back-button">← Kembali ke Daftar Materi</a>
        <a href="../../soal/${kategori}/soal.html" class="quiz-button">Mulai Quiz</a>
    </div>
    
    <div class="materi-container">
        ${generateContent(materi)}
    </div>
</body>
</html>`;
}

// Fungsi untuk menghasilkan konten HTML berdasarkan struktur materi
function generateContent(materi) {
    let content = '';
    
    // Handle different content structures
    if (typeof materi === 'string') {
        content = `<p>${materi}</p>`;
    } else if (Array.isArray(materi)) {
        content = '<ul>';
        materi.forEach(item => {
            if (typeof item === 'string') {
                content += `<li>${item}</li>`;
            } else if (typeof item === 'object') {
                content += `<li>${generateContent(item)}</li>`;
            }
        });
        content += '</ul>';
    } else if (typeof materi === 'object') {
        for (const [key, value] of Object.entries(materi)) {
            if (key === 'judul' || key === 'pengertian') {
                content += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
                if (typeof value === 'string') {
                    content += `<p>${value}</p>`;
                } else {
                    content += generateContent(value);
                }
            } else if (Array.isArray(value)) {
                content += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
                content += '<ul>';
                value.forEach(item => {
                    if (typeof item === 'string') {
                        content += `<li>${item}</li>`;
                    } else if (typeof item === 'object') {
                        content += `<li>${generateContent(item)}</li>`;
                    }
                });
                content += '</ul>';
            } else if (typeof value === 'object') {
                content += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
                content += generateContent(value);
            } else if (typeof value === 'string') {
                content += `<h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
                content += `<p>${value}</p>`;
            }
        }
    }
    
    return content;
}

// Fungsi utama untuk generate file HTML
async function generateMateriHTML() {
    try {
        // Baca file materi.json
        const materiJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/materi.json'), 'utf8'));
        
        // Iterasi setiap kategori (bahasa-indonesia, agama, dll)
        for (const [kategori, materiKategori] of Object.entries(materiJson.materi)) {
            // Buat direktori jika belum ada
            const kategoriDir = path.join(__dirname, `../materi/${kategori}`);
            if (!fs.existsSync(kategoriDir)) {
                fs.mkdirSync(kategoriDir, { recursive: true });
            }

            // Generate file HTML untuk setiap materi
            for (const [key, materi] of Object.entries(materiKategori)) {
                const htmlContent = generateHTMLTemplate(materi, kategori, key);
                const filePath = path.join(kategoriDir, `${key}.html`);
                fs.writeFileSync(filePath, htmlContent);
                console.log(`Generated: ${filePath}`);
            }

            // Generate index.html untuk kategori
            const indexContent = generateIndexHTML(kategori, materiKategori);
            const indexPath = path.join(kategoriDir, 'index.html');
            fs.writeFileSync(indexPath, indexContent);
            console.log(`Generated: ${indexPath}`);
        }

        console.log('All HTML files generated successfully!');
    } catch (error) {
        console.error('Error generating HTML files:', error);
    }
}

// Fungsi untuk generate index.html
function generateIndexHTML(kategori, materiKategori) {
    const kategoriTitle = kategori.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materi ${kategoriTitle} - Quiz App</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/style.css">
    <style>
        .materi-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }

        .materi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .materi-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .materi-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .materi-card h2 {
            color: var(--primary);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }

        .materi-card p {
            color: var(--text-dark);
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .materi-card .btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .materi-card .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .back-button {
            display: inline-block;
            margin: 20px;
            padding: 10px 20px;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            .materi-container {
                padding: 10px;
            }

            .materi-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <a href="../../index.html" class="back-button">← Kembali ke Menu Utama</a>
    
    <div class="materi-container">
        <h1 style="text-align: center; color: var(--primary); margin-bottom: 30px;">Materi ${kategoriTitle}</h1>
        <div class="materi-grid">
            ${Object.entries(materiKategori).map(([key, materi]) => `
                <div class="materi-card">
                    <h2>${materi.judul}</h2>
                    <p>${materi.konten.pengertian}</p>
                    <a href="${key}.html" class="btn">Pelajari Materi</a>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
}

// Jalankan script
generateMateriHTML(); 