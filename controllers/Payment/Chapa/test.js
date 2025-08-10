const paymanetResponse = async (req, res) => {
  try {
    const { user_type } = req.user;
      console.log("users: ",req.user);
      console.log("payment response: ",req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while deleting connect package.' });
  }
};

export default paymanetResponse