import {Feedback } from '../../models/index.js'; // Assuming you have a Job model

const FeedBackController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const feedbackData = req.body;
        // Merge user_id with feedback fields
        const data = { user_id, ...feedbackData };

        const feedback = await Feedback.create(data);
        res.status(201).json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create feedback. Internal server error.' });
    }
};

export default FeedBackController;
