const { request } = require('express');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) =>{
res.status(200).json({message:"Homepage", app: "Natours"});
});

app.post('/', (req, res) =>{
res.send("you can post to this endpoint");
});


app.listen(port,()=>{
    console.log('listening on port '+port);
})