const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors()); // Enable CORS if accessing from frontend
app.use(express.static(__dirname)); // Serves static files from the backend folder
app.use(express.json()); // Add this middleware for parsing JSON body

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'Users.json')); // No extra 'backend' here
});


app.get('/jobs/:user_id', (req, res) => {
    console.log("Jobs request received");

    try {
        const userId = req.params.user_id;

        // Read the JSON file
        fs.readFile(path.join(__dirname, 'jobs.json'), 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading jobs.json:", err);
                return res.status(500).send({ message: "Internal Server Error" });
            }

            // Parse JSON
            const jobs = JSON.parse(data);

            // Filter jobs by user_id
            const filteredJobs = jobs.filter(job => job.user_id == userId);

            console.log(filteredJobs); // Debugging output

            // Send filtered jobs as response
            res.json(filteredJobs);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.get('/jobs', (req, res) => {
    console.log("Jobs request received");

    try {
        const userId = req.params.user_id;

        // Read the JSON file
        fs.readFile(path.join(__dirname, 'jobs.json'), 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading jobs.json:", err);
                return res.status(500).send({ message: "Internal Server Error" });
            }

            // Parse JSON
            const jobs = JSON.parse(data);
            res.json(jobs);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post('/addUser', (req, res) => {
    console.log("Add User request received");
    
    const { firstName, lastName, age, type } = req.body;
    if (!firstName || !lastName || !age || !type) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const newUser = { firstName, lastName, age, type };

    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send({ message: "Internal Server Error" });
        }

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return res.status(500).send({ message: "Invalid JSON format" });
        }

        users.push(newUser);

        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.error("Error writing to users.json:", err);
                return res.status(500).send({ message: "Failed to save user" });
            }

            res.status(201).send({ message: "User added successfully", user: newUser });
        });
    });
});

app.get('/getjobstatus', (req, res) => {

    fs.readFile(path.join(__dirname, 'aboutjobs.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading jobs.json:", err);
            return res.status(500).send({ message: "Internal Server Error" });
        }

        // Parse JSON
        const aboutjobs = JSON.parse(data);
        res.json(aboutjobs);
    });
});

const CHAPA_SECRET_KEY = 'CHASECK_TEST-9C94Wuyk1obkcmP9W4jfu3nmgsFbwknk'; // Replace with your actual key

app.post('/api/initiate-payment', async (req, res) => {
  try {
    const { amount, description, email, phone } = req.body;
    
    const chapaResponse = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount: amount.toString(),
        currency: 'ETB',
        email: email,
        first_name: 'User',
        last_name: 'Test',
        phone_number: phone,
        tx_ref: `chapa-${Date.now()}`,
        callback_url: 'https://yourserver.com/payment-callback',
        return_url: 'https://yourapp.com/payment-success',
        "customization[title]": "Payment for Connects",
        "customization[description]": description,
        "meta[hide_receipt]": "true"
      },
      { headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` } }
    );
    console.log(chapaResponse.data); // Debugging output

    res.json(chapaResponse.data);
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.response.data });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server app listening on port ${port}`)
})
