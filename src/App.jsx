import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterAndLogin from './components/RegisterAndLogin';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {user ? (
            <Route path="/" element={<Home user={user} />} />
          ) : (
            <Route path="/" element={<RegisterAndLogin />} />
          )}
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/reset" element={<ForgotPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
