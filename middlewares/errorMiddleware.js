
  function errorMiddleware(err ,req,res,next){

    console.error(err.stack);
    res.status(500).json({message: "something went wrong "});
}

module.exports = errorMiddleware;