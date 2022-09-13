const app = require('./app');
const port = process.env.PORT || 3000;

// 4) start server
app.listen(port,()=>{
    console.log('listening on port '+port);
})