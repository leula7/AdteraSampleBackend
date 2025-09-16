import { col, fn, where } from 'sequelize';
import {  EngageUsers,Rate,User } from '../../models/index.js'; // Assuming you have the models for User and Job
import { findPrices } from '../All/additionalFunctions.js';

const EngageUser = async (req, res) => {
    try {
        const {user_id,user_type} = req.user;
        const {engaged_user_id,message} = req.body.engage;
        var required_connect = 0;
         if (user_type !== 'promoter') {
            return res.status(403).json({ message: 'Access denied. Only companies can Engage Infulencers.' });
        }
        const availableConnect = await User.findOne({ 
            where: { user_id } ,
            attributes: ['connect_val']
            });

      const averageRate = await Rate.findOne({
        where: { rated_user_id: engaged_user_id },
        attributes: [[fn("AVG", col("rate")), "avgRate"]],
        raw: true
    });
        if(averageRate.avgRate > 4.5){
            required_connect = 50
        }else if(averageRate.avgRate > 3.5){
            required_connect = 30
        }else if(averageRate.avgRate > 2.5){
            required_connect = 20
        }else{
            required_connect = 10
        }

        const formateddata = {
            engaged_user_id,
            engage_message: message,
            engager_user_id: user_id,
        };
        
        const [updateConnect] = await User.update({
            connect_val: availableConnect.connect_val - required_connect
        },{
            where: { user_id }
        });

        if(updateConnect == 1){
            const response = await EngageUsers.create(formateddata)
            res.status(201).json({ message: 'Engagement successfully.'});
        }else{
            console.log("updating: ",updateConnect)
            res.status(400).json({ message: 'Engagement failed.' });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create Engage. Internal server error.' });
    }
};

const getAllEngagedUsers = async (req, res) => {
  try {
    const { user_id, user_type } = req.user;
    const { limit, offset, status } = req.query;
    console.log("engaging: ",req.query);

    // Decide which field and alias to use dynamically
    const isPromoter = user_type === "promoter";
    const where = isPromoter
      ? { engager_user_id: user_id, status }
      : { engaged_user_id: user_id, status };

    const include = [
      {
        model: User,
        as: isPromoter ? "Engaged" : "Engager",
        attributes: ["username", "base_price", "bio"],
        required: false, // LEFT JOIN
      },
    ];

    const engage = await EngageUsers.findAll({
      attributes: ["engage_id", "engaged_user_id", "engager_user_id", "engage_message", "created_at"],
      include,
      where,
      limit: Number(limit),
      offset: Number(offset),
    });

    res.status(200).json({ engage, message: "Engage Users found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get engaged users. Internal server error." });
  }
};

const getEngageUser = async (req, res) => {
    try {
        const { job_price } = req.query;
        const required_connect = await findPrices(job_price);
        res.status(200).json({ required_connect });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get job price. Internal server error.'+err });
    }
};

const updateEngages = async (req,res)=>{
    try {
        const {user_id,user_type} = req.user;
        const {engage_id,status} = req.body;
       if (user_type === 'promoter') {
            return res.status(403).json({ message: "Failed to authorize: you are not allowed to perform this action." });
        }


        const [updateEngage] = await EngageUsers.update(
            {status},
            {where: {engage_id,engaged_user_id: user_id}}
        );
        console.log("updating: ",updateEngage)
        if(updateEngage > 0){
            return res.status(201).json({message: "Engage "+status+" Successfully"})
        }else{
             res.status(201).json({message: "Faild to "+status})
        }
    } catch (error) {
         res.status(201).json({message: "Faild to change engage status "+error})
    }
}

export {EngageUser,getAllEngagedUsers, getEngageUser,updateEngages};
