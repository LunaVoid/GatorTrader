
import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login.jsx';
import About from './About';
import Learn from './Learn';
import MyProfile from './MyProfile';
import TrackedStocks from './TrackedStocks';  
import SignUp from "./SignUp.jsx";

function App() {
  

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />  {/* Redirect to Login */}
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/MyProfile" element={<MyProfile/>}/>
        <Route path="/Login" element={<Login/>} />
        <Route path="/About" element={<About/>} />
        <Route path="/Learn" element={<Learn/>} />
        <Route path="/TrackedStocks" element={<TrackedStocks/>} />
      </Routes>
  );
}

export default App;
