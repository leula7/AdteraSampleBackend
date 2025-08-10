import { MyJob, User, Job } from '../../models/index.js'; // Assuming you have the models for User and Job

const ApplyNowController = async (req, res) => {
    try {
        console.log("am i applying")
        const user_id = req.user.user_id;
        const { job_id, status } = req.body.applyData;

        
        const existingApplication = await MyJob.findOne({ where: { user_id, job_id } });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }
        
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const connect_val = user.connect_val;

        
        const job = await Job.findOne({ where: { job_id } });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const required_connect = job.required_connect;
        if (connect_val < required_connect) {
            return res.status(400).json({ message: 'Not enough connect value to apply for this job.' });
        }   
        const data = { user_id, job_id, status };
        const apply = await MyJob.create(data);
        await user.update({
            connect_val: connect_val - required_connect
        });
        res.status(201).json(apply);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
};

export default ApplyNowController;
