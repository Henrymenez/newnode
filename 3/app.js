const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


// 1)middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {

    console.log('hello from the middleware!');
    next();
})
app.use((req, res, next) => {
req.requestTime = new Date().toISOString();
    next();
})

app.get('/', (req, res) => {
    res.send({message: 'hello from app'});
});

app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

module.exports = app; 