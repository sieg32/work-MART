
const fileErrorHandler = (err, req, res, next) => {
  
    console.error(err.stack); // Log the error for debugging purposes
    
    if (err.message.startsWith('Invalid file type.')) {
      // Handle invalid file type error
      res.status(400).json({ error: err.message });
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      // Handle file size limit exceeded error
      res.status(400).json({ error: 'File size limit exceeded' });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ error: 'Internal server error' });
    }
    
  };
  
  module.exports = fileErrorHandler;
  