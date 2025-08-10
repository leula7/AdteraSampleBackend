import { Job } from '../../models/index.js'; // Assuming you have the models for User and Job
import { findPrices } from '../All/additionalFunctions.js';

const CreateJob = async (req, res) => {
    try {
        const {user_id,user_type} = req.user;
        const NewJob = req.body.job;
        const required_connect = await findPrices(NewJob.job_price)
        const formatedJob = {
            ...NewJob,
            user_id,
            status: "active",
            required_connect,
        };
         if (user_type !== 'promoter') {
            return res.status(403).json({ message: 'Access denied. Only companies can view create jobs.' });
        }
        const create = await Job.create(formatedJob);
        res.status(201).json({ message: 'Job created successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
};

const getJobPrice = async (req, res) => {
    try {
        const { job_price } = req.query;
        const required_connect = await findPrices(job_price);
        res.status(200).json({ required_connect });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get job price. Internal server error.' });
    }
};

export {CreateJob, getJobPrice};
