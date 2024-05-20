//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const serverless = require("serverless-http");

const app = express();
const router = express.router();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


router.get("/", function(req,res){

    res.sendFile(__dirname + "/signup.html");


})


router.post("/", function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {

        members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

        }
        
    ]

    };

    var jsonData = JSON.stringify(data);

    const url = "https://us22.api.mailchimp.com/3.0/lists/888fade7ac"

    const options = {
        method: "POST",
        auth: "joni1:e5fdf1f2affbc21e921f6a83a94823ff-us22"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){

            res.sendFile(__dirname + "/success.html")



        } else{

            res.sendFile(__dirname + "/failure.html")


        }
        response.on("data",function(data){

        console.log(JSON.parse(data));


        })




    })

    request.write(jsonData);
    request.end();

})


router.post("/failure", function(req,res){


    res.redirect("/")
});

router.get("/success", (req, res) => {
    res.send("App is running..");
});


app.use("/.netlify/functions/app", router);

module.exports.handler = serverless(app);


// app.listen(process.env.PORT || 3000,function(){

//     console.log("The server is starting at  port 3000!");

// })



// e5fdf1f2affbc21e921f6a83a94823ff-us22 Mailchimp

// list id - 888fade7ac