const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
  Product.find().select('name price _id productImage').exec().then(docs => {
    console.log(docs);
    res.status(200).json({
      message: 'Get products successfully',
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        }
      })
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({error: error});
  })
}

exports.products_create_product = (req, res, next) => {
  console.log('yolo')
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Created a product',
      createdProduct:{
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + result._id
        }
      }
    });
  }).catch(error =>{ 
    console.log(error);
    res.status(500).json({error: error});
  });
}

exports.products_get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).select('name price _id productImage').exec().then(
    doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided ID'
        })
      }
    }
  ).catch(error =>{
    console.log(error);
    res.status(500).json({error: error})
  });
}

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, {
    $set: updateOps
  }).exec().then(result => {
    console.log(result);
    res.status(200).json({
      message: "Product updated"
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({error: error})
  })
}

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({_id: id}).exec()
  .then(result => {
      res.status(200).json({
        message: 'Product deleted'
      })
  }).catch(error => {
    res.status(500).json({
      error
    })
  })
}