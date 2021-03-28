const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");

// 2. body-parser에 옵션주기

// application/x-www-form-urlencoded 타입으로 된 데이터를 분석해 Client에서 Server로 전달
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 된 데이터를 분석해서 Client에서 Server로 전달
app.use(bodyParser.json());
app.use(cookieParser()); // 5. 2-2) (2-2)

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

// 3. 회원가입을 위한 route 만들기

app.post("/register", (req, res) => {
    // 1) body-parser을 이용해 회원가입에 필요한 정보들을 Client에서 DB로 전달
    const user = new User(req.body); // req.body에 json 형식의 ID, PW 등 데이터 있음

    // 2) MongoDB에서 오는 method로 user model에 정보들이 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        // err가 있다면 err 메세지와 함께 실패했다고 Client에 json 형식으로 전달

        return res.status(200).json({ success: true });
        // 성공했다면 성공했다고 Client에 json 형식으로 전달
        // status(200)는 성공했다는 의미
    });
});

// 5. 로그인

app.post("/login", (req, res) => {
    // 1) 데이터 베이스에서 요청한 이메일 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일과 일치하는 유저가 없습니다.",
            });
        }

        // 2-2) 데이터 베이스에서 요청한 이메일이 있다면 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            // (1) 비밀번호가 다르다면
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });

            // (2-2) 비밀번호까지 같다면 Token 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err); // status(400)은 에러를 의미

                // token을 어디에 저장?
                // 쿠키 vs 로컬스토리지
                // 어디가 제일 좋은지는 논란이 있음
                // 지금은 쿠키에 저장
                res.cookie("x_auth", user.token)
                    .status(200) // status(200)는 성공했다는 의미
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
