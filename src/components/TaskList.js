import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api'; // Updated import for API
import { listTasks } from '../graphql/queries';
import { updateTask, deleteTask } from '../graphql/mutations';
import { List, ListItem, ListItemText, Button } from '@mui/material';

function TaskList({ userId, isAdmin }) {
    const [tasks, setTasks] = useState([]);

    // Create API client using generateClient (new in v6)
    const apiClient = generateClient({
        name: 'API',  // Specifies the name of the service you are using
        region: 'your-region',  // Replace with your region
        service: 'appsync',  // Assuming you're using AppSync for the GraphQL API
    });

    useEffect(() => {
        fetchTasks();
    }, [userId]);

    async function fetchTasks() {
        try {
            const taskData = await apiClient.graphql({
                query: listTasks,
                variables: {
                    filter: { assignedToID: { eq: userId } }
                }
            });
            setTasks(taskData.data.listTasks.items);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    }

    async function handleUpdateStatus(taskId, newStatus) {
        try {
            await apiClient.graphql({
                query: updateTask,
                variables: {
                    input: { id: taskId, status: newStatus }
                }
            });
            fetchTasks();
        } catch (err) {
            console.error('Error updating task status:', err);
        }
    }

    async function handleDeleteTask(taskId) {
        try {
            await apiClient.graphql({
                query: deleteTask,
                variables: { input: { id: taskId } }
            });
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    }

    return (
        <List>
            {tasks.map((task) => (
                <ListItem key={task.id}>
                    <ListItemText primary={task.title} secondary={`Status: ${task.status}`} />
                    {!isAdmin && task.status === 'new' && (
                        <Button onClick={() => handleUpdateStatus(task.id, 'working-on-it')}>Start Working</Button>
                    )}
                    {!isAdmin && task.status === 'working-on-it' && (
                        <Button onClick={() => handleUpdateStatus(task.id, 'done')}>Mark as Done</Button>
                    )}
                    {isAdmin && (
                        <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                    )}
                </ListItem>
            ))}
        </List>
    );
}

export default TaskList;
