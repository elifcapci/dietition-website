const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (your website)
app.use(express.static(__dirname));

// API endpoint to save a new blog post
app.post('/api/save-blog', (req, res) => {
    const newPost = req.body;
    const dataPath = path.join(__dirname, 'blog-data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Dosya okunamadı' });
        let json = JSON.parse(data);
        json.posts.unshift(newPost);
        fs.writeFile(dataPath, JSON.stringify(json, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Dosya yazılamadı' });
            res.json({ success: true });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});