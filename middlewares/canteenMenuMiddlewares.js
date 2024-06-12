const { asyncRequestHandler } = require("../utils/errorHandlers");
const multer = require('multer');

module.exports.verifyNewItem = asyncRequestHandler((req, res,next)=>{
    const { itemName, price, category,image, available } = req.body;
    if(!itemName || !price || !category || !image ){
        throw getError(400, "Error", "Failed to add item please fill all the required fields");
    }
    req.body.available = req.body.available || true;
    next();
})

module.exports.managefilepath = async function (req,res,next){
    let filepath = req.file.path
     req.body.image = filepath.replace('public','')
     next()
 }
 
module.exports.itemimageupload = multer({ 
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let category = req.body.category
            cb(null, `./public/assets/img/menu/${category}`); 
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('image'); 