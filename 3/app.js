const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const port = process.env.PORT || 3000;

// 1)middlewares
app.use(morgan('dev'));
app.use(express.json());
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

// 4) start server
app.listen(port,()=>{
    console.log('listening on port '+port);
})