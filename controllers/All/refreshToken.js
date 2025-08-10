import jwt from 'jsonwebtoken'; // Adjust the path as per your config file

// Example refresh token function
const refreshToken = (req, res) => {
  console.log("refreshing...............")

  const refreshToken = req.cookies.refreshToken;
  const JWT_SECRET = process.env.JWT_SECRET;
  console.log("refresh token: ",refreshToken)
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is missing or invalid.' });
  }
  console.log("found refreshing...............");
  
  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    console.log("validate refreshing...............");

    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id, email: decoded.email, user_type: decoded.user_type },
      JWT_SECRET,
      { expiresIn: '30s' } // Short expiration time for the access token
    );
    res.json({ token: newAccessToken });
  });
};

export default refreshToken;
