const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const open = require('open');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Keep original filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const originalName = file.originalname;
        cb(null, `${timestamp}-${originalName}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Store pending uploads
let pendingUploads = [];

// Handle file uploads
app.post('/upload', upload.array('files'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const senderName = req.body.senderName || 'Anonymous';
        
        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            path: file.path,
            senderName: senderName,
            uploadDate: new Date()
        }));

        // Add to pending uploads
        const uploadSession = {
            id: Date.now(),
            senderName: senderName,
            files: uploadedFiles,
            uploadDate: new Date(),
            processed: false
        };
        
        pendingUploads.push(uploadSession);

        console.log(`\n🔔 NEW FILES RECEIVED!`);
        console.log(`👤 From: ${senderName}`);
        console.log(`📁 Files (${uploadedFiles.length}):`);
        uploadedFiles.forEach(file => {
            console.log(`   - ${file.originalName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        });
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log(`🔗 Access admin panel: http://localhost:3000/admin\n`);

        res.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Admin interface
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API endpoints for admin
app.get('/api/pending-uploads', (req, res) => {
    res.json(pendingUploads);
});

app.post('/api/move-files', (req, res) => {
    try {
        const { uploadId, destinationPath } = req.body;
        
        const upload = pendingUploads.find(u => u.id === uploadId);
        if (!upload) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        // Create destination directory if it doesn't exist
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        const movedFiles = [];
        upload.files.forEach(file => {
            const sourcePath = file.path;
            const destFileName = `${upload.senderName}_${file.originalName}`;
            const destPath = path.join(destinationPath, destFileName);
            
            if (fs.existsSync(sourcePath)) {
                fs.renameSync(sourcePath, destPath);
                movedFiles.push({
                    originalName: file.originalName,
                    newPath: destPath
                });
            }
        });

        // Mark as processed
        upload.processed = true;
        upload.destinationPath = destinationPath;
        
        console.log(`\n✅ FILES MOVED SUCCESSFULLY!`);
        console.log(`👤 From: ${upload.senderName}`);
        console.log(`📁 To: ${destinationPath}`);
        console.log(`📄 Files: ${movedFiles.length}\n`);

        res.json({
            message: 'Files moved successfully',
            movedFiles: movedFiles,
            destinationPath: destinationPath
        });
    } catch (error) {
        console.error('Error moving files:', error);
        res.status(500).json({ error: 'Failed to move files' });
    }
});

app.delete('/api/dismiss-upload/:uploadId', (req, res) => {
    try {
        const uploadId = parseInt(req.params.uploadId);
        const uploadIndex = pendingUploads.findIndex(u => u.id === uploadId);
        
        if (uploadIndex === -1) {
            return res.status(404).json({ error: 'Upload not found' });
        }

        const upload = pendingUploads[uploadIndex];
        
        // Delete files from uploads folder
        upload.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        // Remove from pending uploads
        pendingUploads.splice(uploadIndex, 1);
        
        console.log(`🗑️ Dismissed upload from ${upload.senderName}`);

        res.json({ message: 'Upload dismissed successfully' });
    } catch (error) {
        console.error('Error dismissing upload:', error);
        res.status(500).json({ error: 'Failed to dismiss upload' });
    }
});

app.listen(PORT, async () => {
    console.log(`File sharing server running on http://localhost:${PORT}`);
    console.log(`Files will be saved to: ${uploadsDir}`);
    console.log(`Opening admin panel...`);
    
    // Automatically open admin panel
    try {
        await open(`http://localhost:${PORT}/admin`);
        console.log(`✅ Admin panel opened in browser`);
    } catch (error) {
        console.log(`⚠️ Could not open browser automatically. Please visit: http://localhost:${PORT}/admin`);
    }
}); 