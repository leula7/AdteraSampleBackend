import { where } from 'sequelize';
import { MyJob, User, Job, sequelize } from '../../models/index.js'; // Assuming you have the models for User and Job

const updateUserJobsStatus = async (req, res) => {
    try {

        const { status, job_id, user_id } = req.body;


        const existingApplication = await MyJob.findOne({ where: { user_id, job_id } });

        if (!existingApplication) {
            return res.status(400).json({ message: 'there is no applied for this job.' });
        }
       
        if(status === "rejected"){
            const user = await User.findOne({ where: { user_id }, attributes: ['connect_val']});

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const findJobConnectValue = await Job.findOne({ where: { job_id },attributes: ['required_connect']});

            if (!findJobConnectValue) {
                return res.status(404).json({ message: 'Job not found.' });
            }

            const updateUserConnect = await User.update(
                {connect_val: user.connect_val + Math.floor((findJobConnectValue.required_connect/2))},
                { where: { user_id } } );

                if (!updateUserConnect[0]) {
                    return res.status(400).json({ message: 'Error while updating job status' });
                }
        }
       const updateJobStatus = await MyJob.update(
            { status }, 
            { where: { user_id, job_id } }
            );

            if (!updateJobStatus[0]) {  // updateJobStatus is an array: [number_of_affected_rows]
            return res.status(400).json({ message: 'Error while updating job status' });
            }

        res.status(201).json(updateJobStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
};

export default updateUserJobsStatus;
