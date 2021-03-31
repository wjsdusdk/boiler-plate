import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
    // adminRoute = null : adminRoute의 기본값 null
    // null    =>  아무나 출입이 가능한 페이지
    // true    =>  로그인 한 유저만 출입이 가능한 페이지
    // false   =>  로그인 한 유저는 출입이 불가능한 페이지

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then((response) => {
                console.log(response);

                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push("/login");
                    } // option : option === true를 간단하게
                } else {
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push("/");
                    } else {
                        if (option === false) props.history.push("/");
                    }
                }

                // 로그인 하지 않은 상태이면 (isAuth: false이면)
                // 로그인 한 유저만 출입이 가능한 페이지(true)에 출입할려고 하면 LoginPage로 보냄

                // 로그인 한 상태이면
                // 어드민만 출입이 가능한 페이지에 어드민이 아닌 유저가 출입할려고 하면 LandingPage로 보내고
                // 로그인 한 유저는 출입이 불가능한 페이지(false)에 출입할려고 하면 LandingPage로 보냄
            });
        }, []);

        return <SpecificComponent />;
    }
    return AuthenticationCheck;
}
