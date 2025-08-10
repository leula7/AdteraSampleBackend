import { Op } from 'sequelize';
import { Favorite, Job, MyJob, Rate, Report } from '../../models/index.js';
import { sequelize } from '../../models/index.js';

const getAllJobs = async (req, res) => {
  try {
    const { user_id, user_type } = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    if (user_type !== 'influencer') {
      return res.status(403).json({ message: 'Access denied. Only companies can view all jobs.' });
    }

    const assignedJobIds = await MyJob.findAll({
      where: { user_id },
      attributes: ['job_id'],
      raw: true,
    });
    const jobIdsToExclude = assignedJobIds.map(job => job.job_id);

    const jobs = await Job.findAll({
      where: {
        job_id: {
          [Op.notIn]: jobIdsToExclude,
        },
        status: 'active',
      },
      limit,
      offset,
      order: [['job_created_date', 'DESC']],
    });

    const jobsEnriched = await Promise.all(
      jobs.map(async (job) => {
        const item = job.toJSON(); // one conversion only

        // AVG Rate
        const avgRateResult = await Rate.findOne({
          where: { rated_user_id: item.user_id },
          attributes: [[sequelize.fn('AVG', sequelize.col('rate')), 'avg_rate']],
          raw: true,
        });
        item.rate = avgRateResult?.avg_rate ? parseFloat(avgRateResult.avg_rate) : 0;

        // Count MyJob
        item.count_my_job = await MyJob.count({
          where: { job_id: item.job_id },
        });

        // Reported
        const reported = await Report.findOne({
          where: { job_id: item.job_id, reporter_id: user_id },
        });
        item.didReported = !!reported;

        // Favorited
        const favorited = await Favorite.findOne({
          where: { fave_job_id: item.job_id, user_id },
        });
        item.didfavorited = !!favorited;

        return item;
      })
    );
    res.status(200).json(jobsEnriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'get all jobs Internal server error: ' + err.message });
  }
};

export default getAllJobs;
