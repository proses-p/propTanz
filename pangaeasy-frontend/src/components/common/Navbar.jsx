import { toast } from "react-toastify";
import authService from "../../services/authService";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { LogOut } from "lucide-react";


const Navbar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await authService.logout(); // send request to laravel to delete tokens
            toast.success("successfully logged out!");
        } catch (error) {
            toast.error("CONSOLE ERROR:", error);
        } finally {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');

            setLoading(false);

            navigate('/login');
        }
        
    };

    return (
        <nav className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-md sm:px-8">
            
            
        </nav>
    );
};

export default Navbar;