import React from 'react';
import './App.css';
import Map from './components/Map'
import Layout from './layout/layout'


const App: React.FC = () => {
  
  return (
    <div className="App">
      <Layout>
        <Map />
      </Layout>
    </div>

  );
}

export default App;
