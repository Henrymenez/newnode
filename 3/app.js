const fs = require('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// app.get('/', (req, res) =>{
// res.status(200).json({message:"Homepage", app: "Natours"});
// });

// app.post('/', (req, res) =>{
// res.send("you can post to this endpoint");
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: { 
            tours
        }
    });
})

app.get('/api/v1/tours/:id',(req,res)=>{
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
})


app.post('/api/v1/tours',(req,res)=>{
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
});

app.patch('/api/v1/tours/:id',(req,res)=>{
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
});

app.delete('/api/v1/tours/:id',(req,res)=>{
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
});



app.listen(port,()=>{
    console.log('listening on port '+port);
})