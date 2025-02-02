import './App.css';
import AuthComponent from './components/Auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import BoardListComponent from './components/BoardList';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthComponent />} />
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/list" element={<BoardListComponent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
