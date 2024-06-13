// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";
// import Login from "./components/login/Login.js";


// function App() {
//   return (
//     <>
//       <BrowserRouter>
        
//         <div className="App">
//           <Login />
//         </div>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import NotificationsComponent from './pages/NotificationsComponent';

function App() {
  const [notifications, setNotifications] = useState([]);
  

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://192.168.100.120:8990');
    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    // WebSocket message event listener
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const message = JSON.parse(event.data);
      if (message.type === 'leaveRequestCreated') {
        setNotifications((prevNotifications) => [...prevNotifications, message.message]);
      }
    };

    // Cleanup function to close WebSocket connection
    // return () => {
    //   ws.close();
    // };
  }, []); // Run only once on component mount
  console.log("message in, notifications",notifications)
  return (
    <>
      <BrowserRouter>
        
        <div className="App">
          <Login notifications={notifications}/>
          
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;

