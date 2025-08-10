import { User } from "../../models/index.js";
import bcrypt from 'bcrypt';

const changeForgetPassword = async (req, res) => {
  try {
    const {  newPassword,email } = req.body;

    // Fetch the user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedNewPassword },
      { where: { email } }
    );
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const changePassword = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { oldPassword, newPassword } = req.body;

    // Fetch the user
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch the user's hashed password from the database
    const storedPass = await User.findOne({ where: { user_id }, attributes: ['password'] });
    if (!storedPass) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided oldPassword with the hashed password from the database
    const isMatch = await bcrypt.compare(oldPassword, storedPass.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedNewPassword },
      { where: { user_id } }
    );
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export {changeForgetPassword, changePassword}