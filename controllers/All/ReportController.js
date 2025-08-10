import { Job, Report } from '../../models/index.js'; // Assuming you have a Job model

const ReportController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {detail,reported_user_id,job_id,report_type} = req.body.report;
        const formatedReportData = {detail,reported_user_id,job_id,report_type, reporter_id: user_id};
        const report = await Report.create(formatedReportData);
        
        if(report === null) {
            return res.status(400).json({ message: 'Failed to create Report. Invalid data.' });
        }

        const countReport = await Report.count({
            where: {
                job_id: job_id,
            }
        });

        if(countReport > 3){
            var InActiveJob = await Job.update(
                { status: 'inactive' }, // Set the job status to inactive
                { where: { job_id: job_id } }
            );
            if(InActiveJob === null) {
                return res.status(400).json({ message: 'Failed to update job status. Invalid data.' });
            }
        }
        res.status(201).json({message: 'Report created successfully', report});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Report. Internal server error.'+err.message });
    }
};

export default ReportController;
