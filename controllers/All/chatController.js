import { Sequelize, where } from 'sequelize';
import {Rate, sequelize,Job, Chat, MyJob } from '../../models/index.js'; // Assuming you have a Job model// import Op
//import { send } from 'process';

const getChats = async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { job_id,partner_id } = req.query;
  
      const chat = await Chat.sequelize.query(
        `SELECT * FROM chats c RIGHT JOIN jobs j ON j.job_id = c.job_id WHERE (c.sender_id = ? or c.reciver_id = ?) and (c.sender_id = ? or c.reciver_id = ?) AND c.job_id = ?`,
        {
          replacements: [user_id,user_id,partner_id,partner_id, job_id],
          type: Chat.sequelize.QueryTypes.SELECT,
        }
      );
      
      res.status(200).json(chat);
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to get chats.' });
    }
  };
  

const createChat = async (req, res) => {
    try {
       const { user_type,user_id } = req.user;
       var sender_id = user_id
       let jobExists = false;
        const { reciver_id, job_id, message, status = 'unread' } = req.body.message;

        if (!user_id || !reciver_id || !job_id || !message) {
            return res.status(400).json({ 
                message: 'Missing required fields: sender_id, reciver_id, job_id, and message are required' 
            });
        }

        if(user_type === 'promoter'){
           jobExists  = await sequelize.query(
                'SELECT * FROM jobs WHERE job_id = ? and user_id = ? and status = ?',
                {
                    replacements: [job_id,user_id,'active'],
                    type: sequelize.QueryTypes.SELECT
                }
            );
        }else if(user_type === 'influencer'){
          jobExists  = await sequelize.query(
            'SELECT * FROM my_jobs WHERE job_id = ? and user_id = ? and status = ?',
            {
                replacements: [job_id,user_id, 'approve'],
                type: sequelize.QueryTypes.SELECT
            });
        }else{
          return res.status(400).json({ 
            message: 'Invalid userType. The specified job does not exist.' 
        });
        }

        if (jobExists.length === 0) {
            return res.status(400).json({ 
                message: 'Invalid job_id. The specified job does not exist. '+req.user+" "+job_id+" "+user_id 
            });
        }

        // Insert chat into the chats table
        const createdChat = await Chat.create({
            sender_id,
            reciver_id,
            job_id,
            message,
            status
        });
        req.io.emit(reciver_id+"new_message", createdChat);
        res.status(201).json(createdChat);
    } catch (err) {
        console.error("Error creating chat:", err);
        res.status(500).json({ 
            message: 'Failed to create chat message. Internal server error.',
            error: err.errors?.map(e => e.message) || err.message 
        });
    }
};

const ClearChats = async (req, res) => {
    try {
       const { user_id } = req.user;
       const { job_id } = req.query;
       console.log("deleting chat: ",req.query);

      const response =   await Chat.destroy({
            where: {
              job_id: job_id,
              [Sequelize.Op.or]: [
                { sender_id: user_id },
                { reciver_id: user_id }
              ]
            }
          });

        res.status(201).json(response);
    } catch (err) {
        console.error("Error creating chat:", err);
        res.status(500).json({ 
            message: 'Failed to create chat message. Internal server error.',
            error: err.errors?.map(e => e.message) || err.message 
        });
    }
};
 // ensure you import Sequelize for Op

const ReadAll = async (req, res) => {
  try {
    const { user_id,user_type } = req.user;
    const { job_id, partner_id } = req.body;
    var response = null;
        if(user_type === 'influencer'){
        response =   await Chat.update(
          { status: 'read' },  // values to update
          {
            where: {
              job_id: job_id,
              reciver_id: user_id 
            }
          }
        );
    }else{
     response =  await Chat.update(
      { status: 'read' },  // values to update
      {
        where: {
          job_id: job_id,
          reciver_id: user_id,
          sender_id: partner_id,
        }
      }
    );
    }

    res.status(201).json(response);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({
      message: 'Failed to update read status message. Internal server error.',
      error: err.errors?.map(e => e.message) || err.message
    });
  }
};


//Close Chat
const closeChat = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    const { user_id } = req.user;
    const { rated_user_id, comment, rate, job_id } = req.body.closeChatData;

    // Check if already closed
    // const chkClosed = await MyJob.findOne({
    //   where: { job_id, user_id, status: "closed" },
    //   transaction: t
    // });

    // if (chkClosed) {
    //   await t.rollback();
    //   return res.status(400).json({ message: "Job already closed" });
    // }

    // Check if already rated
    const chkAlreadyRated = await Rate.findOne({
      where: {
        job_id,
        rated_by_user_id: user_id,
        rated_user_id
      },
      transaction: t
    });

    if (chkAlreadyRated) {
      await t.rollback();
      return res.status(400).json({ message: "You already rated this user" });
    }


    // Insert rating
    const rateUser = await Rate.create({
      rated_user_id,
      rated_by_user_id: user_id,
      rate,
      comment,
      job_id
    }, { transaction: t });

    console.log("did i reated: ",rateUser)

    // Update job status
    const updateResult = await MyJob.update(
      { status: 'closed' },
      {
        where: { user_id, job_id },
        transaction: t
      }
    );

    // if (!updateResult[0]) {
    //   await t.rollback();
    //   return res.status(500).json({ message: "Failed to update job status" });
    // }

    await t.commit(); // All successful, commit
    res.status(201).json({ message: "Chat closed and rated successfully" });

  } catch (err) {
    await t.rollback(); // Something failed, rollback
    console.error("Transaction failed:", err);
    res.status(500).json({
      message: "Internal server error during closeChat",
      error: err.errors?.map(e => e.message) || err.message
    });
  }
};


export default {getChats, createChat, ClearChats, ReadAll,closeChat};
