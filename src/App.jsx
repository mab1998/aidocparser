import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import TemplatesList from './components/templates/TemplatesList';
import TemplateCreate from './components/templates/TemplateCreate';
import TemplateDetails from './components/templates/TemplateDetails';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import LandingPage from './components/LandingPage';
import ClientPanel from './components/ClientPanel';
import AdminPanel from './components/AdminPanel';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(true);
      });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/client' element={<ClientPanel />} />
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/templates' element={<TemplatesList />} />
        <Route path='/templates/create' element={<TemplateCreate />} />
        <Route path='/templates/edit/:id' element={<TemplateCreate />} />
        <Route path='/templates/:id' element={<TemplateDetails />} />
        <Route
          path='/login'
          element={user ? <Navigate to='/templates' /> : <Login />}
        />
        <Route
          path='/register'
          element={user ? <Navigate to='/templates' /> : <Register />}
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;