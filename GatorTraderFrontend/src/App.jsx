
import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login.jsx';
import About from './About';
import Learn from './Learn';
import MyProfile from './MyProfile';
import TrackedStocks from './TrackedStocks';  
import SignUp from "./SignUp.jsx";
import { UserProvider } from './utils/userContext';
import PrivateRoute from './utils/PrivateRoutes.jsx';

function App() {
  

  return (
    <UserProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/Login" element={<Login/>} />
        {/* This catch-all route should be last, test route 404 -Josh */}
        <Route path="*" element={
          <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        } />

        {/* Private routes */}
        <Route path="/" element={
          <PrivateRoute>
            <TrackedStocks/>
          </PrivateRoute>
        } /> 

        <Route path="/MyProfile" element={
          <PrivateRoute>
            <MyProfile/>
          </PrivateRoute>
        }/>
        <Route path="/About" element={
          <PrivateRoute>
            <About/>
          </PrivateRoute> 
          } />
        <Route path="/Learn" element={
          <PrivateRoute>
            <Learn/>
          </PrivateRoute>
        } />
        <Route path="/TrackedStocks" element={
        <PrivateRoute>
          <TrackedStocks/>
        </PrivateRoute>} />
        
      </Routes>
    </UserProvider>
  );
}

export default App;
