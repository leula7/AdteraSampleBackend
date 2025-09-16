import { col, fn, where } from 'sequelize';
import sequelize from "../../config/db.js";
import { MyJob, User, Job, BorrowedConnect, UserType } from '../../models/index.js'; // Assuming you have the models for User and Job

const ApplyNowController = async (req, res) => {
    try {
        console.log("am i applying ",req.body.applyData)
        const {user_id,user_type} = req.user;
        console.log("type: ",user_type)
        if(user_type !== 'influencer'){
            return res.status(403).json({ message: 'Forbidden: Only influencers can apply for jobs.' });
        }
        const { job_id, status,applyWithBorrow } = req.body.applyData;
        const existingApplication = await MyJob.findOne({ where: { user_id, job_id } });
        const serviceFee = 5;

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }
        
        const user = await User.findOne({ where: { user_id } });
        const borrowed_val = await BorrowedConnect.findOne({
              where: { borrowed_user_id: user_id },
              attributes: [[fn('SUM', col('borrowed_val')), 'borrowed_val']]
            });
            console.log("jase: ",borrowed_val)
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const connect_val = user.connect_val;

        
        const job = await Job.findOne({ where: { job_id } });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        const t = await sequelize.transaction();

        try {
        const required_connect = job.required_connect;
        const data = { user_id, job_id, status };
        let apply;

        if (connect_val < required_connect) {
            if (applyWithBorrow) {
            apply = await MyJob.create(data, { transaction: t });

            if(Number(borrowed_val.borrowed_val)+Number(required_connect)+serviceFee > 300 ){
                return res.status(400).json({ message: 'You have reached maximum borrowed Connect' });
            }
            await BorrowedConnect.create(
                {   borrowed_user_id: user_id,
                    original_required_connect: required_connect,
                    job_id,borrowed_val: required_connect + serviceFee},
                { transaction: t } // ✅ include transaction here too
            );
            } else {
            await t.rollback();
            return res.status(400).json({ message: 'Not enough connect value to apply for this job.' });
            }
        } else {
            apply = await MyJob.create(data, { transaction: t });
            await user.update(
            { connect_val: connect_val - required_connect },
            { where: { user_id }, transaction: t }
            );
        }

        await t.commit(); // commit after all DB ops
        res.status(201).json({ apply, message: "Apply Success" });

        } catch (err) {
        // Only rollback if transaction is still active
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Transaction failed:", err);
        res.status(500).json({ message: "Failed to apply for job." });
        }

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
}

export default ApplyNowController;
