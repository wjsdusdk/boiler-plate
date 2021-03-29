const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// 2. body-parser에 옵션주기

// application/x-www-form-urlencoded 타입으로 된 데이터를 분석해 Client에서 Server로 전달
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 타입으로 된 데이터를 분석해서 Client에서 Server로 전달
app.use(bodyParser.json());
app.use(cookieParser());

// 1. MongoDB 연결하기

// 연결이 잘 됬으면 "MongoDB Connected...", 안됬으면 err

const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("안녕 꺼벙아! 복실아!");
});

// [Frontend] axios test를 위해 간단하게 request를 받는 Route 만듬

app.get("/api/hello", (req, res) => {
    res.send("안녕하세요 ~");
});

// 3. 회원가입을 위한 Route 만들기

app.post("/api/user/register", (req, res) => {
    // 1) body-parser을 이용해 회원가입에 필요한 정보들을 Client에서 DB로 전달
    const user = new User(req.body); // req.body에 json 형식의 ID, PW 등 데이터 있음

    // 2) MongoDB에서 오는 method로 user model에 정보들이 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        // err가 있다면 err 메세지와 함께 실패했다고 Client에 json 형식으로 전달

        return res.status(200).json({ success: true });
        // 성공했다면 성공했다고 Client에 json 형식으로 전달
        // status(200)은 성공했다는 의미
    });
});

// 5. 로그인

// 1) Client에서 요청한 email을 DB에서 찾기
// 2) email이 있다면 PW가 같은지 확인
// 3) PW가 다르다면
// 4) PW까지 같다면 jsonwebtoken을 이용해 token 생성
// 5) PW까지 같다면 Token 생성과

app.post("/api/user/login", (req, res) => {
    // 5-1) Client에서 요청한 email을 DB에서 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "email과 일치하는 유저가 없습니다.",
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            // 5-3) PW가 다르다면

            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "password가 틀렸습니다.",
                });

            // 5-5) PW까지 같다면 Token 생성

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err); // status(400)은 에러를 의미

                // token을 어디에 저장?
                // cookie vs localstorage
                // 어디가 제일 좋은지는 논란이 있음
                // 지금은 cookie에 저장

                res.cookie("x_auth", user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id,
                });
            });
        });
    });
});

// 6. auth : request를 받고 cb function 하기 전에 중간에서 뭘 해주는 것

// 1) Client cookie에서 Token을 가져와서
// 2) 복호화를 통해 나온 유저 ID를 이용해 DB의 token과 cookie의 token이 같은지 확인
// 3) 불일치한다면 Authentication False
// 4) 일치한다면 Authentication True
// 5) 해당 유저의 선별된 정보들을 가져옴

// 6-5) middleware을 통과해 이 단계까지 왔다는 것은 Authentication이 True

app.get("/api/user/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,

        // role이 0이면 false, 아니면 true
        // role 1 어드민    role 2 특정 부서 어드민
        // role 0 일반유저  role 0이 아니면 관리자

        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

// 7. 로그아웃

// 1) 로그아웃 Route 만들기
// 2) 로그아웃하려는 유저를 DB에서 찾아 그 유저의 token 삭제

// 로그인된 상태이기 때문에 auth 사용

app.get("/api/users/logout", auth, (req, res) => {
    // ID를 이용해 유저를 찾아서 정보 업데이트 (token 삭제)
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        // err가 생겼다면
        if (err) return res.json({ success: false, err });

        // 유저를 찾았다면
        return res.status(200).send({
            success: true,
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
