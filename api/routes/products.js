const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productsController = require('../controllers/products');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
})
// const imgFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     //accept
//     cb(null, true);
//   }else {
//     //reject
//     cb(null, false);
//   }
// }
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
 
});


router.get('/', productsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage') , productsController.products_create_product);

router.get('/:productId', productsController.products_get_product_by_id);

router.patch('/:productId', checkAuth, productsController.products_update_product);

router.delete('/:productId', checkAuth, productsController.products_delete_product);

router.post('/upload', upload.array('myArrayOfFiles'), (req, res, next) => {

  console.log(req.cookies);
  console.log(req.files);
  res.status(201).json({
    message: 'Uploaded'
  })
})

module.exports = router;