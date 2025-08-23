import { col, fn } from 'sequelize';
import { Rate, User, UserType, SocialMedia, Achievement, Experience, Skill, Followers, Job, BorrowedConnect, MyJob } from '../../models/index.js';
import {sequelize} from '../../models/index.js'; // Add SocialMedia model

const ProfileController = async (req, res) => {
  try {
    const { user_id } = req.user;
    var id = user_id
    const filter = JSON.parse(req.query.filter || '{}');
    const { basic, rating, social, achievements, experience, skills, user_ids,
            follower, count_job,borrowed_connect,count_my_job,job_id } = filter;
    const attributeFields = basic ? Object.keys(basic) : undefined;
    console.log("filter: ", filter);
    
    if(user_ids){
      id = user_ids;
      console.log("other user id: ",id)
    }else{
      console.log("owen Id: ",id);
    }
    
    if(basic){
      var user = await User.findOne({
      where: { user_id: id },
      attributes: attributeFields,
      include: {
        model: UserType,
        attributes: ['user_type'],
    },
      raw: true,
      nest: true
    });
    }else{
      console.log('Basic attribute not found.')
      return res.status(404).json({ message: 'Basic attribute not found.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    //Fetch Borrowed Connect Value
    if(borrowed_connect){
      var borrowed_connects = await BorrowedConnect.findOne({
      where: { borrowed_user_id: user_id },
      attributes: [[fn('SUM', col('borrowed_val')), 'borrowed_val']]
    });
    }
    // Fetch the user's rating
    if(rating){
      var rate = await Rate.findOne({
      where: { rated_user_id: id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rate')), 'rate']
      ],
      raw: true,
    });
    }

    if(social){
      var socialMedia = await SocialMedia.findAll({
      where: { user_id: id },
      attributes: ['social_media_type', 'social_link','social_media_id'],  // Replace with the actual attributes of the SocialMedia model
      raw: true
    });
    }

   if(follower){
    console.log("follower id: ",id)
      var followers = await Followers.findAll({
      where: { user_id: id },
      raw: true
    });
   }else{
    console.log("follower id: not found" );
   }

    if(achievements){
      var Achievements = await Achievement.findAll({
      where: { user_id: id },
      attributes: ['achievement', 'achievement_id'],  // Replace with the actual attributes of the SocialMedia model
      raw: true
    });
    }

    if(experience){
      var ExperienceViedo = await Experience.findAll({
      where: { user_id: id },
      attributes: ['experience_link', 'experience_id'],  // Replace with the actual attributes of the SocialMedia model
      raw: true
    });
    }

    if(skills){
      var Skills = await Skill.findAll({
      where: { user_id: id },
      attributes: ['skill', 'skill_id'],  // Replace with the actual attributes of the SocialMedia model
      raw: true
    });
    }

    if(count_job){
      var job_count = await Job.count({
      where: {
        status: 'active',
        user_id: id,
      },
    });
    }else{
      console.log("not found");
    }

    if(count_my_job && job_id){
      console.log("counting the applicants")
      var applicant_number = await MyJob.count({
        where: {
          job_id
        }
      })
    }

    const formattedUser = {
      ...user,
      rate: rate ? parseFloat(rate.rate).toFixed(3) : null,
      user_type: user.UserType?.user_type || null,
      followers: followers,
      social_media: socialMedia,
      achievements: Achievements,
      experienceVideos: ExperienceViedo,
      skills: Skills,
       job_count,
       borrowed_connects,
       applicant_number
    };
    res.status(200).json(formattedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const OtherProfileController = async (req, res) => {
  try {
    const { user_id } = req.query;

    const user = await User.findOne({
      where: { user_id },
      include: {
        model: UserType,
        attributes: ['user_type'],
      },
      raw: true,
      nest: true
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch the user's rating
    const rate = await Rate.findOne({
      where: { rated_user_id: user_id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rate')), 'rate']
      ],
      raw: true,
    });

    const formattedUser = {
      ...user,
      rate: rate ? parseFloat(rate.rate).toFixed(3) : null,
      user_type: user.UserType?.user_type || null,
    };

    res.status(200).json(formattedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { username,first_name,last_name,dob, phone_number,profile_picture, location, bio, base_price,email } = req.body;
    console.log("req.body", req.body);
    // Update user profile
    const updatedUser = await User.update(
      { username,first_name,last_name,dob, phone_number,profile_picture, location, bio,base_price,email },
      { where: { user_id } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const updateSocialMedia = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { social_media_type, social_link } = req.body;

    // Update or create social media account
    const [socialMedia, created] = await SocialMedia.upsert(
      { user_id, social_media_type, social_link },
      { returning: true }
    );

    res.status(200).json({ message: created ? 'Social media account created successfully.' : 'Social media account updated successfully.', socialMedia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const deleteSocialMedia = async (req, res) => { 
  try {
    const { user_id } = req.user;
    const { social_media_id } = req.params; // Assuming you pass the social media ID in the URL

    // Delete social media account
    const deleted = await SocialMedia.destroy({
      where: { user_id, social_media_id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Social media account not found.' });
    }

    res.status(200).json({ message: 'Social media account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const updateAchievements = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { user_id } = req.user;
    const { achievement, achievement_id } = req.body;

    // Must include achievement_id in the values if you want it to update that specific row
    const [achievementRecord, created] = await Achievement.upsert(
      {
        achievement_id,
        user_id,
        achievement,
      },
      { returning: true }
    );

    res.status(200).json({
      message: created
        ? 'Achievement created successfully.'
        : 'Achievement updated successfully.',
      achievementRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteAchievements = async (req, res) => { 
  try {
    const { user_id } = req.user;
    const { achievement_id } = req.body; // Assuming you pass the social media ID in the URL

    // Delete social media account
    const deleted = await Achievement.destroy({
      where: { user_id, achievement_id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Achievement not found.' });
    }

    res.status(200).json({ message: 'Achievement deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const updateExperienceVideos = async (req, res) => {
  try {
    console.log("i got you")
    const { user_id } = req.user;
    const { experience_link } = req.body;

    // Update or create experience video
    const [experienceVideo, created] = await Experience.upsert(
      { user_id, experience_link },
      { returning: true }
    );

    res.status(200).json({ message: created ? 'Experience video Added successfully.' : 'Experience video updated successfully.', experienceVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const deleteExperienceVideos = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { experience_id } = req.query; // Assuming you pass the social media ID in the URL

    // Delete social media account
    const deleted = await Experience.destroy({
      where: { user_id, experience_id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Experience video not found.' });
    }

    res.status(200).json({ message: 'Experience video deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const updateSkills = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { skill,skill_id } = req.body;
    const response = await Skill.upsert(
      { user_id,skill,skill_id },
      { where: { skill_id } }
    );
    res.status(200).json({ message: response ? 'Skill created successfully.' : 'Skill updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const deleteSkills = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { skill_id } = req.body; // Assuming you pass the social media ID in the URL
    const deleted = await Skill.destroy({
      where: { user_id, skill_id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Skill not found.' });
    }

    res.status(200).json({ message: 'Skill deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const addplatformfollowers = async (req, res) => {
    try {
        console.log("am i creating platform followers")
        const {user_id,user_type} = req.user;
        const data = req.body.newPlatformFollower;
        const formatedData = {
          ...data,
          user_id: user_id,
        }

        if (user_type !== 'influencer') {
            return res.status(404).json({ message: user_type+' Can not add Platform Followers Count' });
        }
        const createFollowers = await Followers.upsert(formatedData);
        if (createFollowers) {
        res.status(201).json({message: 'Followers record created successfully', followers: createFollowers});
      } else {
        res.status(400).json({ error: "Updated to create followers record" });
      }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
};

const deelteplatformfollowers = async (req, res) => {
    try {
        const {user_id,user_type} = req.user;
        const {followers_id} = req.query;
        console.log("i'm i deleting it: ",followers_id," ",user_id)

        if (user_type !== 'influencer') {
            return res.status(404).json({ message: user_type+' Can not add Platform Followers Count' });
        }
        const deletePlatformFollowers = await Followers.destroy({
          where: {user_id,followers_id}
        });
        if (deletePlatformFollowers) {
        res.status(201).json({message: 'Followers record Deleted successfully'});
      } 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Apply. Internal server error.' });
    }
};

export {
  ProfileController,
  deelteplatformfollowers,
  addplatformfollowers,
  updateProfile,
  updateSocialMedia,
  deleteSocialMedia,
  updateAchievements,
  deleteAchievements,
  updateExperienceVideos,
  deleteExperienceVideos,
  updateSkills,
  deleteSkills,
  OtherProfileController
};
