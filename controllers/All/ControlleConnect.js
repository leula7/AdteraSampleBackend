import { where } from "sequelize";
import { Connect, sequelize, User } from "../../models/index.js";

const createConnect = async (req, res) => {
  try {
    const { user_type } = req.user;
    
    if (user_type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only Admin can create connect packages.' });
    }

    const { title, description, connect_value,connect_price } = req.body;
    
    const newConnect = await Connect.create({
      title,
      description,
      connect_value,
      connect_price,
      user_id: req.user.user_id // Assuming the admin's user_id is stored in req.user
    });

    res.status(201).json(newConnect);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while creating connect package.' });
  }
};

// Update a connect package
const updateConnect = async (req, res) => {
  try {
    const { user_type } = req.user;
    console.log("users: ",req.user);
    
    if (user_type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only Admin can update connect packages.' });
    }

    console.log("req.body: ",req.body);
    const { connect_id,title, description, connect_value , connect_price} = req.body;
    
    const [updated] = await Connect.update({
      title,
      description,
      connect_price,
      connect_value
    }, {
      where: { connect_id }
    });

    if (updated) {
      const updatedConnect = await Connect.findByPk(connect_id);
      return res.status(200).json(updatedConnect);
    }
    
    throw new Error('Connect package not found');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while updating connect package.' });
  }
};

const transConnect = async (req, res) => {
  const { username, value } = req.body;
  const { user_id } = req.user;

  const transaction = await sequelize.transaction();

  try {
    const sender = await User.findByPk(user_id, { transaction });
    const receiver = await User.findOne({ where: { username }, transaction });

    if (!receiver) {
      await transaction.rollback();
      return res.status(404).json({ message: "Invalid Receiver Username." });
    }

    if (sender.connect_val < value) {
      await transaction.rollback();
      return res.status(400).json({ message: "Insufficient connect balance." });
    }

    const [senderUpdate] = await User.update(
      { connect_val: sender.connect_val - value },
      { where: { user_id }, transaction }
    );

    const [receiverUpdate] = await User.update(
      { connect_val: receiver.connect_val + value },
      { where: { username}, transaction }
    );

    if (senderUpdate === 0 || receiverUpdate === 0) {
      await transaction.rollback();
      return res.status(500).json({ message: "Failed to transfer connect. Please try again." });
    }

    await transaction.commit();

    res.status(200).json({ message: "Connect transferred successfully." });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: "Internal server error during connect transfer." });
  }
};



// Delete a connect package
const deleteConnect = async (req, res) => {
  try {
    const { user_type } = req.user;
    
    if (user_type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only Admin can delete connect packages.' });
    }

    const { connect_id } = req.params;
    
    const deleted = await Connect.destroy({
      where: { connect_id }
    });

    if (deleted) {
      return res.status(200).json({ message: 'Connect package deleted successfully.' });
    }
    
    throw new Error('Connect package not found');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error while deleting connect package.' });
  }
};


const getConnectData = async (connect_id) => {
  try {
    console.log("Control Connect Fetching connect data for ID:", connect_id);
    const connect = await Connect.findOne({where: {connect_id}}); // Adjust the limit and offset as needed
      return connect
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'get all jobs Internal server error.' });
  }
};


export default {
  createConnect,
  transConnect,
  updateConnect,
  deleteConnect,
  getConnectData
};