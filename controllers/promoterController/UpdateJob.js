import { where } from 'sequelize';
import { Job, User } from '../../models/index.js'; // Assuming you have the models for User and Job
import { findPrices } from '../All/additionalFunctions.js';

const UpdateJob = async (req, res) => {
    try {
        const {user_id,user_type} = req.user;
        const NewJob = req.body;
        const required_connect = await findPrices(NewJob.job_price);
        const updatedJobs = {
            ...NewJob,
            user_id,
            status: "active",
            required_connect,
        };
         if (user_type !== 'promoter') {
            return res.status(403).json({ message: 'Access denied. Only companies can view create jobs.' });
        }

        if(NewJob.is_premium === '1'){
            const getconnectVal = await User.findOne({
                attribute: ['connect_val'],
                where: user_id
            });

            if(getconnectVal.connect_val <20){
                return res.status(505).json({ message: 'Not Enough connect for premium job.' });
            }
            const updateConnect = await User.increment(
            { connect_val: -20 },
            { where: { user_id } });

            if(updateConnect[1] < 0){
                return res.status(505).json({ message: 'Cant deduct Connect from your account.' });
            }

        }

        const updateJob = await Job.update(
            updatedJobs,
            { where: { job_id: NewJob.job_id, user_id: user_id } }
            );

         if (updateJob[0] === 0) {
            return res.status(404).json({ message: 'Job not found or nothing was updated.' });
            }

    res.status(200).json({ message: 'Job updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to Update This Job. Internal server error.' });
    }
};


export default UpdateJob;
