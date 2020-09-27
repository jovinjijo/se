import React from 'react';
import { Container } from '@material-ui/core';
import Landing from './Landing/Landing';

function App() {
    const navigateToHome = () => {
        return null;
    };
    return (
        <Container maxWidth="sm">
            <Landing navigateToHome={navigateToHome} />
        </Container>
    );
}

export default App;
