import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Register from './user_authentication/Register';
import Login from './user_authentication/Login';
import MainDashboard from './dashboard/MainDashboard';
import AddPet from './dashboard/AddPet';
import PetInfo from './dashboard/PetInfo';
import Vaccinations from './dashboard/Vaccinations';
import VetVisits from './dashboard/VetVisits';
import AddVaccination from './dashboard/AddVaccination';
import AddVetVisit from './dashboard/AddVetVisit';

function AppContent() {
    const location = useLocation();
    const showHeader = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="app-container">
            {showHeader && (
                <header className="app-header">
                    <h1 className="app-title">Pet eBooklet</h1>
                    <p className="app-subtitle">Welcome to Pet eBooklet, an online and free eBooklet for your pet</p>
                </header>
            )}
            
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<MainDashboard />} />
                    <Route path="/add_pet" element={<AddPet />} />
                    <Route path="/pet_info/:id" element={<PetInfo />} />
                    <Route path="/vaccinations" element={<Vaccinations />} />
                    <Route path="/vet-visits" element={<VetVisits />} />
                    <Route path="/add_vaccination/:id" element={<AddVaccination />} />
                    <Route path="/add_vet_visit/:id" element={<AddVetVisit />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;