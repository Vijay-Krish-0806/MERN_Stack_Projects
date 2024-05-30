import './App.css';
import {Navbar} from './Components/Navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { Signup } from './Components/Signup';
import { Signin } from './Components/Signin';
import { Forget } from './Components/Forget';
import { Home } from './Components/Home';
import { Activate } from './Components/Activate';
import { Private } from './Components/Private';
import { Reset } from './Components/Reset';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/signin" exact element={<Signin />} />
          <Route path="/auth/activate/:token" exact element={<Activate />} />
          <Route path="/private" exact element={<Private />} />
          <Route path="/auth/password/forget" exact element={<Forget />} />
          <Route path="/auth/password/reset/:token" exact element={<Reset />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
