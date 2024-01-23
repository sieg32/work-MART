const express = require('express');

const server = express();

server.use(express.static('./public'));









async function start(){
    
    server.listen(process.env.PORT, ()=>{
        console.log('server started at port: ', process.env.PORT);
    })

}


start();





