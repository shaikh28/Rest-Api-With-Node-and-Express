const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const mongoose = require("mongoose")
const port = 3000;

mongoose.connect("mongodb://localhost:27017/BDW")
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log("Mongo Error",err))

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
    },
    jobTitle: {
        type: String,
    }

},{timestamps:true})

const User = mongoose.model("user",userSchema) 

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("Hello from middleware 1"); // this will stop the response
    req.MyUserName = "Amaan";
    fs.appendFile(
        "log.txt",
        `${Date.now()},${req.method},${req.path}`,
        (err, data) => {
            next();
        }
    );
    // next()// this will let the server give the response to client  from server
});
app.use((req, res, next) => {
    console.log("Hello from middleware 2"); // this will stop the response
    next()
});

app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    return res.end(html)
});
app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res) => {
        res.json({ status: "pending" });
    })
    .delete((req, res) => {
        res.json({ status: "pending" });
    });
app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    ) {
        return res.status(404).json({ msg: "All field are required" });
    }
    const result = await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title
    })
    console.log('result',result);
    return res.status(201).json({msg:"Success"})
});
app.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`)
);
