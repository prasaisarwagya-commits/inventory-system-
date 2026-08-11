// Central error handler so failed requests are handled gracefully with clear messages
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages.join(', '), errors: messages });
  }

  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image file is too large. Maximum size is 5MB.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server. Please try again.',
  });
}

module.exports = errorHandler;
