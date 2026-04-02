import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// const App = () => {
//   return (
//     <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
//       <h1>Tesla Energy Site Builder</h1>
//       <p>Server status: <span style={{ color: 'green' }}>Running</span></p>
//       {/* You will build your battery configuration UI here */}
//     </div>
//   );
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);