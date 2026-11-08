import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../config';
import '../dashboard/AddPet.css';

function AddVetVisit() {
    const { id } = useParams<{ id: string }>();
    const [visitDate, setVisitDate] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleCancel = () => navigate(`/pet_info/${id}`);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!visitDate || !reason) {
            setError("Date and Reason are required.");
            return;
        }

        const [year, month, day] = visitDate.split('-');
        const formattedVisitDate = `${day}-${month}-${year}`;

        const token = localStorage.getItem('token');
        
        try {
            setError("");
            const response = await fetch(`${apiUrl}/pets/add_vet_visit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ visitDate: formattedVisitDate, reason, notes })
            });

            if (response.ok) {
                navigate(`/pet_info/${id}`);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError("Failed to add vet visit. Please try again.");
            }
        } catch (err) {
            setError("Network error occurred.");
        }
    };

    return (
        <div className="add-pet-container">
            <form className="form-wrapper" onSubmit={handleSubmit}>
                <h3 className="form-title">Add Vet Visit</h3>
                {error && <span className="error-message form-error">{error}</span>}

                <div className="input-group">
                    <label htmlFor='visitDate' className='input-label'>Visit Date</label>
                    <input id="visitDate" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="char-input" />
                </div>

                <div className="input-group">
                    <label htmlFor='reason' className='input-label'>Reason</label>
                    <input id='reason' type='text' className="char-input" placeholder="e.g., Annual Checkup" value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>

                <div className="input-group">
                    <label htmlFor='notes' className='input-label'>Notes</label>
                    <textarea id='notes' className="char-input textarea-resizable" placeholder="Enter any notes from the vet..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                </div>

                <button type="submit" className="submit-btn">Add Visit</button>
                <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
            </form>
        </div>
    );
}

export default AddVetVisit;