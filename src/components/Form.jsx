import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import {toast} from 'react-toastify';

export default () => {
    const [profile, setProfile] = useState({username: "", level: 0, xp: 0, hp: 0, statuses: []});
    const {username} = useParams();

    const storeProfile = async () => {
        try {
            await axios.put(`https://deusprogrammer.com/api/mental/profiles/${username}`,
                profile, {
                    headers: {
                        "X-Access-Token": localStorage.getItem("accessToken")
                    }
                },);

            toast("Updated profile", {type: "success"});
        } catch (error) {
            toast("Failed to update", {type: "error"});
        }
    }

    const getProfile = async () => {
        try {
            let {data : profileData} = await axios.get(`https://deusprogrammer.com/api/mental/profiles/${username}`, {
                    headers: {
                        "X-Access-Token": localStorage.getItem("accessToken")
                    }
                });
            setProfile(profileData);
            toast("Loaded profile", {type: "info"});
        } catch (error) {
            toast("Failed to load profile", {type: "error"});
        }
    }

    const updateProfile = async (field, value) => {
        console.log(field + " = " + value);
        let updated = {...profile};

        if (field === "statuses") {
            console.log("BEFORE " + updated.statuses);
            if (!updated.statuses.includes(value)) {
                updated.statuses.push(value);  
            } else {
                updated.statuses = updated.statuses.filter(status => status !== value);
            }
            console.log("AFTER " + updated.statuses);
        } else {
            updated[field] = value;    
        }

        setProfile(updated);
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div>
            <table className="form-table">
                <tbody>
                    <tr>
                        <td>ID</td>
                        <td>{profile._id}</td>
                    </tr>
                    <tr>
                        <td>Username</td>
                        <td>{profile.username}</td>
                    </tr>
                    <tr>
                        <td>Level</td>
                        <td>{profile.level}</td>
                    </tr>
                    <tr>
                        <td>XP</td>
                        <td>{profile.xp}</td>
                    </tr>
                    <tr>
                        <td>HP</td>
                        <td><input value={profile.hp} onChange={({target: {value}}) => {updateProfile("hp", value)}} type="range" step={1} min={0} max={100} /></td>
                    </tr>
                    <tr>
                        <td>Status Effects</td>
                        <td>
                            <select value={profile.statuses} onChange={({target: {value}}) => {updateProfile("statuses", value)}} multiple>
                                <option value="tired">Tired</option>
                                <option value="sick">Sick</option>
                                <option value="hungry">Hungry</option>
                                <option value="sad">Sad</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => {storeProfile()}}>Save</button>
        </div>
    )
}