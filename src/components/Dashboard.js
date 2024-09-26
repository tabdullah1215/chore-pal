import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const userData = await Auth.currentAuthenticatedUser();
            setUser(userData);
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    }

    if (!user) return <div>Loading...</div>;

    const isAdmin = user.attributes['custom:role'] === 'admin';

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            {isAdmin ? (
                <AdminDashboard organizationId={user.attributes['custom:organizationId']} />
            ) : (
                <MemberDashboard userId={user.username} />
            )}
        </div>
    );
}

export default Dashboard;