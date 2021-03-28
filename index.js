const express = require("express");
const app = express();
const port = 5000;

// 1. MongoDB 연결하기

const mongoose = require("mongoose");
mongoose
    .connect("mongodb+srv://user1:user1123@boilerplate.xovca.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }) // <password> 변경해야됨
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
// 연결이 잘 됬으면 "MongoDB Connected...", 안됬으면 err

app.get("/", (req, res) => {
    res.send("안녕 꺼벙아!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});