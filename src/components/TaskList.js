import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listTasks } from '../graphql/queries';
import { updateTask, deleteTask } from '../graphql/mutations';
import { List, ListItem, ListItemText, Button } from '@material-ui/core';

function TaskList({ userId, isAdmin }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, [userId]);

    async function fetchTasks() {
        try {
            const taskData = await API.graphql(graphqlOperation(listTasks, {
                filter: { assignedToID: { eq: userId } }
            }));
            setTasks(taskData.data.listTasks.items);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    }

    async function handleUpdateStatus(taskId, newStatus) {
        try {
            await API.graphql(graphqlOperation(updateTask, {
                input: { id: taskId, status: newStatus }
            }));
            fetchTasks();
        } catch (err) {
            console.error('Error updating task status:', err);
        }
    }

    async function handleDeleteTask(taskId) {
        try {
            await API.graphql(graphqlOperation(deleteTask, { input: { id: taskId } }));
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