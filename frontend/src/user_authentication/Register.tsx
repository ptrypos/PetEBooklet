import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
import './Register.css';

function Register() {
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);
    const [isGlobalMessageAnError, setIsGlobalMessageAnError] = useState<boolean>(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [fullname, setFullname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);
    
    const navigate = useNavigate();

    const togglePasswordShow = () => {
        setPasswordShow((prev) => !prev);
    };

    const toggleConfirmPasswordShow = () => {
        setConfirmPasswordShow((prev) => !prev);
    };

    const checkFullnameCharacters = (name: string): boolean => {
        return /^[a-zA-Z ]{3,32}$/.test(name);
    };

    const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFullname = e.target.value;
        setFullname(newFullname);

        if (newFullname.length > 0 && (newFullname.length < 3 || newFullname.length > 32 || !checkFullnameCharacters(newFullname))) {
            setFieldErrors(prev => ({
                ...prev,
                fullname: "Only letters and spaces are allowed for the fullname, between 3 and 32 characters."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.fullname;
                return newErrors;
            });
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (newEmail.length > 0 && !newEmail.includes('@')) {
            setFieldErrors(prev => ({
                ...prev,
                email: "Please enter a valid email address."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.email;
                return newErrors;
            });
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.length > 0 && newPassword.length < 6) {
            setFieldErrors(prev => ({
                ...prev,
                password: "Password must be at least 6 characters."
            }));
        } else {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }
    };

    const calculateScore = (pwd: string): number => {
        let score = 0;
        if (!pwd) return score;
        if (pwd.length > 7) score += 1;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
        return score;
    };

    const score = calculateScore(password);

    const getStrengthInfo = (pwdScore: number): { text: string; class: string } => {
        if (pwdScore === 0) return { text: '', class: '' };
        if (pwdScore < 2) return { text: 'Weak', class: 'weak' };
        if (pwdScore < 4) return { text: 'Medium', class: 'medium' };
        return { text: 'Strong', class: 'strong' };
    };

    const { text, class: strengthClass } = getStrengthInfo(score);

    const registerRequest = async (fullNameInput: string, emailInput: string, passwordInput: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullNameInput,
                    email: emailInput,
                    password: passwordInput
                })
            });

            if (response.ok) {
                navigate('/login');
            } else {
                setGlobalMessage("An account with this email already exists.");
                setIsGlobalMessageAnError(true);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setGlobalMessage("Cannot connect to the server. Please try again later.");
            setIsGlobalMessageAnError(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setGlobalMessage(null);
        setIsGlobalMessageAnError(false);
        setFieldErrors({});

        const errors: Record<string, string> = {};

        if (!checkFullnameCharacters(fullname)) {
            errors.fullname = "Only letters and spaces are allowed for the fullname, between 3 and 32 characters.";
        }

        if (email === "") {
            errors.email = "Please enter an email address.";
        } else if (!email.includes('@')) {
            errors.email = "Please enter a valid email address.";
        }

        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (password !== confirmPassword) {
            setGlobalMessage("Your passwords do not match. Please try again.");
            setIsGlobalMessageAnError(true);
            return;
        }

        registerRequest(fullname, email, password);
    };

    return (
        <div className="auth-container">
            <form className="user-form" onSubmit={handleSubmit} noValidate>
                <h3 className="form-title">Create Account</h3>

                {globalMessage && (
                    <div className={isGlobalMessageAnError ? "error-display" : "message-display"}>
                        {globalMessage}
                    </div>
                )}

                <div className="input-group">
                    <label htmlFor="fullname" className="input-label">Fullname</label>
                    <input 
                        id="fullname"
                        name="fullname"
                        className={`char-input ${fieldErrors.fullname ? 'input-error' : ''}`}
                        type="text"
                        placeholder="Enter your full name"
                        value={fullname}
                        onChange={handleFullnameChange} 
                    />
                    {fieldErrors.fullname && <span className="field-error-text">{fieldErrors.fullname}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input 
                        id="email"
                        name="email"
                        className={`char-input ${fieldErrors.email ? 'input-error' : ''}`}
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleEmailChange} 
                    />
                    {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <div className="password-input-wrapper">
                        <input 
                            id="password"
                            name="password"
                            className={`char-input ${fieldErrors.password ? 'input-error' : ''}`}
                            type={passwordShow ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange} 
                        />
                        <button
                            type="button"
                            className="toggle-visibility-btn"
                            onClick={togglePasswordShow}
                        >
                            {passwordShow ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}

                    <div className="meter-container">
                        <div className={`meter-bar ${strengthClass}`} style={{ width: `${(score / 4) * 100}%` }}></div>
                    </div>
                    <p className={`strength-text ${strengthClass}`}>{text}</p>
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                    <div className="password-input-wrapper">
                        <input 
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`char-input ${isGlobalMessageAnError ? 'input-error' : ''}`}
                            type={confirmPasswordShow ? 'text' : 'password'}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        <button
                            type="button"
                            className="toggle-visibility-btn"
                            onClick={toggleConfirmPasswordShow}
                        >
                            {confirmPasswordShow ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                        Object.keys(fieldErrors).length > 0 ||
                        !fullname ||
                        !email ||
                        !password ||
                        !confirmPassword
                    }
                >
                    Register
                </button>
                <button 
                    type="button" 
                    className="switch-form-btn"
                    onClick={() => navigate('/login')}
                >
                    Already have an account? Login here.
                </button>
            </form>
        </div>
    );
}

export default Register;