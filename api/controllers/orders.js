const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
  Order.find().select('_id product quantity').populate('product', '_id name').exec().then(docs => {
    res.status(200).json({
      message: 'Get orders suceeded',
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + doc._id
          }
        }
      })
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Get orders failed',
      error: error
    });
  });
}

exports.orders_delete_order_by_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({_id: id}).exec()
  .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      })
  }).catch(error => {
    res.status(500).json({
      error
    })
  })
}

exports.orders_get_order_by_id = (req, res, next) => {
  Order.findById(req.params.orderId).populate('product').exec().then(order => {
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders'
      }
    })
  }).catch(error => {
    res.status(500).json({
      message: 'Get order failed',
      error: error
    })
  })
}

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId).exec().then(product => {
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }
    const order = new Order({
      _id:  new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    })
    return order.save()
  }).then(result => {
    console.log(result)
    res.status(201).json({
      message: 'Order suceeded',
      createdOrder: {
        _id: result._id,
        quantity: result.quantity,
        product: result.product
      },
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/' + result._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Product not found',
      error: error
    })
  })
}