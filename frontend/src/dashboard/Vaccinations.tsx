import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { apiUrl } from '../config';
import '../dashboard/MainDashboard.css';

interface Vaccination {
    id: number;
    petName: string;
    vaccineName: string;
    dateGiven: string;
    validUntil: string;
}

function Vaccinations() {
    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [petFilterOptions, setPetFilterOptions] = useState<string[]>([]);
    const [selectedPet, setSelectedPet] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getVaccinationsRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/pets/get_vaccinations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data: Vaccination[] = await response.json();
                setVaccinations(data);
                const uniquePetNames = Array.from(new Set(data.map(vac => vac.petName)));
                setPetFilterOptions(uniquePetNames);
            } else if (response.status === 401 || response.status === 403) {
                handleLogout();
            } else {
                setError("Failed to load vaccinations.");
            }
        } catch (err) {
            setError("Network error occurred.");
            handleLogout();
        }
    };

    useEffect(() => {
        getVaccinationsRequest();
    }, []);

    const displayDate = (dateStr: string) => dateStr ? dateStr : "N/A";

    const filteredVaccinations = selectedPet 
        ? vaccinations.filter(vac => vac.petName === selectedPet)
        : vaccinations;

    return (
        <div className="page-container">
            <nav className="nav-bar">
                <div className="nav-brand"><h1>Pet eBooklet</h1></div>
                <div className="nav-links">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
                    <NavLink to="/vaccinations" className={({ isActive }) => isActive ? "active-link" : ""}>Vaccinations</NavLink>
                    <NavLink to="/vet-visits" className={({ isActive }) => isActive ? "active-link" : ""}>Vet Visits</NavLink>
                </div>
                <div className="nav-actions">
                    <button type="button" onClick={handleLogout} className="nav-logout-button">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <h2 className="dashboard-heading">All Vaccinations</h2>
                {error && <span className="dashboard-error">{error}</span>}
                
                <div className="filter-section">
                    <label htmlFor="pet-filter" className="filter-label">Filter by Pet:</label>
                    <select id="pet-filter" value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)} className="filter-select">
                        <option value="">All Pets</option>
                        {petFilterOptions.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>

                <div className="table-container">
                    <table className="pets-table">
                        <thead className="table-header">
                            <tr className="header-row">
                                <th className="table-header-cell">Pet Name</th>
                                <th className="table-header-cell">Vaccine Name</th>
                                <th className="table-header-cell">Date Given</th>
                                <th className="table-header-cell">Valid Until</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredVaccinations.length > 0 ? (
                                filteredVaccinations.map((vac) => (
                                    <tr key={vac.id} className="table-row">
                                        <td className="table-cell">{vac.petName}</td>
                                        <td className="table-cell">{vac.vaccineName}</td>
                                        <td className="table-cell">{displayDate(vac.dateGiven)}</td>
                                        <td className="table-cell">{displayDate(vac.validUntil)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-row">
                                    <td colSpan={4} className="table-cell empty-cell">No vaccinations recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Vaccinations;