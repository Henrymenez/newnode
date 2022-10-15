const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})
const app = require('./app');
const port = process.env.PORT || 3000;

const DB = process.env.DB;
// 'mongodb://localhost:27017/natours?directConnection=true'
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
}).then(() => console.log('DB connection established'))

 
app.listen(port,()=>{
    console.log('listening on port '+ port);
}) 