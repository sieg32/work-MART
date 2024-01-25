const dbPool = require("../database/sqlConnection");


async function getUser(req,res){

    try{
        const data = await dbPool.query('SELECT * FROM seller WHERE idseller = ?', [req.params.id]);

        if(data[0].length === 0){
            return res.status(404).send('user not found')
        }
        delete data[0][0].password;
        res.send(data[0][0]);
    }catch(error){
        console.log(error);
        res.status(500).send('internal server error');
    }


}


async function updateUser(req, res){

    try{
        const userData = await dbPool.query('SELECT idseller FROM seller WHERE idseller = ?', [req.params.id]);
            
        if(userData[0].length === 0){
            return res.status(404).send('user not found');
        }
       


        if(!(String(userData[0][0].idseller) === res.locals.token.id)){
            return res.status(401).send('unauthorized')
        }
        
        const {name, phone,address, city, country, email} = req.body;    

        const updateFields = [];
        const values = [];

        if(name){
            updateFields.push('seller_name = ?');
            values.push(name);
        }
        if(phone){
            updateFields.push('seller_phone = ?');
            values.push(phone);
        }
        if(address){
            updateFields.push('address = ?');
            values.push(address);
        }
        if(city){
            updateFields.push('city = ?');
            values.push(city);
        }
        if(country){
            updateFields.push('country = ?');
            values.push(country);
        }
        if(email){
            updateFields.push('email = ?');
            values.push(email);
        }

       

        let query = `UPDATE seller SET ${updateFields.join(', ')} WHERE idseller = ?`

        values.push(req.params.id);

        const update = await dbPool.query(query, values);
        
        if(update[0].affectedRows === 0){
            return res.status(500).send('unable to update user');
        }else{
            
            res.status(200).send('user updated');
        }


        
    }catch(error){
        console.log(error);
        res.status(500).send('internal server error')
    }
}


async function updateProfile(req,res){
    res.status(200).send('profile updated')
}

module.exports = {getUser, updateUser, updateProfile};