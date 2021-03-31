import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Dispatch : action
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function RegisterPage(props) {
    const dispatch = useDispatch();

    // 1. State 만들기

    const [Email, setEmail] = useState(""); // useState("") : 처음에 빈칸으로 나오게
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    // onChange 이벤트 만들기

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    // 3. DB 가져오기 (server 연결)

    const onSubmitHandler = (event) => {
        event.preventDefault(); // a태그 막는거랑 비슷한거

        // Password와 ConfirmPassword이 다르다면 다음 단계로 진행 못함
        if (Password !== ConfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }

        let body = {
            email: Email,
            password: Password,
            name: Name,
        };

        dispatch(registerUser(body)).then((response) => {
            if (response.payload.success) {
                props.history.push("/login");
            } else {
                alert("Failed to sign up");
            }

            // 회원가입 성공한다면 LoginPage로 이동
            // 회원가입 실패한다면 Failed to sign up 팝업
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
                {/* onChange 이벤트를 발생시켜 State가 바뀌면 value도 바뀌게 */}

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <br />

                <button>회원 가입</button>
            </form>
        </div>
    );
}

export default withRouter(RegisterPage);
