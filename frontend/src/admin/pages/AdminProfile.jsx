import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, data } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './AppAdmin.css';

const AdminProfile = () => {
 const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const[role, setRole] = useState('');
    const[isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchProfileData = async () => {
        try {
            const id= JSON.parse(localStorage.getItem("user")).id; // Get the user ID from local storage
            console.log("User ID:", id); // Log the user ID
            const response = await fetch(`http://localhost:5001/routes/adminprofileRoutes/get/${id}`, {
                method: "GET",  
                headers: {
                    "Content-Type": "application/json", }
        });

        console.log("Response:", response); // Log the response object
        const data = await response.json();
        console.log("Data:", data); // Log the data received from the server

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch profile data");
        }   

        setEmail(data.email);
        console.log("email:", data.email); // Log the role
        }catch (error) {
            console.error("Error fetching profile data:", error);
        }
    }
    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    }
    const handlelogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("token")
        window.location.href = "/"; // Refresh to update NavBar
        
    }

    return (
        <div className="grid-container">
        <Header />
        <Sidebar />
        <div className="admin-profile-container">
            <h1>Admin Profile</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="profile-details">

                <label>Email:</label>
                {isEditing ? (
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                ) : (
                    <span>{email}</span>

                )}
            </div>
            
            {isEditing && (
                <button onClick={handleSave}>Save</button>
            )}
            <div>
                <button onClick={handlelogout}>logout</button>
            </div>
        </div>
        </div>
    );

}
export default AdminProfile;