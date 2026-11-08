import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
import './PetInfo.css';

interface VetVisit {
    id: string | number;
    visitDate: string;
    reason: string;
    notes: string;
}

interface Vaccination {
    id: string | number;
    vaccineName: string;
    dateGiven: string;
    validUntil: string;
}

function PetInfo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [petName, setPetName] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [species, setSpecies] = useState<string>("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [newBirthDate, setNewBirthDate] = useState<string>("");
    const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isMessageAnError, setIsMessageAnError] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const changeBirthDate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (!newBirthDate) return;

        try {
            setIsMessageAnError(false);
            setMessage("");

            const [year, month, day] = newBirthDate.split('-');
            const formattedNewBirthDate = `${day}-${month}-${year}`;

            const response = await fetch(`${apiUrl}/pets/change_pet_birthdate/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ birthDate: formattedNewBirthDate })
            });

            if (response.ok) {
                setIsMessageAnError(false);
                setMessage("The birthdate of the pet updated successfully.");
                setBirthDate(formattedNewBirthDate);
                setNewBirthDate("");
                setIsModalOpen(false);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login')
            } else {
                setIsMessageAnError(true);
                setMessage("Failed to update the birthdate of the pet.");
            }
        } catch (err) {
            setIsMessageAnError(true);
            setMessage("Network error occurred.");
        }
    }

    const retrievePetInfo = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setIsMessageAnError(false);
            setMessage("");

            const response = await fetch(`${apiUrl}/pets/retrieve_pet_info/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const info = data.pet_info;
                
                setPetName(info.name || "");
                setGender(info.gender || "");
                setSpecies(info.species || "");
                setBirthDate(info.birthDate || "");
                setVetVisits(info.vetVisits || []);
                setVaccinations(info.vaccinations || []);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login')
            } else {
                setIsMessageAnError(true);
                setMessage("Failed to load pet details.");
            }
        } catch (err) {
            setIsMessageAnError(true);
            setMessage("Network error occurred.");
        }
    };

    useEffect(() => {
        if (id) retrievePetInfo();
    }, [id]);

    return (
        <div className="pet-info-container">
            <h2 className="pet-info-title">Pet Details</h2>
            {message && (
                <span className={isMessageAnError ? "pet-info-error-message" : "pet-info-success-message"}>
                    {message}
                </span>
            )}
            
            <div className="pet-details-card">
                <p className="pet-detail-item"><strong>Name:</strong> {petName}</p>
                <p className="pet-detail-item"><strong>Species:</strong> {species}</p>
                <p className="pet-detail-item"><strong>Gender:</strong> {gender}</p>
                <p className="pet-detail-item"><strong>Birthdate:</strong> {birthDate}</p>
                <button className="change-birthdate-btn" onClick={() => setIsModalOpen(true)}>Change Birthdate</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Update Birthdate</h3>
                        <label className="modal-label">New Birthdate:</label>
                        <input type="date" value={newBirthDate} onChange={(e) => setNewBirthDate(e.target.value)} className="modal-input" />
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => { setIsModalOpen(false); setNewBirthDate(""); }}>Cancel</button>
                            <button className="save-btn" onClick={changeBirthDate}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="section-container vet-visits-section">
                <h3 className="section-title">Vet Visits</h3>
                <div className="fixed-table-container">
                    <table className="data-table vet-visits-table">
                        <thead className="table-header">
                            <tr className="header-row">
                                <th className="table-header-cell">Date</th>
                                <th className="table-header-cell">Reason</th>
                                <th className="table-header-cell">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {vetVisits.length > 0 ? (
                                vetVisits.map((visit) => (
                                    <tr key={visit.id} className="table-row">
                                        <td className="table-cell">{visit.visitDate}</td>
                                        <td className="table-cell">{visit.reason}</td>
                                        <td className="table-cell">{visit.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-row empty-row">
                                    <td colSpan={3} className="table-cell no-data">No vet visits recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <button type="button" className="add-record-btn" onClick={() => navigate(`/add_vet_visit/${id}`)}>Add Vet Visit</button>
            </div>

            <div className="section-container vaccinations-section">
                <h3 className="section-title">Vaccinations</h3>
                <div className="fixed-table-container">
                    <table className="data-table vaccinations-table">
                        <thead className="table-header">
                            <tr className="header-row">
                                <th className="table-header-cell">Vaccine Name</th>
                                <th className="table-header-cell">Date Given</th>
                                <th className="table-header-cell">Valid Until</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {vaccinations.length > 0 ? (
                                vaccinations.map((vac) => (
                                    <tr key={vac.id} className="table-row">
                                        <td className="table-cell">{vac.vaccineName}</td>
                                        <td className="table-cell">{vac.dateGiven}</td>
                                        <td className="table-cell">{vac.validUntil}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="table-row empty-row">
                                    <td colSpan={3} className="table-cell no-data">No vaccinations recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <button type="button" className="add-record-btn" onClick={() => navigate(`/add_vaccination/${id}`)}>Add Vaccination</button>
            </div>

            <button type="button" onClick={() => navigate('/dashboard')} className="back-btn">Back to Dashboard</button>
        </div>
    );
}

export default PetInfo;