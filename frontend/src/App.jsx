import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home/Home.jsx';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Home />
        <Footer />
        <AppRoutes />
      <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
