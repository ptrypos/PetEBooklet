import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';
import './Login.css';

function Login() {
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);
    const [isGlobalMessageAnError, setIsGlobalMessageAnError] = useState<boolean>(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    
    const navigate = useNavigate();

    const togglePasswordShow = () => {
        setPasswordShow((prev) => !prev);
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
        setPassword(e.target.value);
    };

    const loginRequest = async (emailInput: string, passwordInput: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                   email: emailInput,
                   password: passwordInput
                })
            });

            const data = await response.json(); 
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setGlobalMessage(data.message || "Invalid credentials. Please try again.");
                setIsGlobalMessageAnError(true);
            }
        } catch (error) {
            console.error("Login error:", error);
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

        if (email === "") {
            errors.email = "Please enter an email address.";
        } else if (!email.includes('@')) {
            errors.email = "Please enter a valid email address.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        loginRequest(email, password);
    };

    return (
        <div className="auth-container">
            <form className="user-form" onSubmit={handleSubmit} noValidate>
                <h3 className="form-title">Sign In</h3>

                {globalMessage && (
                    <div className={isGlobalMessageAnError ? "error-display" : "message-display"}>
                        {globalMessage}
                    </div>
                )}

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
                            className="char-input"
                            type={passwordShow ? 'text' : 'password'}
                            placeholder="Enter your password"
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
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={
                        Object.keys(fieldErrors).length > 0 ||
                        !email ||
                        !password
                    }
                >
                    Login
                </button>
                <button 
                    type="button" 
                    className="switch-form-btn"
                    onClick={() => navigate('/register')}
                >
                    Don't have an account? Register here.
                </button>
            </form>
        </div>
    );
}

export default Login;