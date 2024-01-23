const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const sellerRoute = require('./routes/seller');
const errorMiddleware = require('./middlewares/errorMiddleware')



const server = express();

server.use(express.json());

server.use(express.static('./public'));


server.use('/seller', sellerRoute);


server.use(errorMiddleware);











async function start(){
    
    server.listen(process.env.PORT, ()=>{
        console.log('server started at port: ', process.env.PORT);
    })

}


start();





