import React, { useEffect } from "react";
import axios from "axios";

// LandingPage에 들어오자마자 실행

function LandingPage() {
    // server에 request를 보내고 돌아오는 response를 console창에 보여줌
    useEffect(() => {
        axios.get("/api/hello").then((response) => console.log(response.data));
    }, []);

    return <div>LandingPage</div>;
}

export default LandingPage;