const jwt = require('jsonwebtoken');



async function authorize(req,res,next){
    if(!req.headers.authorization){
        console.log(req.headers)
        return res.status(401).send('unauthorized');
    }

    try{

        const token = req.headers.authorization.split(' ');
        
        const authorized = await jwt.verify(token[1], process.env.JWT_SECRET);

        if(authorized){

             res.locals.token = authorized;

            next()
        }else{

            res.status(401).send('unauthorized');
        }


    }catch(error){
        console.log(error);
        res.status(500).send('internal server error')
    }
}

module.exports = authorize;