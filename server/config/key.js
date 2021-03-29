// 환경변수 process.env.NODE_ENV

if (process.env.NODE_ENV === "production") {
    module.exports = require("./prod");
} else {
    module.exports = require("./dev");
}

// production(배포 후)이라면 prod.js에서 데이터 가져오고
// 아니라면 dev.js에서 데이터 가져옴