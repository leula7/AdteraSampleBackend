import express from 'express';
import { addplatformfollowers, deelteplatformfollowers, deleteAchievements, deleteExperienceVideos,
         deleteSkills, deleteSocialMedia, OtherProfileController, ProfileController, updateAchievements,
         updateExperienceVideos, updateProfile, updateSkills, updateSocialMedia } from '../controllers/All/ProfileController.js';

import authController from '../controllers/All/authController.js';
import authenticateUser from '../controllers/All/authenticateUser.js';
import refreshToken from '../controllers/All/refreshToken.js';
import chatController from '../controllers/All/chatController.js';
import ControlleConnect from '../controllers/All/ControlleConnect.js';
import FeedBackController from '../controllers/All/FeedBackController.js';


import getAllJobs from '../controllers/InfluencerController/getAllJobs.js';
import ApplyNowController from '../controllers/InfluencerController/ApplyNowController.js';

import getAllUsers from '../controllers/promoterController/getAllUsers.js';
import getJobStatus from '../controllers/promoterController/getJobStatus.js';
import getCreatedJobs from '../controllers/promoterController/getCreatedJobs.js';
import getAcceptedApplicants from '../controllers/promoterController/getAcceptedApplicants.js';

import ConnectController from '../controllers/adminController/ConnectController.js';
import getAllFeedBacks from '../controllers/adminController/getAllFeedBacks.js';
import usercontroler from '../controllers/adminController/usercontroler.js';
import { getStats } from '../controllers/adminController/statsController.js';
import updateUserJobsStatus from '../controllers/promoterController/userJobsStatusController.js';
import {CreateJob,getJobPrice} from '../controllers/promoterController/createJob.js';
import getJobCatagories from '../controllers/promoterController/getJobCatagories.js';
import UpdateJob from '../controllers/promoterController/UpdateJob.js';
import { userNameexist } from '../controllers/All/additionalFunctions.js';
import ReportController from '../controllers/All/ReportController.js';
import PayWithTeleBirrController from '../controllers/Payment/PayWithTeleBirrController.js';
import paymanetResponse from '../controllers/Payment/Chapa/test.js';
import FavoriteController from '../controllers/All/FavoriteController.js';
import { EmailVerificationController, forgetpass, ForgetPassVerificationController, getSececretCode } from '../controllers/All/emailVerificationController.js';
import { changeForgetPassword, changePassword } from '../controllers/All/PasswordController.js';
import PaywithChapa from '../controllers/Payment/Chapa/PaywithChapaController.js';
import verifyChapaPayment from '../controllers/Payment/Chapa/verifyChapaPayment.js';


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/influencers', authenticateUser, getAllUsers); // Get all users - Only influencers
router.get('/jobs', authenticateUser, getAllJobs);


router.get('/connects', authenticateUser, ConnectController);
router.post('/feedback', authenticateUser, FeedBackController);
router.post('/report', authenticateUser, ReportController);
router.post('/paywithtelebirr', authenticateUser, PayWithTeleBirrController);
router.post('/paywithchapa', authenticateUser, PaywithChapa);
router.post('/verifychapapayment', verifyChapaPayment);
router.get('/jobstatus', authenticateUser, getJobStatus); // Get all jobs - Only influencers


 // Update profile - Only influencers
router.get('/profile', authenticateUser, ProfileController);
router.get('/otherprofile', authenticateUser, OtherProfileController);
router.put('/updateprofile', authenticateUser, updateProfile);
router.put('/updateachievements', authenticateUser, updateAchievements); 
router.delete('/deleteachivement', authenticateUser, deleteAchievements);

router.post('/addplatformfollowers', authenticateUser, addplatformfollowers);
router.delete('/deleteplatformfollowers', authenticateUser, deelteplatformfollowers);

router.put('/changepassword', authenticateUser, changePassword); 

router.put('/updateskill', authenticateUser, updateSkills);
router.delete('/deleteskill', authenticateUser, deleteSkills);

router.put('/updatesocialmedia', authenticateUser, updateSocialMedia); // Update social media - Only influencers
router.delete('/deletesocialmedia', authenticateUser, deleteSocialMedia);

router.put('/updateExperienceVideos', authenticateUser, updateExperienceVideos); // Update social media - Only influencers
router.delete('/deleteExperienceVideos', authenticateUser, deleteExperienceVideos);
 // Delete social media - Only influencers

 router.post('/applynow', authenticateUser, ApplyNowController);

 router.get('/chats', authenticateUser, chatController.getChats);
 router.post('/sendmessage', authenticateUser, chatController.createChat)
 router.delete('/clearchat', authenticateUser, chatController.ClearChats);
 router.put('/readall', authenticateUser, chatController.ReadAll);
  router.post('/closechat', authenticateUser, chatController.closeChat)

router.post('/createconnects', authenticateUser, ControlleConnect.createConnect);
router.put('/transconnect', authenticateUser, ControlleConnect.transConnect); // Create a new connect package - Only admin

router.put('/updateconnects', authenticateUser, ControlleConnect.updateConnect); // Create a new connect package - Only admin
router.get('/stats', authenticateUser, getStats);

router.post('/feedback', authenticateUser, FeedBackController);
router.get('/feedbacks', authenticateUser, getAllFeedBacks); // Get all feedbacks - Only influencers and compan
//router.get('/userss', authenticateUser, usercontroler);
router.put('/update-user-status', authenticateUser, usercontroler.updateUserStatus);
router.get('/userss',authenticateUser, usercontroler.getUsers);

router.get('/createdjobs', authenticateUser, getCreatedJobs);
router.post('/createjob', authenticateUser, CreateJob);
router.get('/getjobprice', authenticateUser, getJobPrice);
router.put('/updateJob', authenticateUser, UpdateJob);
router.post('/refreshtoken',refreshToken);
router.post('/favorite',authenticateUser,FavoriteController);

router.post('/paymentResponse',paymanetResponse); // Handle payment response

router.get('/acceptedapplicants',authenticateUser,getAcceptedApplicants);
router.get('/getjobcatagories',authenticateUser,getJobCatagories);
router.put('/updateUserJobsStatus', authenticateUser, updateUserJobsStatus);

router.get('/username/exist', userNameexist);
router.post('/verifyemail', authenticateUser,EmailVerificationController);

router.post('/verifyForgetPass',ForgetPassVerificationController);
router.post('/getcode', authenticateUser,getSececretCode);
router.post('/forgetpass',forgetpass);
router.put('/changeforgetpassword', changeForgetPassword);
 // Create a new connect package - Only admin
export default router;