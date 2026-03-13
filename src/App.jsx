import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Result from './Components/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* :query is the searched word */}
        <Route path="/results/:query" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
