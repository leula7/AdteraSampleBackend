import { MyJob, Job, Chat, Rate } from '../../models/index.js';

const getJobStatus = async (req, res) => {
  try {
    const { user_id, user_type } = req.user;
    const status = req.query.status;
    const limit = req.query.limit || 10;
    const offset = req.query.offset;
    
    const jobs = await MyJob.findAll({
      where: {
        user_id: user_id,
        status: status
      },
      include: [{
        model: Job,
        attributes: ['user_id', 'title', 'job_description','job_price','required_connect','job_created_date'],
        required: true
      }],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    var transformedJobs = [];
     transformedJobs = await Promise.all(jobs.map(async (job) => {
      const baseData = {
        job_id: job.job_id,
        status: job.status,
        title: job.Job.title,
        required_connect: job.Job.required_connect,
        job_price: job.Job.job_price,
        description: job.Job.job_description,
        creator_id: job.Job.user_id,
        job_created_date: job.Job.job_created_date,
      };

      // Only fetch count_unread if status is "approve"
      if (status === 'approve') {
        const [countResult] = await Chat.sequelize.query(
          `SELECT COUNT(*) as count FROM chats c 
           WHERE (c.reciver_id = ?) 
           AND c.job_id = ? AND c.status = ?`,
          {
            replacements: [user_id, job.job_id, "unread"],
            type: Chat.sequelize.QueryTypes.SELECT,
          }
        );
        baseData.count_unread = parseInt(countResult.count) || 0;
      }
      if(status == "closed"){
        const didIrateResults = await Rate.sequelize.query(
            `SELECT * FROM rates r WHERE r.job_id = ? AND r.rated_by_user_id = ?`,
            {
              replacements: [job.job_id, user_id],
              type: Rate.sequelize.QueryTypes.SELECT,
            }
          );
          console.log("rates: ",didIrateResults)

          baseData.iRateThisJob = didIrateResults.length > 0;
      }

      return baseData;
    }));

    res.status(200).json(transformedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



export default getJobStatus;