import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Dashboard from './components/Dashboard';
import InviteAccept from './components/InviteAccept';

function App() {
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        fetch('/amplifyconfiguration.json')
            .then(response => response.json())
            .then(config => {
                Amplify.configure(config);
                setIsConfigured(true);
            })
            .catch(error => console.error('Error loading Amplify configuration:', error));
    }, []);

    if (!isConfigured) {
        return <div>Loading configuration...</div>;
    }

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard user={user} signOut={signOut} />} />
                        <Route path="/invite/:inviteCode" element={<InviteAccept />} />
                    </Routes>
                </Router>
            )}
        </Authenticator>
    );
}

export default App;