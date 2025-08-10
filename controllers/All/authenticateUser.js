import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Token: ", token)
  console.log("Header: ", req.header('Authorization'))
  console.log("data is came here as body: ", req.body)
  console.log("data is came here as query: ", req.query)
  
  if (!token) {
    console.log("No token provided")
    return res.status(401).json({ 
      success: false,
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED' // Custom error code for client-side handling
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);

    // Specific error responses
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        expiredAt: err.expiredAt // Include expiration timestamp
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    // Generic error fallback
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

export default authenticateUser;