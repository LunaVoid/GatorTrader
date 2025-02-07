import { Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from "./Login"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
