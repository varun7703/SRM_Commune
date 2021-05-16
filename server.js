var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const bcrypt = require('bcrypt');
var cors = require('cors');
var app = express();
app.use(logger('dev'));
app.use(methodOverride());
app.use(cors());
var jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var MongoClient = require('mongodb').MongoClient;
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const url = `mongodb+srv://test_user:commune123@cluster0.0ikrc.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const secret = 'RandomLettersAndNumbers'

router.post("/login", (req, response) => {
    console.log(req.body)
    const regno = req.body.regno
    const password = req.body.password
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("commune");
        var mongo = require("mongodb");
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const token = jwt.sign({ iss: 'localhost:3000', role: 'user', regno: regno }, secret, { expiresIn: 60 * 60 });
        // console.log(token);
        var myobj = {  regno: regno,password:hash  };
        // console.log(myobj);
        dbo.collection("students").findOne({ regno: regno }, function (err, result) {
            if (err) throw err;
            else {
                if (result == null) {


                    dbo.collection("students").insertOne(myobj, function (err, res) {
                        if (err) throw err
                        else {
                            response.json({
                                success: true,
                                status: 200,
                                token: token,
                                regno:regno
                            })

                            console.log("1 document inserted");
                        }
                    });
                }
                else {
                    var myquery = { regno: regno,password:hash };
                    console.log(myquery);
                            response.json({
                                success: true,
                                status: 500,
                                token: token,
                                message: "you are already part of the community",
                                regno:regno
                            })
                      
                }
            }
        });
    });

})
module.exports = router;