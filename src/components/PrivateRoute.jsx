import { useAuthStore } from '../store/useAuthStore';
import UnauthorizedPage from '../pages/UnauthorizedPage';

export default function PrivateRoute({ children }) {
    const { user } = useAuthStore();

    if (!user) return <UnauthorizedPage />;

    return children;
}