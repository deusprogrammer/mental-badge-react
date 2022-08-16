import { useEffect, useState } from 'react'; 
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';

import Form from './components/Form';
import Dev from './devComponents/Dev';

import './App.css';

const RoutingPage = () => {
    const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);
    const navigate = useNavigate();

    const getUserProfile = async () => {
        // If no access token is present, don't retrieve their information
        if (!localStorage.getItem("accessToken")) {
            return;
        }

        try {
            let {data: profile} = await axios.get(`https://deusprogrammer.com/api/profile-svc/users/~self`, {
                headers: {
                    "X-Access-Token": localStorage.getItem("accessToken")
                }
            });

            if (profile.username !== null) {
                setLoggedInUserProfile(profile);
                navigate(`/profiles/${profile.username}`);
            }
        } catch (error) {
            toast("Failed to get logged in user", {type: "error"});
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);

    const login = () => {
        if (process.env.NODE_ENV === "development") {
            window.location = `https://deusprogrammer.com/util/auth/dev?redirect=${window.location.protocol}//${window.location.hostname}:${window.location.port}${process.env.PUBLIC_URL}/dev`;
            return;
        }
        window.localStorage.setItem("twitchRedirect", "https://deusprogrammer.com/streamcrabs");
        window.location.replace("https://deusprogrammer.com/api/auth-svc/auth/twitch");
    }

    let profileHeader = <button onClick={login}>Login</button>;
    if (loggedInUserProfile) {
        profileHeader = <div>Logged in as {loggedInUserProfile.username}</div>
    }

    return (
        <div>
            <ToastContainer />
            <div style={{textAlign: "right"}}>
                {profileHeader}
            </div>
            <h1>Mental Badge Test Page</h1>
            <Routes>
                <Route exact path={`/profiles/:username`} element={<Form />} />
                { process.env.NODE_ENV === 'development' ?
                    <Route exact path={`/dev`} element={<Dev />} /> : null
                }
            </Routes>
        </div>
    );
}

const App = () => {
    return (
        <BrowserRouter>
            <RoutingPage />
        </BrowserRouter>
    )
}

export default App;
