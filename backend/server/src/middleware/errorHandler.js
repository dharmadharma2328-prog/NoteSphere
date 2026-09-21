export const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds maximum allowed limit (50MB).' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
