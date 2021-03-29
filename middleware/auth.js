// 6-1,3,4) 인증 처리를 하는 곳

// 페이지 이동할 때마다 로그인 되있는지 안되있는지
// 관리자인지
// 글을 쓰거나 지울 권한이 있는지
// 등을 체크

const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 6-1) Client cookie에서 Token을 가져옴
    let token = req.cookies.x_auth;

    // Token을 복호화 한 후 유저를 찾음
    User.findByToken(token, (err, user) => {
        if (err) throw err;

        // 6-3) 유저가 없다면
        if (!user) return res.json({ isAuth: false, error: true });

        // 6-4) 유저가 있다면
        req.token = token; // 다음 단계에서 req.token을 했을 때 token을 사용할 수 있게
        req.user = user; // 다음 단계에서 req.user을 했을 때 user을 사용할 수 있게
        next(); // middleware로 중간처리 단계이기 때문에 다음 단계로 가기 위해
    });

    // 유저가 있으면 인증 OK

    // 유저가 없으면 인증 NO
};

module.exports = { auth };
