import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../config';
import '../dashboard/AddPet.css'; 

function AddVaccination() {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState<string>("");
    const [dateGiven, setDateGiven] = useState<string>("");
    const [validUntil, setValidUntil] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleCancel = () => navigate(`/pet_info/${id}`);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !dateGiven || !validUntil) {
            setError("All fields are required.");
            return;
        }

        const [gYear, gMonth, gDay] = dateGiven.split('-');
        const formattedDateGiven = `${gDay}-${gMonth}-${gYear}`;

        const [vYear, vMonth, vDay] = validUntil.split('-');
        const formattedValidUntil = `${vDay}-${vMonth}-${vYear}`;

        const token = localStorage.getItem('token');
        
        try {
            setError("");
            const response = await fetch(`${apiUrl}/pets/add_vaccination/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, dateGiven: formattedDateGiven, validUntil: formattedValidUntil })
            });

            if (response.ok) {
                navigate(`/pet_info/${id}`);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError("Failed to add vaccination. Please try again.");
            }
        } catch (err) {
            setError("Network error occurred.");
        }
    };

    return (
        <div className="add-pet-container">
            <form className="form-wrapper" onSubmit={handleSubmit}>
                <h3 className="form-title">Add Vaccination</h3>
                {error && <span className="error-message form-error">{error}</span>}

                <div className="input-group">
                    <label htmlFor='vaccineName' className='input-label'>Vaccine Name</label>
                    <input id='vaccineName' type='text' className="char-input" placeholder="Enter vaccine name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor='dateGiven' className='input-label'>Date Given</label>
                    <input id="dateGiven" type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)} className="char-input" />
                </div>

                <div className="input-group">
                    <label htmlFor='validUntil' className='input-label'>Valid Until</label>
                    <input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="char-input" />
                </div>

                <button type="submit" className="submit-btn">Add Vaccination</button>
                <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
            </form>
        </div>
    );
}

export default AddVaccination;