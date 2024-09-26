import React, { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { useParams, useNavigate } from 'react-router-dom';

function InviteAccept() {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchInvitation();
    }, [inviteCode]);

    const fetchInvitation = async () => {
        try {
            const response = await API.get('inviteApi', `/invite/${inviteCode}`);
            setInvitation(response);
        } catch (error) {
            console.error('Error fetching invitation:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email: invitation.email,
                    'custom:role': invitation.role,
                    'custom:organizationId': invitation.organizationId
                }
            });

            await Auth.signIn(username, password);
            await API.del('inviteApi', `/invite/${inviteCode}`);

            navigate('/dashboard');
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    if (!invitation) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Accept Invitation</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
            />
            <button type="submit">Accept Invitation</button>
        </form>
    );
}

export default InviteAccept;