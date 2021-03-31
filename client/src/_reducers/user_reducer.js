import {
    LOGIN_USER,
    REGISTER_USER,
} from '../_actions/types';

// state={} 현재 state가 비어있다는 의미
export default function (state = {}, action) {
    // switch 사용 이유 : 다른 type이 많을 경우 type마다 다른 조치를 취해야되기 때문에
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }; // state = {}를 똑같이 가져옴
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload };
            break;
        default:
            return state;
    }
}
