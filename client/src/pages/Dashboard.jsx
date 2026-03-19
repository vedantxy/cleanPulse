import { useAuth } from '../context/AuthContext';
import AdminDashboard from './admin/Dashboard';
import CitizenDashboard from './citizen/Dashboard';
import CollectorDashboard from './collector/Dashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'collector':
            return <CollectorDashboard />;
        case 'citizen':
        default:
            return <CitizenDashboard />;
    }
};

export default Dashboard;
