import {Favorite } from '../../models/index.js'; // Assuming you have a Job model

const FavoriteController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {fave_job_id,isFavorite} = req.body;
        if(isFavorite){
            const unfave = await Favorite.destroy({
                where: {fave_job_id,user_id}
            });
            console.log("unfave: ",unfave)
            res.status(201).json({message: "Unfave this Job success fully"});
        }else{
            const data = { user_id, fave_job_id };
            const fave = await Favorite.create(data);
            res.status(201).json({message: "Favorite this Job sucess"});
        }
        // Merge user_id with feedback fields
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create feedback. Internal server error.'+err.message });
    }
};

export default FavoriteController;
