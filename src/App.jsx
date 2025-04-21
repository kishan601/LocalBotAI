import React, { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { ThemeProvider } from 'styled-components';
import Home from './pages/Home';
import History from './pages/History';
import NotFound from './pages/NotFound';
import theme from './styles/theme';
import './index.css';
import styled from 'styled-components';

// Function to load Material Icons
function loadMaterialIcons() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Make header visible for the tests
const AppHeader = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 16px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 20px;
`;

// Router component
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component
function App() {
  useEffect(() => {
    loadMaterialIcons();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppHeader>
          <HeaderTitle>Bot AI</HeaderTitle>
        </AppHeader>
        <Router />
      </div>
    </ThemeProvider>
  );
}

export default App;