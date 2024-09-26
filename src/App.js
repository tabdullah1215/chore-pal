import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import Dashboard from './components/Dashboard';
import InviteAccept from './components/InviteAccept';

Amplify.configure(awsconfig);

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/invite/:inviteCode" component={InviteAccept} />
        </Switch>
      </Router>
  );
}

export default withAuthenticator(App);