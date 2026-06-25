const express = require('express');
const mysql = require('mysql2')

const app = express();
const port = 5000;

app.use(express.json())

const connection = mysql.createConnection({
    host: "localhost",
    user: "fah",
    password: "Fapatan11",
    database: "web_selling_cosmetics"
})

connection.connect((err) => {
    if(err) {
        console.error("Error connecting to MySQL", err);
        return;
    }
    console.log("connected to MySQL Successfully!")
})

app.post('/api/insert',(req,res) => {
    const {Username,Password,Name,Surname,Email,Phone,Address,Member_role,Status} = req.body;

    const query = "INSERT INTO member(Username,Password,Name,Surname,Email,Phone,Address,Member_role,Status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query,[Username,Password,Name,Surname,Email,Phone,Address,Member_role,Status],(err, results) => {
        if (err) {
            console.error("Error inserting data: ", err);
            return res.status(500).json({error: "Internal Server Error"});
        }
        res.json({
            msg: "Data inserted successfully",
            insertedID: results.insertID
        })
    })
})
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
})