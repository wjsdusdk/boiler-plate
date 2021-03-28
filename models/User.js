const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 자릿수
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기를 제거 ex) asd fg123@naver.com -> asdfg123@naver.com
        unique: 1, // 중복 방지
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

// 4. PW 암호화

// 1) hash PW 암호화하기 위해서 salt가 필요
// 2) salt를 만들기 위해서 saltRounds가 필요

userSchema.pre("save", function (next) {
    var user = this; // 여기서 this는 userSchema를 의미

    // if를 사용하는 이유 : PW 변경할 때가 아닌 email 등을 변경할 때 PW 암호화를 하지않게 하기 위해서

    if (user.isModified("password")) {
        // salt 생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            // hash PW 암호화
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

    // PW 변경한다면 PW 암호화를 하고 다음 단계로 넘어가고
    // PW 변경이 아니라면 바로 다음 단계로 넘어감
});

// 5. 2-1) 데이터 베이스에서 요청한 이메일이 있다면 비밀번호가 같은지 확인

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
        // 비밀번호가 다르다면 err, 같다면 isMatch
    });
};

// 5. (2-1) jsonwebtoken을 이용해 token 생성
// token 생성 이유 : 로그인이 되어있는 유저 인지를 확인

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), "secretToken");
    // user._id +"secretToken" = token
    // "secretToken"을 넣으면 user._id을 알 수 있음
    // 첫번쨰 argument는 String이여야 하는데 mongodb에서 생성된 id(user._id)는 그게 아니기에 toHexString()을 이용해서 바꿔줌

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model("User", userSchema); // User 부분은 model의 이름

module.exports = { User }; // 다른 파일에서도 사용할 수 있게
