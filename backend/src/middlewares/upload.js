const multer = require('multer');
const path = require('path');

const allowed = [
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

const upload = multer({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Arquivo invalido.'));
    }
  }
});

module.exports = upload;
