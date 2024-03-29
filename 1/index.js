const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemp');
//Blocking synchronous way
//const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);
//const textOut = `new text ${textIn}. \n creted on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
//console.log("File written");

//non blocking asynchronous way
// fs.readFile('./txt/start.txt','utf-8', (err,data1)=>{
// fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err,data2)=>{
// console.log(data2);
// fs.writeFile('./txt/final.txt',`${data1}.\n${data2}`, 'utf-8', err =>{
//     console.log("your file has been written");
// });

// })
// } );
///////////////////////////////////////
//SERVER


const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) =>{
const{ query, pathname} = url.parse(req.url,true);

//overview page
if(pathname === '/' || pathname === "/overview"){
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })

   const cardsHtml =  dataObj.map(el => replaceTemplate(tempCard,el)).join('');
const output = tempOverview.replace('{%PRODUCTCARD%}',cardsHtml)
    res.end(output)

    //product page
   } else if(pathname === "/product"){
    res.writeHead(200,{ 'Content-Type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product);
    res.end(output);

    //api page
   }else if(pathname === "/api"){
    res.writeHead(200,{ 'Content-Type': 'application/json'});
    res.end(data); 

    //404 not found
   }else{
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.end("<h1>Page not found</h1>");
   }
    

});

server.listen(8000, '127.0.0.1',()=>{
    console.log("server listening on port 8000");
});