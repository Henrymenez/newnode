const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({path: './config.env'})

const port = process.env.PORT || 3000;

const DB = process.env.DB;
mongoose.connect('mongodb://localhost:27017/natours',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection established'))

 //read file json
 const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

 //import Data
 const importData = async ()=>{
    try{
await Tour.create(tours);
console.log('Date successfully loaded');
    }catch(e){
console.log(e);
    }
 }


 //delete all date

 const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted');
            }catch(e){
        console.log(e);
            }
 }

 if(process.argv[2] === '--import'){
    importData();
 }else if(process.argv[2] === '--delete'){
    deleteData();
 }
