import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUsers } from '../graphql/queries';
import { createTask } from '../graphql/mutations';
import {
    Tabs,
    Tab,
    AppBar,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useMediaQuery,
    useTheme,
    Grid,
} from '@mui/material';
import TaskList from './TaskList';
import InviteForm from './InviteForm';

const client = generateClient();

function AdminDashboard({ organizationId }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchUsers();
    }, [organizationId]);

    async function fetchUsers() {
        try {
            const userData = await client.graphql({
                query: listUsers,
                variables: {
                    filter: { organizationId: { eq: organizationId } }
                }
            });
            const fetchedUsers = userData.data.listUsers.items;
            setUsers(fetchedUsers);
            if (fetchedUsers.length > 0) {
                setSelectedUser(fetchedUsers[0]);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }

    async function handleAssignTask() {
        try {
            await client.graphql({
                query: createTask,
                variables: {
                    input: {
                        title: newTaskTitle,
                        status: 'new',
                        assignedToId: selectedUser.id,
                        organizationId: organizationId
                    }
                }
            });
            setOpenDialog(false);
            setNewTaskTitle('');
            // Optionally, you could refresh the tasks for the selected user here
        } catch (err) {
            console.error('Error assigning task:', err);
        }
    }

    const renderDesktopLayout = () => (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Tabs
                    orientation="vertical"
                    value={users.findIndex(u => u.id === selectedUser?.id)}
                    onChange={(_, newValue) => setSelectedUser(users[newValue])}
                >
                    {users.map((user) => (
                        <Tab key={user.id} label={user.username} />
                    ))}
                </Tabs>
            </Grid>
            <Grid item xs={9}>
                {selectedUser && (
                    <>
                        <Typography variant="h6">{selectedUser.username}'s Tasks</Typography>
                        <TaskList userId={selectedUser.id} isAdmin={true} />
                        <Button onClick={() => setOpenDialog(true)}>Assign New Task</Button>
                    </>
                )}
            </Grid>
        </Grid>
    );

    const renderMobileLayout = () => (
        <>
            <AppBar position="static">
                <Tabs
                    value={users.findIndex(u => u.id === selectedUser?.id)}
                    onChange={(_, newValue) => setSelectedUser(users[newValue])}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {users.map((user) => (
                        <Tab key={user.id} label={user.username} />
                    ))}
                </Tabs>
            </AppBar>
            {selectedUser && (
                <Box mt={2}>
                    <Typography variant="h6">{selectedUser.username}'s Tasks</Typography>
                    <TaskList userId={selectedUser.id} isAdmin={true} />
                    <Button onClick={() => setOpenDialog(true)}>Assign New Task</Button>
                </Box>
            )}
        </>
    );

    return (
        <div>
            <Typography variant="h4">Admin Dashboard</Typography>
            <InviteForm organizationId={organizationId} />
            {isMobile ? renderMobileLayout() : renderDesktopLayout()}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Assign New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Title"
                        type="text"
                        fullWidth
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAssignTask} color="primary">Assign</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AdminDashboard;