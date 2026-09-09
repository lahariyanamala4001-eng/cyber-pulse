import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CitizenLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>
      <Navbar />
      <main className="flex-1" role="main" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
