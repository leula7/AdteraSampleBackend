
import  sequelize from "../../config/db.js";
import { Chat } from "../../models/index.js";

const getAcceptedApplicants = async (req, res) => {
  try {
    const { user_id,user_type } = req.user;
    const { status,jobId, limit, offset } = req.query;

    if (user_type !== 'promoter') {
      return res.status(403).json({ message: 'Access denied. Only Promoters can view all thier Accepted Applicants.' });
    }

    const results = await sequelize.query(`SELECT 
                    jobs.user_id,
                    jobs.job_id,
                    jobs.*,
                    my_job_id,
                    my_jobs.status AS applicant_job_status,
                    applicant.email AS applicant_email,
                    applicant.phone_number as applicant_phone_number,
                    applicant.username AS applicant_username,
                    applicant.bio AS bio,
                    applicant.user_id AS applicant_user_id
                    FROM 
                        jobs
                    JOIN 
                        my_jobs ON jobs.job_id = my_jobs.job_id  -- matching job with applicant
                    JOIN 
                        users AS applicant ON my_jobs.user_id = applicant.user_id
                        WHERE jobs.user_id = ? and jobs.job_id = ? and my_jobs.status = ?`,
                    {
                        replacements: [user_id,jobId,status],
                        type: sequelize.QueryTypes.SELECT
                    });

    const transformedJobs = await Promise.all(results.map(async (result) => {
      
      const baseData = {
          applicant_email: result.applicant_email,
          applicant_job_status: result.applicant_job_status,
          applicant_phone_number: result.applicant_phone_number,
          applicant_user_id: result.applicant_user_id,
          applicant_username: result.applicant_username,
          bio: result.bio,
          job_catagory_id: result.job_catagory_id,
          job_created_date: result.job_created_date,
          job_description: result.job_description,
          job_id: result.job_id,
          job_price: result.job_price,
          my_job_id: result.my_job_id,
          required_connect: result.required_connect,
          status: result.status,
          title: result.title,
          user_id: result.user_id
      };

      

        const [countResult] = await Chat.sequelize.query(
          `SELECT COUNT(*) as count FROM chats c 
           WHERE (c.reciver_id = ?) 
           AND c.job_id = ? AND sender_id = ?  AND c.status = ?`,
          {
            replacements: [result.user_id, result.job_id,result.applicant_user_id, "unread"],
            type: Chat.sequelize.QueryTypes.SELECT,
          }
        );
        baseData.count_unread = parseInt(countResult.count) || 0;
     console.log("countResult",countResult);


      return baseData;
    }));

    
    res.status(200).json(transformedJobs);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error while fetching feedbacks.' });
  }
};

export default getAcceptedApplicants;