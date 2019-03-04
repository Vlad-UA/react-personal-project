// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

// Components
import Scheduler from '../../components/Scheduler';

@hot(module)
class App extends Component {
    render () {
        return (
            <Scheduler />
        );
    }
}

export default App;
