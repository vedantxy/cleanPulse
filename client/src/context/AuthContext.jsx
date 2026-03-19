import { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/api';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => {
        const saved = localStorage.getItem('token');
        if (saved) {
            api.defaults.headers.common['x-auth-token'] = saved;
        }
        return saved;
    });

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['x-auth-token'];
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        // Request interceptor for runtime token updates
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    config.headers['x-auth-token'] = storedToken;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle session expiration
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    if (!window.location.pathname.includes('/login')) {
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Restore user profile if we have a token but no user object
                if (token && !user) {
                    try {
                        const res = await api.get('/auth/profile');
                        setUser(res.data);
                    } catch (err) {
                        console.error('Session restore failed:', err.message);
                    }
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, token]);

    const signup = async (userData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const firebaseUser = userCredential.user;
        const idToken = await firebaseUser.getIdToken();

        const res = await api.post('/auth/signup', {
            ...userData,
            firebaseUid: firebaseUser.uid
        }, {
            headers: { 'x-auth-token': idToken }
        });

        const backendToken = res.data.token;
        localStorage.setItem('token', backendToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        axios.defaults.headers.common['x-auth-token'] = backendToken;
        setToken(backendToken);
        setUser(res.data.user);
        return res.data;
    };

    const login = async (email, password) => {
        let firebaseSuccess = false;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            firebaseSuccess = true;
        } catch (firebaseErr) {
            console.warn('Firebase login failed, checking MERN backend:', firebaseErr.message);
            
            // Step 1: Check MERN backend
            try {
                const res = await axios.post('/api/auth/login', { email, password });
                
                // Step 2: MERN succeeded, so sync to Firebase
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('Legacy user synced to Firebase successfully.');
                } catch (syncErr) {
                    console.error('Firebase sync failed during login:', syncErr.message);
                }

                // Step 3: Handle success
                return handleAuthSuccess(res.data);
            } catch {
                // If both fail, throw original Firebase error for UI
                throw firebaseErr;
            }
        }

        if (firebaseSuccess) {
            const res = await axios.post('/api/auth/login', { email, password });
            return handleAuthSuccess(res.data);
        }
    };

    const handleAuthSuccess = (data) => {
        const backendToken = data.token;
        localStorage.setItem('token', backendToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        axios.defaults.headers.common['x-auth-token'] = backendToken;
        setToken(backendToken); 
        setUser(data.user);
        return data;
    };



    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, signup, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
