const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// 2. body-parser에 옵션주기

// application/x-www-form-urlencoded 타입으로 된 데이터를 분석해서 클라이언트에서 서버로 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 된 데이터를 분석해서 클라이언트에서 서버로 가져옴
app.use(bodyParser.json());

// 1. MongoDB 연결하기

const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }) // <password> 변경해야됨
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
// 연결이 잘 됬으면 "MongoDB Connected...", 안됬으면 err

app.get("/", (req, res) => {
    res.send("안녕 꺼벙아! 복실아!");
});

// 3. 회원가입을 위한 라우트 만들기

app.post("/register", (req, res) => {
    // body-parser을 이용해서 회원가입할 때 필요한 정보들을 클라이언트에서 가져와 데이터 베이스에 넣어줌
    const user = new User(req.body);
    // req.body 안에는 json 형식으로 아이디, 패스워드 등의 데이터가 들어있음

    // MongoDB에서 오는 메소드로 user 모델에 정보들이 저장됨
    user.save((err, userInfo) => {
        // 에러가 있다면 에러 메세지와 함께 실패했다고 클라이언트에 json 형식으로 전달
        if (err) return res.json({ success: false, err });

        // 성공했다면 성공했다고 클라이언트에 json 형식으로 전달
        return res.status(200).json({ success: true });
        // status(200)는 성공했다는 표시
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
