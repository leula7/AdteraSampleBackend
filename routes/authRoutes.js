import express from 'express';
import { rateLimit } from 'express-rate-limit';

// Controllers

// Profile
import {
  addplatformfollowers,
//  changePassword,
  deelteplatformfollowers,
  deleteAchievements,
  deleteExperienceVideos,
  deleteSkills,
  deleteSocialMedia,
  OtherProfileController,
  ProfileController,
  updateAchievements,
  updateExperienceVideos,
  updateProfile,
  updateSkills,
  updateSocialMedia
} from '../controllers/All/ProfileController.js';

// Auth
import authController from '../controllers/All/authController.js';
import authenticateUser from '../controllers/All/authenticateUser.js';
import refreshToken from '../controllers/All/refreshToken.js';
import { changeForgetPassword } from '../controllers/All/PasswordController.js';
import { EmailVerificationController, forgetpass, ForgetPassVerificationController, getSececretCode } from '../controllers/All/emailVerificationController.js';

// Chat
import chatController from '../controllers/All/chatController.js';

// Connects
import ControlleConnect from '../controllers/All/ControlleConnect.js';

// Feedback
import FeedBackController from '../controllers/All/FeedBackController.js';
import getAllFeedBacks from '../controllers/adminController/getAllFeedBacks.js';
import { markFeedbackSeen, deleteFeedback } from '../controllers/adminController/feedbackActions.js';

// Reports
import ReportController from '../controllers/adminController/Reportcontroller.js';

// Influencer & Promoter
import getAllJobs from '../controllers/InfluencerController/getAllJobs.js';
import ApplyNowController from '../controllers/InfluencerController/ApplyNowController.js';
import getAllUsers from '../controllers/promoterController/getAllUsers.js';
import getJobStatus from '../controllers/promoterController/getJobStatus.js';
import getCreatedJobs from '../controllers/promoterController/getCreatedJobs.js';
import getAcceptedApplicants from '../controllers/promoterController/getAcceptedApplicants.js';
import updateUserJobsStatus from '../controllers/promoterController/userJobsStatusController.js';
import { CreateJob, DeleteJob, getJobPrice } from '../controllers/promoterController/createJob.js';
import getJobCatagories from '../controllers/promoterController/getJobCatagories.js';
import UpdateJob from '../controllers/promoterController/UpdateJob.js';
import { EngageUser, getAllEngagedUsers, updateEngages } from '../controllers/promoterController/engageUser.js';

// Admin
import ConnectController from '../controllers/adminController/ConnectController.js';
import usercontroler, { getUsers, updateUserStatus } from '../controllers/adminController/usercontroler.js';
import { getStats } from '../controllers/adminController/statsController.js';
import { getAllAdminJobs, updateJobStatus } from '../controllers/adminController/adminController.js';
import { transactionController } from '../controllers/adminController/transactionController.js';

// Payment
import PayWithTeleBirrController from '../controllers/Payment/PayWithTeleBirrController.js';
import PaywithChapa from '../controllers/Payment/Chapa/PaywithChapaController.js';
import verifyChapaPayment from '../controllers/Payment/Chapa/verifyChapaPayment.js';
import paymanetResponse from '../controllers/Payment/Chapa/test.js';

// Favorites
import { FavoriteController, getAllFavorites } from '../controllers/All/FavoriteController.js';

// Additional
import { userNameexist } from '../controllers/All/additionalFunctions.js';
import userTransactionController from '../controllers/All/userTransactionController.js';

// Router
const router = express.Router();

// Rate limiter
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Auth routes
router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/refreshtoken', refreshToken);
router.post('/verifyForgetPass', ForgetPassVerificationController);
router.post('/forgetpass', forgetpass);
router.put('/changeforgetpassword', changeForgetPassword);

