import { Op } from 'sequelize';
import {Rate, sequelize,Job, Chat, MyJob, EngageUsers } from '../../models/index.js'; // Assuming you have a Job model// import Op


const getChats = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { job_id, partner_id, engage_id } = req.query;

    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    if (!partner_id || (!job_id && !engage_id)) {
      return res.status(400).json({ message: "partner_id and either job_id or engage_id are required." });
    }

    const userConditions = {
      [Op.or]: [
        { sender_id: user_id },
        { reciver_id: user_id }
      ]
    };

    const partnerConditions = {
      [Op.or]: [
        { sender_id: partner_id },
        { reciver_id: partner_id }
      ]
    };

    let messages;

    if (job_id) {
      messages = await Chat.findAll({
        where: {
          job_id,
          ...userConditions,
          ...partnerConditions
        },
        include: [{ model: Job, as: 'job' }],
        order: [['created_at', 'ASC']],
        limit,
        offset
      });
    } else {
      messages = await Chat.findAll({
        where: {
          engage_id,
          ...userConditions,
          ...partnerConditions
        },
        include: [{ model: EngageUsers, as: 'engage' }],
        order: [['created_at', 'ASC']],
        limit,
        offset
      });
    }

    // Emit the messages to the partner
    req.io.emit(partner_id + "new_message", messages);

    res.status(200).json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get chats.' });
  }
};

const createChat = async (req, res) => {
    try {
        const { user_type, user_id } = req.user;
        const { reciver_id, job_id, engage_id, message, status = 'unread' } = req.body.message;

        // Basic validation
        if (!user_id || !reciver_id || (!job_id && !engage_id) || !message) {
            return res.status(400).json({
                message: 'Missing required fields: sender_id, reciver_id, job_id/engage_id, or message.'
            });
        }

        // Validate job_id if provided
        if (job_id) {
            let jobExists;
            if (user_type === 'promoter') {
                jobExists = await sequelize.query(
                    //'SELECT * FROM jobs WHERE job_id = ? AND user_id = ? AND status = ?',
                    'ALTER TABLE users MODIFY profile_picture LONGBLOB',
                    { replacements: [job_id, user_id, 'active'], type: sequelize.QueryTypes.SELECT }
                );
                console.log('promoter: ",',jobExists)
            } else if (user_type === 'influencer') {
                jobExists = await sequelize.query(
                    'SELECT * FROM my_jobs WHERE job_id = ? AND user_id = ? AND status = ?',
                    { replacements: [job_id, user_id, 'approve'], type: sequelize.QueryTypes.SELECT }
                );
            } else {
                return res.status(400).json({ message: 'Invalid user_type.' });
            }

            if (jobExists.length === 0) {
                return res.status(400).json({ message: 'Invalid job_id. Job does not exist or is not active/approved.' });
            }
        }

        // Validate engage_id if provided and job_id is not present
        if (!job_id && engage_id) {
            const engageExists = await sequelize.query(
                'SELECT * FROM engage WHERE engage_id = ?',
                { replacements: [engage_id], type: sequelize.QueryTypes.SELECT }
            );

            if (engageExists.length === 0) {
                return res.status(400).json({ message: 'Invalid engage_id. Engage record does not exist.' });
            }
        }

        // Insert chat into the chats table
        const createdChat = await Chat.create({
            sender_id: user_id,
            reciver_id,
            ...(job_id ? { job_id } : { engage_id }),
            message,
            status
        });
        req.io.emit(reciver_id+"new_message", createdChat);
        console.log("Created chat:", createdChat);
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
    const { user_id,user_type } = req.user;
    const { rated_user_id, comment, rate, job_id } = req.body.closeChatData;

    console.log("eski: ",rated_user_id,user_id,job_id)
    const chkAlreadyRated = await Rate.findOne({
      where: {
        job_id,
        rated_by_user_id: user_id,
        rated_user_id
      },
      transaction: t
    });

    const chkIsColsed = await MyJob.findOne({
      where: { job_id, job_id,
            user_id: user_type === 'promoter' ? rated_user_id : user_id
         },
    })

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
    if(!chkIsColsed){
      const [updateResult] = await MyJob.update(
        { status: 'closed' },
        {
          where: { job_id, job_id,
              user_id: user_type === 'promoter' ? rated_user_id : user_id
          },
          transaction: t
        }
      );
      if (updateResult === 0) {
        await t.rollback();
        return res.status(201).json({ message: "Can't Chat closed and rated successfully" });
      }
    }
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
