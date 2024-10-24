
//import { useHistory } from "react-router-dom"; // If using react-router-dom v5
import { useNavigate } from "react-router-dom"; // If using react-router-dom v6

export const Sell = () => {
    //const history = useHistory(); // If using react-router-dom v5
    const navigate = useNavigate(); // If using react-router-dom v6

    const handleLoginClick = () => {
        //history.push("/vendor-login"); // If using react-router-dom v5
        navigate("/vendor-login"); // If using react-router-dom v6
    };

    const handleRegisterClick = () => {
        navigate("/vendor-register");
    };

    return (
        <div>
            <button onClick={handleLoginClick}>Vendor Login</button>
            <button onClick={handleRegisterClick}>Vendor Register</button>
        </div>
    );
};
