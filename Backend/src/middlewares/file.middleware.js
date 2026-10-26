import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 2*1024*1024
    }
})

// Accepts any field name, then assigns the first file to req.file
export const handleUpload = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "File too large. Max limit is 2MB." });
            }
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ message: `Server upload error: ${err.message}` });
        }

        if (req.files && req.files.length > 0) {
            req.file = req.files[0];
        }
        next();
    });
}

export default upload
