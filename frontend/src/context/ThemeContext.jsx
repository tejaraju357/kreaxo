import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Default to dark mode to match video, but check localStorage
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('kreaxo-theme') || 'dark';
    });

    useEffect(() => {
        // Apply theme to html root
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('kreaxo-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
