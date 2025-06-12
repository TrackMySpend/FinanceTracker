const multer= require('multer');
//congifure storage
const storage= multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `Date.now() ${file.originalname}`); // append timestamp to the original filename
    }, 
});

//File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // reject the file
    }
};

const upload= multer({storage,fileFilter});

module.exports=upload;