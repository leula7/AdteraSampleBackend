import sequelize from '../config/db.js';
import initUser from './user.js';
import initUserType from './userType.js';
import initSocialMedia from './socialMedia.js';
import initExperience from './experience.js';
import initAchievement from './achievement.js';
import initConnect from './connect.js';
import initJobCategory from './jobCatagory.js';
import initJob from './job.js';
import initJobPrice from './jobPrice.js';
import initMyJob from './myJob.js';
import initBorrowedConnect from './borrowedConnect.js';
import initRate from './rate.js';
import initChat from './chat.js';
import initTransaction from './transaction.js';
import initFeedback from './feedback.js';
import initReport from './report.js';
import initSkill from './skills.js';
import initFollowers from './followers.js';
import initFave from './favorite.js'; // Import the favorite model
import initEngageUser from './engageuser.js';
import initAdvertise from './advertise.js';
import initAdvertImages from './advert_images.js';
// Initialize models
const User = initUser(sequelize);
const UserType = initUserType(sequelize);
const SocialMedia = initSocialMedia(sequelize);
const Experience = initExperience(sequelize);
const Achievement = initAchievement(sequelize);
const Connect = initConnect(sequelize);
const JobCategory = initJobCategory(sequelize);
const Job = initJob(sequelize);
const JobPrice = initJobPrice(sequelize);
const MyJob = initMyJob(sequelize);
const BorrowedConnect = initBorrowedConnect(sequelize);
const Rate = initRate(sequelize);
const Chat = initChat(sequelize);
const Followers = initFollowers(sequelize);
const Transaction = initTransaction(sequelize);
const Feedback = initFeedback(sequelize);
const Skill = initSkill(sequelize);
const Report = initReport(sequelize);
const Favorite = initFave(sequelize); // Initialize the favorite model
const EngageUsers = initEngageUser(sequelize); // Initialize the engage model
const Advertise = initAdvertise(sequelize)
const AdvertiseImage = initAdvertImages(sequelize);

// User Associations
User.hasOne(UserType, { foreignKey: 'user_id' });
UserType.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SocialMedia, { foreignKey: 'user_id' });
SocialMedia.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Followers, { foreignKey: 'user_id' });
Followers.belongsTo(User, { foreignKey: 'user_id' });
// In your model definitions file (where you set up relationships)

// Correct way to associate Chat with Job
Chat.belongsTo(Job, {
  foreignKey: 'job_id',  // The foreign key in the Chat table
  targetKey: 'job_id'    // The primary key in the Job table (assuming job_id is PK)
});

Job.hasMany(Chat, {
  foreignKey: 'job_id',  // The foreign key in the Chat table
  sourceKey: 'job_id'    // The primary key in the Job table
});

User.hasMany(Experience, { foreignKey: 'user_id' });
Experience.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Skill, { foreignKey: 'user_id' });
Skill.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Achievement, { foreignKey: 'user_id' });
Achievement.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Connect, { foreignKey: 'user_id' });
Connect.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(JobPrice, { foreignKey: 'user_id' });
JobPrice.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Job, { foreignKey: 'user_id' });
Job.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(MyJob, { foreignKey: 'user_id' });
MyJob.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(BorrowedConnect, { foreignKey: 'borrowed_user_id' });
BorrowedConnect.belongsTo(User, { foreignKey: 'borrowed_user_id' });

User.hasMany(Rate, { foreignKey: 'rated_user_id', as: 'ReceivedRatings' });
User.hasMany(Rate, { foreignKey: 'rated_by_user_id', as: 'GivenRatings' });
Rate.belongsTo(User, { foreignKey: 'rated_user_id', as: 'RatedUser' });
Rate.belongsTo(User, { foreignKey: 'rated_by_user_id', as: 'RatedByUser' });

User.hasMany(Chat, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Chat, { foreignKey: 'reciver_id', as: 'ReceivedMessages' });
Chat.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Chat.belongsTo(User, { foreignKey: 'reciver_id', as: 'Receiver' });

Chat.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });
Job.hasMany(Chat, { foreignKey: 'job_id', as: 'chats' });

Chat.belongsTo(EngageUsers, { foreignKey: 'engage_id', as: 'engage' });
EngageUsers.hasMany(Chat, { foreignKey: 'engage_id', as: 'chats' });


User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Report, { foreignKey: 'reporter_id' });
Report.belongsTo(User, { foreignKey: 'reporter_id' });

// Job Associations
Job.belongsTo(JobCategory, { foreignKey: 'job_catagory_id' });
JobCategory.hasMany(Job, { foreignKey: 'job_catagory_id' });

// Job.belongsTo(Connect, { foreignKey: 'connect_id' });
// Connect.hasMany(Job, { foreignKey: 'connect_id' });

Job.hasMany(MyJob, { foreignKey: 'job_id' });
MyJob.belongsTo(Job, { foreignKey: 'job_id' });

Job.hasMany(Favorite, { foreignKey: 'fave_job_id' });
Favorite.belongsTo(Job, { foreignKey: 'fave_job_id' });

Job.hasMany(BorrowedConnect, { foreignKey: 'job_id' });
BorrowedConnect.belongsTo(Job, { foreignKey: 'job_id' });

Job.hasMany(Rate, { foreignKey: 'job_id' });
Rate.belongsTo(Job, { foreignKey: 'job_id' });

Connect.hasMany(Transaction, { foreignKey: 'connect_id' });
Transaction.belongsTo(Job, { foreignKey: 'connect_id' });

// One user can engage many users
User.hasMany(EngageUsers, { foreignKey: 'engager_user_id', as: 'EngagerRelations' });
EngageUsers.belongsTo(User, { foreignKey: 'engager_user_id', as: 'Engager' });

// One user can be engaged by many users
User.hasMany(EngageUsers, { foreignKey: 'engaged_user_id', as: 'EngagedRelations' });
EngageUsers.belongsTo(User, { foreignKey: 'engaged_user_id', as: 'Engaged' });

Advertise.hasMany(AdvertiseImage, { foreignKey: 'advert_id' });
AdvertiseImage.belongsTo(Advertise, { foreignKey: 'advert_id' });


// Export all models individually
export {
  sequelize,
  EngageUsers,
  Followers,
  Favorite,
  User,
  Skill,
  UserType,
  SocialMedia,
  Experience,
  Achievement,
  Connect,
  JobCategory,
  Job,
  JobPrice,
  MyJob,
  BorrowedConnect,
  Rate,
  Chat,
  Transaction,
  Feedback,
  Report
};