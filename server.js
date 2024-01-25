const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const sellerRoute = require('./routes/seller');
const productRoute = require('./routes/product');
const searchRoute = require('./routes/search');
const userRoute = require('./routes/user')
const errorHandler = require('./middlewares/errorMiddleware')



const server = express();

server.use(express.json());

server.use(express.static('./public'));


server.use('/api/seller', sellerRoute);
server.use('/api/product', productRoute);

server.use('/api/search', searchRoute);
server.use('/api/user', userRoute)


server.use(errorHandler);











async function start(){
    
    server.listen(process.env.PORT, ()=>{
        console.log('server started at port: ', process.env.PORT);
    })

}


start();





