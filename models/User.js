const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기를 제거해줌 ex) asd fg123@naver.com -> asdfg123@naver.com
        unique: 1, // 중복 안되게
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0, // 임의로 Number를 지정하지 않으면 0
    }, // 관리자와 일반유저 구별
    image: String,
    token: {
        type: String,
    }, // 유효성 관리
    tokenEXP: {
        type: Number,
    }, // token 유효기간
});

const User = mongoose.model("User", userSchema); // User 부분은 model의 이름

module.exports = { User }; // 다른 파일에서도 사용할 수 있게