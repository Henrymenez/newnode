const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})
const app = require('./app');
const port = process.env.PORT || 3000;

const DB = process.env.DB;
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connection established'))

 
app.listen(port,()=>{
    console.log('listening on port '+ port);
}) 