import React, { useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

// LandingPage에 들어오자마자 실행

function LandingPage(props) {
    // server에 request를 보내고 돌아오는 response를 console창에 보여줌
    useEffect(() => {
        axios.get("/api/hello").then((response) => console.log(response.data));
    }, []);

    // 로그아웃 - DB 가져오기 (server 연결)

    const onClickHandler = () => {
        axios.get("/api/users/logout").then((response) => {
            // console.log(response.data) // success: true

            if (response.data.success) {
                props.history.push("/login");
            } else {
                alert("Failed to logout");
            }

            // logout 성공한다면 LoginPage로 이동
            // logout 실패한다면 Failed to logout 팝업
        });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
            }}
        >
            <h2>시작페이지</h2>

            <button onClick={onClickHandler}>로그아웃</button>
        </div>
    );
}

export default withRouter(LandingPage);
