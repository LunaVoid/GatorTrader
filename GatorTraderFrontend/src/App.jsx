
import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login.jsx';
import About from './About';
import Learn from './Learn';
import MyProfile from './MyProfile';
import TrackedStocks from './TrackedStocks';  
import SignUp from "./SignUp.jsx";
import { UserProvider } from './utils/userContext';

function App() {
  

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />  {/* Redirect to Login */}
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/MyProfile" element={<MyProfile/>}/>
        <Route path="/Login" element={<Login/>} />
        <Route path="/About" element={<About/>} />
        <Route path="/Learn" element={<Learn/>} />
        <Route path="/TrackedStocks" element={<TrackedStocks/>} />
        {/* This catch-all route should be last, test route 404 -Josh */}
        <Route path="*" element={
          <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        } />
      </Routes>
    </UserProvider>
  );
}

export default App;