// Profile routes
router.get('/profile', authenticateUser, ProfileController);
router.get('/otherprofile', authenticateUser, OtherProfileController);
router.put('/updateprofile', authenticateUser, updateProfile);
router.put('/updateachievements', authenticateUser, updateAchievements);
router.delete('/deleteachivement', authenticateUser, deleteAchievements);
router.post('/addplatformfollowers', authenticateUser, addplatformfollowers);
router.delete('/deleteplatformfollowers', authenticateUser, deelteplatformfollowers);
//router.put('/changepassword', authenticateUser, changePassword);
router.put('/updateskill', authenticateUser, updateSkills);
router.delete('/deleteskill', authenticateUser, deleteSkills);
router.put('/updatesocialmedia', authenticateUser, updateSocialMedia);
router.delete('/deletesocialmedia', authenticateUser, deleteSocialMedia);
router.put('/updateExperienceVideos', authenticateUser, updateExperienceVideos);
router.delete('/deleteExperienceVideos', authenticateUser, deleteExperienceVideos);

// Chat routes
router.get('/chats', authenticateUser, chatController.getChats);
router.post('/sendmessage', authenticateUser, chatController.createChat);
router.delete('/clearchat', authenticateUser, chatController.ClearChats);
router.put('/readall', authenticateUser, chatController.ReadAll);
router.post('/closechat', authenticateUser, chatController.closeChat);

// Influencer & Promoter routes
router.get('/influencers', authenticateUser, getAllUsers);
router.get('/jobs', authenticateUser, getAllJobs);
router.get('/jobstatus', authenticateUser, getJobStatus);
router.post('/applynow', authenticateUser, ApplyNowController);
router.post('/engageUser', authenticateUser, EngageUser);
router.get('/engageusers', authenticateUser, getAllEngagedUsers);
router.put('/engagestatus', authenticateUser, updateEngages);
router.get('/createdjobs', authenticateUser, getCreatedJobs);
router.get('/acceptedapplicants', authenticateUser, getAcceptedApplicants);
router.get('/getjobcatagories', authenticateUser, getJobCatagories);
router.post('/createjob', authenticateUser, CreateJob);
router.put('/updateJob', authenticateUser, UpdateJob);
router.get('/getjobprice', authenticateUser, getJobPrice);
router.put('/updateUserJobsStatus', authenticateUser, updateUserJobsStatus);
router.delete('/deletejob', authenticateUser, DeleteJob);
// Admin routes
router.get('/adminjobs', authenticateUser, getAllAdminJobs);
router.get('/transactions', authenticateUser, transactionController);
router.get('/usertransactions', authenticateUser, userTransactionController);
router.put('/admin/jobs/:id/status', authenticateUser, updateJobStatus);
router.delete('/admin/jobs/:id', authenticateUser, updateUserStatus);
router.get('/admin/users', authenticateUser, getUsers);
router.put('/admin/users/:id/status', authenticateUser, updateUserStatus);
router.get('/stats', authenticateUser, getStats);
router.get('/reports', ReportController.getReports);
router.patch('/reports/:id', ReportController.updateReport);

// Feedback routes
router.post('/feedback', authenticateUser, FeedBackController);
router.get('/feedbacks', authenticateUser, getAllFeedBacks);
router.post('/getfeedback', authenticateUser, getAllFeedBacks);
router.get('/admingetfeedback', getAllFeedBacks);
router.put('/admin/feedbacks/seen', markFeedbackSeen);
router.delete('/admin/feedbacks/:id', authenticateUser, deleteFeedback);

// Connects routes
router.get('/connects', authenticateUser, ConnectController);
router.post('/createconnects', authenticateUser, ControlleConnect.createConnect);
router.put('/transconnect', authenticateUser, ControlleConnect.transConnect);
router.put('/updateconnects', authenticateUser, ControlleConnect.updateConnect);

// Payments
router.post('/paywithtelebirr', authenticateUser, PayWithTeleBirrController);
router.post('/paywithchapa', authenticateUser, PaywithChapa);
router.post('/verifychapapayment', verifyChapaPayment);
router.post('/paymentResponse', paymanetResponse);

// Favorites
router.post('/favorite', authenticateUser, FavoriteController);
router.get('/favorites', authenticateUser, getAllFavorites);

// Email verification
router.get('/username/exist', userNameexist);
router.post('/verifyemail', authenticateUser, EmailVerificationController);
router.post('/getcode', authenticateUser, getSececretCode);

// User management shortcuts
router.put('/update-user-status', authenticateUser, usercontroler.updateUserStatus);
router.get('/userss', authenticateUser, usercontroler.getUsers);

export default router;
