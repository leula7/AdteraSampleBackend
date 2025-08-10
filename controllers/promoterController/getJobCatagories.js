import {JobCategory } from '../../models/index.js';

const getJobCatagories = async (req, res) => {
  try {
    const Jobcatagories = await JobCategory.findAll();
    res.status(200).json(Jobcatagories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



export default getJobCatagories;