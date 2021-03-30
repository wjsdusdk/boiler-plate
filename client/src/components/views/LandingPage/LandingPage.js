import React, { useEffect } from "react";
import axios from "axios";

// LandingPage에 들어오자마자 실행

function LandingPage() {
    // server에 request를 보내고 돌아오는 response를 console창에 보여줌
    useEffect(() => {
        axios.get("/api/hello").then((response) => console.log(response.data));
    }, []);

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
        </div>
    );
}

export default LandingPage;
