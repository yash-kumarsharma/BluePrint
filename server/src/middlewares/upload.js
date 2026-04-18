const multer = require('multer');

// Configure multer to store files in memory as a buffer rather than physical disk.
// This is perfect for parsing text without cluttering the server storage.
const storage = multer.memoryStorage();

// File filter to explicitly only accept PDF documents
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes max size limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
