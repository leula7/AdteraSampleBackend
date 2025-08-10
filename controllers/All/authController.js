import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserType } from '../../models/index.js'; // Adjust the import path as necessary
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables!');
}

const authController = {
  register: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        username,
        base_price,
        email,
        dob,
        phone_number,
        password,
        user_type,
         // 'influencer', 'promoter', or 'admin'
      } = req.body;
      console.log("Registering user: ", email, user_type);
      // Server-side validation
      if (!['influencer', 'promoter', 'admin'].includes(user_type)) {
        coonsole.log("Invalid user type: ", user_type);
        return res.status(400).json({ message: 'Invalid user type.' });
      }
      
      if(user_type === "admin"){
        return res.status(400).json({ message: 'Invalid user type.' });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log("User already exists: ", email);
         res.status(409).json({ message: 'User already.' });
         return
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create User
      const user = await User.create({
        first_name,
        last_name,
        username,
        email,
        dob,
        phone_number,
        base_price,
        connect_val: 20,
        password: hashedPassword
      });

      // Assign UserType
      await UserType.create({
        user_id: user.user_id,
        user_type
      });
      

      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
          where: {
            [Op.or]: [
              { email },
              { username: email } // assuming `email` holds either email or username input
            ]
          }
        });

      if (!user) return res.status(404).json({ message: 'Invalid email or password.' });

      if(user.account_status != 'active') return res.status(404).json({ message: 'Your Account has been inactive contact Administrtors' });
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

      // Get user type
      const userType = await UserType.findOne({ where: { user_id: user.user_id } });

      // Create ACCESS JWT
      const token = jwt.sign({
        user_id: user.user_id,
        email: user.email,
        user_type: userType?.user_type
      }, JWT_SECRET, { expiresIn: '1hr' });

      //create JWT REFRESH TOKEN
      const refreshToken = jwt.sign(
        { user_id: user.user_id, email: user.email, user_type: userType?.user_type },
        JWT_SECRET,
        { expiresIn: '7d' }  // Refresh token expiration
      );

      // const isBlacklisted = await redis.get(`bl_${token}`);
      // if (isBlacklisted) {
      //   return res.status(401).json({ message: 'Token has been blacklisted. Please re-authenticate.' });
      // }

      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'None' // Or 'None' if cross-origin
      });

      console.log("get header cooke: ",res.getHeaders())
      
      const refreshTokens = req.cookies;
      console.log("refresh tokenL: ",refreshTokens)

      res.json({ message: 'Login successful.',username: user.username, token, userType: userType.user_type, user_id: user.user_id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

export default authController;