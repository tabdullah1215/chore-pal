import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

function InviteForm({ organizationId }) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [inviteLink, setInviteLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const inviteCode = uuidv4();

        try {
            await API.post('inviteApi', '/invite', {
                body: { email, role, organizationId, inviteCode }
            });

            const link = `${window.location.origin}/invite/${inviteCode}`;
            setInviteLink(link);
        } catch (error) {
            console.error('Error creating invite:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Generate Invite Link</button>
            {inviteLink && (
                <div>
                    <p>Invitation Link:</p>
                    <input type="text" value={inviteLink} readOnly />
                </div>
            )}
        </form>
    );
}

export default InviteForm;