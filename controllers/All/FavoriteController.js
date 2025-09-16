import {Favorite, Job } from '../../models/index.js'; // Assuming you have a Job model

const FavoriteController = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {fave_job_id,isFavorite} = req.body;
        console.log("jase: ",req.body)
        if(isFavorite){
            const unfave = await Favorite.destroy({
                where: {fave_job_id,user_id}
            });
            console.log("unfave: ",unfave)
            if(unfave > 0){
                res.status(200).json({message: "Unfavorited this Job successfully"});
            }else{
                res.status(404).json({message: "Favorite not found"});
            }
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

const getAllFavorites = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const favorites = await Favorite.findAll({
      where: { user_id },
      include: [
        {
          model: Job,
          attributes: ["title", "job_description", "job_price","user_id","required_connect"],
          required: false, // LEFT JOIN
        },
      ],
      attributes: ["fave_job_id","my_favorite_id"], // from my_favorites
    });

    // Flatten response
    const formattedFavorites = favorites.map(fav => ({
      fave_job_id: fav.fave_job_id,
      title: fav.Job ? fav.Job.title : null,
      job_description: fav.Job ? fav.Job.job_description : null,
      job_price: fav.Job ? fav.Job.job_price : null,
      my_favorite_id: fav.my_favorite_id,
      creator_id: fav.Job ? fav.Job.user_id : null,
      required_connect:  Job? fav.Job.required_connect : null
    }));

    res.status(200).json({ favorites: formattedFavorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve favorites. Internal server error.' + err.message });
  }
};



export { FavoriteController, getAllFavorites };
