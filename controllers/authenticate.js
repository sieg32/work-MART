const bcrypt = require('bcrypt');
const dbPool = require('../database/sqlConnection');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const saltRounds = 10;


 async function registerSeller(req, res){
    console.log( req.body)
    const {name, phone , password , city, address, country, email} = req.body;

    if(phone && phone.length <10){
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
          }
        
    }

    if(!city){
        return res.status(400).json({ error: 'Invalid city' });
    }
    if(!address){
        return res.status(400).json({ error: 'enter address' });
    }
    if(!country){
        return res.status(400).json({ error: 'enter country' });
    }
    const sanitizedAddress = validator.escape(address);
    const hashedPass = await bcrypt.hash(password, saltRounds);

    try{
        const data = await dbPool.query('INSERT INTO seller ( seller_phone, seller_name, password, address, city, country, email ) VALUES (?,?,?,?,?,?,?)',
         [phone, name, hashedPass, sanitizedAddress, city, country, email]);

         res.status(200).json({msg:data[0].insertId});
    }catch(error){
        console.log(error)
        res.status(500).json({error:"error while registering"});
    }




}



 async function loginSeller(req,res){
    console.log(req.body)
    const {phone, password } = req.body;
    if(!phone){
           return res.status(400).json({ error: 'Invalid phone number' });
    }
    if(!password){
        return res.status(400).json({ error: 'Invalid password' });
    }

    const data = await dbPool.query('SELECT idseller, seller_phone, password FROM seller WHERE seller_phone = ?', [phone]);
    if(data[0].length === 0){
       return res.status(400).json({error:'user not found'})
    }
    const information = data[0][0];
     const success = await bcrypt.compare(password, information.password );
    if(success){

        const token = jwt.sign({id : information.id_seller, phone: information.seller_phone }, process.env.JWT_SECRET,{expiresIn: '24h'} );

        res.status(200).json({login:"success", token: token});
    }else{

        res.status(401).json({error:"password incorrect"})
    }

}



module.exports = {registerSeller, loginSeller};