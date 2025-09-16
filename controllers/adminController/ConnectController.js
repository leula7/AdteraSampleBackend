import { Connect } from '../../models/index.js'; // Assuming you have a Job model

const ConnectController = async (req, res) => {
  try {
    console.log('Fetching all connect packages');
    const limit = 50; // Optional query param
    const offset = req.query.offset; // Get offset from request parameters
    const connect = await Connect.findAll({limit: parseInt(limit), offset: parseInt(offset)}); // Adjust the limit and offset as needed

    res.status(200).json(connect);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'get all jobs Internal server error.' });
  }
};

export default ConnectController;
