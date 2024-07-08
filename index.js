const express = require("express");
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

app.get("/api/users", async (req, res) => {
    const allDbUsers = await User.find({})

    return res.json(allDbUsers);
});

app.get("/users",async (req, res) => {
    const allDbUsers = await User.find({})
    const html = `
    <ul>
    ${allDbUsers.map((user) =>`<li>${user.firstName}- ${user.email}</li>`).join("")}
    </ul>
    `;
    return res.send(html)
});
app
    .route("/api/users/:id")
    .get( async (req, res) => {
       const user = await User.findById(req.params.id)
       if(!user) return res.status(404).json({error:'User Not Found'})
       return res.json(user);
    })
    .patch( async (req, res) => {
        await User.findByIdAndUpdate(req.params.id,{lastName:"Williams"})
        res.json({ status: "Success" });
    })
    .delete( async (req, res) => {
        await User.findByIdAndDelete(req.params.id)
        res.json({ status: "Success" });
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
