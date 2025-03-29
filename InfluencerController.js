

export const getJobs = async (req, res) => {
    try {
            const userId = req.params.user_id;
            if (userId) {
                const filteredJobs = jobs.filter(job => job.user_id == userId);
                console.log(filteredJobs);
                res.json(filteredJobs);
            } else {
                res.sendFile(path.join(__dirname, 'jobs.json'));
                console.log("No user_id provided");
            }
        
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: error
      });
    }
  }