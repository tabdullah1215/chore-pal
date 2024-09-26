import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Dashboard from './components/Dashboard';
import InviteAccept from './components/InviteAccept';

Amplify.configure(config);

function App() {
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