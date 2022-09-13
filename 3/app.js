const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { application } = require('express');

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// 2)route handlers
const getAllTours = (req,res)=>{
    res.status(200).json({
        status: 'success',
        requsedtedAt: req.requestTime,
        result: tours.length,
        data: { 
            tours
        }
    });
};

const getTour = (req,res)=>{
    const id = req.params.id * 1;

    // if(id > tours.length){
    //     return res.status(404).json({
    //         status: 'failed',
    //         message: 'Invalid id'
    //     });
    // }

   const tour = tours.find(el=> el.id === id);
   if(!tour){
    return res.status(404).json({
        status: 'failed',
        message: 'Invalid Id'
    });
}
    res.status(200).json({
        status: 'success',
        data: { 
            tour
        }
    });
};

const createTour = (req,res)=>{
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId},req.body)
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
    res.status(201).json({
        status: 'success',
        data:{
           tour: newTour
        }
    })
    })
    };

    const updateTour = (req,res)=>{
        const id = req.params.id * 1;
    
        if(id > tours.length){
            return res.status(404).json({
                status: 'failed',
                message: 'Invalid id'
            });
        }
    res.status(200).json({
        status: 'success',
    data: {
        tour: 'Updated tour'
    }
    })
    }

    const deleteTour = (req,res)=>{
        const id = req.params.id * 1;
    
        if(id > tours.length){
            return res.status(404).json({
                status: 'failed',
                message: 'Invalid id'
            });
        }
    res.status(204).json({
        status: 'success',
      data: null
    })
    }
//users
const getAllUsers = (req, res) => {
res.status(500).json({
    status: 'error',
    message: 'route not yet defined'
})
}
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defined'
    })
    }
    const createUser = (req, res) => {
        res.status(500).json({
            status: 'error',
            message: 'route not yet defined'
        })
        }
        const updateUser = (req, res) => {
            res.status(500).json({
                status: 'error',
                message: 'route not yet defined'
            })
            }
            const deleteUser = (req, res) => {
                res.status(500).json({
                    status: 'error',
                    message: 'route not yet defined'
                })
                }
// 3)routes
// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);


const tourRouter = express.Router();
const userRouter = express.Router();
tourRouter.route('/')
.get(getAllTours).
post(createTour)

tourRouter.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

userRouter.route('/')
.get(getAllUsers)
.post(createUser)

userRouter.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser)


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',tourRouter);

// 4) start server
app.listen(port,()=>{
    console.log('listening on port '+port);
})