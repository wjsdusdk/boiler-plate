import axios from "axios";
import { LOGIN_USER } from "./types";

export function loginUser(dataToSubmit) {
    // 유저의 email, PW를 server에 보내고 server로부터 받은 데이터를 request에 저장
    const request = axios.post("/api/users/login", dataToSubmit).then((response) => response.data);

    // request를 return을 시켜서 reducer로 보냄
    return {
        type: LOGIN_USER,
        payload: request,
    };
}
