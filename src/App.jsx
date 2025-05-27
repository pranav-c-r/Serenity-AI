import './App.css';
import { UserProvider } from './components/usercontext';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import GetStarted from './pages/getstarted';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/' element={<GetStarted />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
