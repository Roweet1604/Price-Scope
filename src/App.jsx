import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChatbotWidget from './Components/ChatBotWidget';
import Home from './Components/Home';
import Result from './Components/Result';

function App() {
  return (
    <Router>
       <ChatbotWidget/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* :query is the searched word */}
        <Route path="/results/:query" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
