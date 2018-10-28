const express =  require('express');
const app =  express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
  `mongodb://admin:${process.env.MONGO_ATLAS_PW}@node-rest-shop-shard-00-00-auszj.mongodb.net:27017,node-rest-shop-shard-00-01-auszj.mongodb.net:27017,node-rest-shop-shard-00-02-auszj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true`,
  {
    useNewUrlParser: true
  }
);
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }),
);

//Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;