import React from 'react';
import { Typography } from '@mui/material';
import TaskList from './TaskList';

function MemberDashboard({ userId }) {
    return (
        <div>
            <Typography variant="h4">Member Dashboard</Typography>
            <Typography variant="h6">Your Tasks</Typography>
            <TaskList userId={userId} isAdmin={false} />
        </div>
    );
}

export default MemberDashboard;