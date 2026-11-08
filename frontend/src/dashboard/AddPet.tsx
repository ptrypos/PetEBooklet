import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
import './AddPet.css';

function AddPet() {
    const [nameError, setNameError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [species, setSpecies] = useState<string>("Dog");
    const [gender, setGender] = useState<string>("Male");
    const [birthDate, setBirthDate] = useState<string>("");
    const navigate = useNavigate();

    const checkPetNameCharacters = (name: string): boolean => /^[a-zA-Z ]{3,16}$/.test(name);

    const handlePetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPetName = e.target.value;
        setName(newPetName);

        if (newPetName.length > 0 && (newPetName.length < 3 || newPetName.length > 16 || !checkPetNameCharacters(newPetName))) {
            setNameError("Pet name should include letters only and must have 3 to 16 characters.");
        } else {
            setNameError("");
        }
    };

    const handleCancel = () => navigate("/dashboard");

    const handleAddPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (nameError || !name || !birthDate) return;

        const [year, month, day] = birthDate.split('-');
        const formattedBirthDate = `${day}-${month}-${year}`;
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${apiUrl}/users/add_pet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, species, gender, birthDate: formattedBirthDate })
            });

            if (response.ok) {
                navigate('/dashboard');
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login')
            } else {
                console.error("Failed to add pet. Check backend logs.");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="add-pet-container">
            <form className="form-wrapper" onSubmit={handleAddPetSubmit}>
                <h3 className="form-title">Add a New Pet</h3>

                <div className="input-group">
                    <label htmlFor='petName' className='input-label'>Pet Name</label>
                    <input id='petName' type='text' className={`char-input ${nameError ? 'input-error' : ''}`} placeholder="Enter pet's name" value={name} onChange={handlePetNameChange} />
                    {nameError && <span className="error-message">{nameError}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor='species' className='input-label'>Species</label>
                    <select id='species' className='char-input select-input' value={species} onChange={(e) => setSpecies(e.target.value)}>
                        <option value='Dog'>Dog</option>
                        <option value='Cat'>Cat</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor='gender' className='input-label'>Gender</label>
                    <select id='gender' className='char-input select-input' value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor='birthdate' className='input-label'>Birthdate</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="modal-input" />
                </div>

                <button type="submit" className="submit-btn">Add Pet</button>
                <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
            </form>
        </div>
    );
}

export default AddPet;