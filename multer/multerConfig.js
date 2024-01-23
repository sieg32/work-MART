const multer = require('multer');
const fs = require('fs');



const allowedFileTypes = ['image/jpeg', 'image/png'];


const storageProductImage = multer.diskStorage({
    destination:function(req,res,cb){
        const userId = req.params.id;
        const userFolderPath = `public/uploads/${userId}`;


        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }

        cb(null, userFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const storageProfile = multer.diskStorage({
    destination:function(req,res,cb){
        const userId = req.params.id;
        const userFolderPath = `public/uploads/${userId}/profile`;


        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }

        cb(null, userFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false); // Reject the file
    }
  };


const uploadProductImage = multer({storage: storageProductImage, fileFilter:fileFilter});
const uploadProfile = multer({storage: storageProfile, fileFilter: fileFilter});




module.exports = {uploadProductImage, uploadProfile};
