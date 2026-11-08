import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { apiUrl } from '../config';
import './MainDashboard.css';

interface Pet {
    id: number | string;
    name: string;
    species: string;
    gender: string;
    birthDate: string;
}

function MainDashboard() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddPet = () => {
        navigate('/add_pet');
    };

    const removePetRequest = async (petId: number | string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            setError(""); 
            const response = await fetch(`${apiUrl}/users/remove_pet/${petId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                getPetsRequest();
            } else {
                setError("Failed to remove pet. Please try again.");
            }
        } catch (error) {
            setError("Network error: Could not connect to the server.");
        }
    };

    const getPetsRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/users/get_pets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPets(data);
            } else if (response.status === 401 || response.status === 403) {
                handleLogout();
            }
        } catch (error) {
            setError("Network error occurred.");
        }
    };

    useEffect(() => {
        getPetsRequest();
    }, []);

    return (
        <div className="page-container">
            <nav className="nav-bar">
                <div className="nav-brand">
                    <h1>Pet eBooklet</h1>
                </div>
                
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
                {error && <span className="dashboard-error">{error}</span>}
                <div className="table-container">
                    <table className="pets-table">
                        <thead className="table-header">
                            <tr className="header-row">
                                <th className="table-header-cell">Name</th>
                                <th className="table-header-cell">Species</th>
                                <th className="table-header-cell">Gender</th>
                                <th className="table-header-cell">Birthdate</th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {pets.map((pet) => (
                                <tr key={pet.id} className="table-row">
                                    <td className="table-cell">{pet.name}</td>
                                    <td className="table-cell">{pet.species}</td>
                                    <td className="table-cell">{pet.gender}</td>
                                    <td className="table-cell">{pet.birthDate}</td>
                                    <td className="table-cell">
                                        <button type="button" className="view-btn" onClick={() => navigate(`/pet_info/${pet.id}`)}>View</button>
                                        <button type="button" className="remove-pet-btn" onClick={() => removePetRequest(pet.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="button" className="add-pet-btn" onClick={handleAddPet}>Add Pet</button>
            </div>
        </div>
    );
}

export default MainDashboard;