import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { apiUrl } from '../config';
import '../dashboard/MainDashboard.css';

interface VetVisit {
    id: number;
    petName: string;
    visitDate: string;
    reason: string;
    notes: string;
}

function VetVisits() {
    const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
    const [petFilterOptions, setPetFilterOptions] = useState<string[]>([]);
    const [selectedPet, setSelectedPet] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getVetVisitsRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/pets/get_vet_visits`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data: VetVisit[] = await response.json();
                setVetVisits(data);
                const uniquePetNames = Array.from(new Set(data.map(visit => visit.petName)));
                setPetFilterOptions(uniquePetNames);
            } else if (response.status === 401 || response.status === 403) {
                handleLogout();
            } else {
                setError("Failed to load vet visits.");
            }
        } catch (err) {
            setError("Network error occurred.");
            handleLogout();
        }
    };

    useEffect(() => {
        getVetVisitsRequest();
    }, []);

    const displayDate = (dateStr: string) => dateStr ? dateStr : "N/A";

    const filteredVisits = selectedPet 
        ? vetVisits.filter(visit => visit.petName === selectedPet)
        : vetVisits;

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
                <h2 className="dashboard-heading">All Vet Visits</h2>
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
                                <th className="table-header-cell">Visit Date</th>
                                <th className="table-header-cell">Reason</th>
                                <th className="table-header-cell">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredVisits.length > 0 ? (
                                filteredVisits.map((visit) => (
                                    <tr key={visit.id} className="table-row">
                                        <td className="table-cell">{visit.petName}</td>
                                        <td className="table-cell">{displayDate(visit.visitDate)}</td>
                                        <td className="table-cell">{visit.reason}</td>
                                        <td className="table-cell">{visit.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-row">
                                    <td colSpan={4} className="table-cell empty-cell">No vet visits found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default VetVisits;