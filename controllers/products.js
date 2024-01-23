


async function addProduct(req, res){

    console.log(req.body, req.files, req.params.id);

    res.send('nigga');
}


module.exports = addProduct;