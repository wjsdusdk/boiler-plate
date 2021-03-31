import React, { useState } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux"; // Dispatch : action
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();

    // 1. State 만들기

    const [Email, setEmail] = useState(""); // useState("") : 처음에 빈칸으로 나오게
    const [Password, setPassword] = useState("");

    // onChange 이벤트 만들기
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    // console.log("Email", Email);
    // console.log("Password", Password);

    // 3. DB 가져오기 (server 연결)

    const onSubmitHandler = (event) => {
        event.preventDefault(); // a태그 막는거랑 비슷한거

        let body = {
            email: Email,
            password: Password,
        };

        dispatch(loginUser(body)).then((response) => {
            if (response.payload.loginSuccess) {
                props.history.push("/");
            } else {
                alert("Failed to login");
            }

            // login 성공한다면 LandingPage로 이동
            // login 실패한다면 Failed to login 팝업
        });
    };

    // 2. HTML

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
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                {/* onChange 이벤트를 발생시켜 State가 바뀌면 value도 바뀌게 */}
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>Login</button>
            </form>
        </div>
    );
}

export default withRouter(LoginPage)
