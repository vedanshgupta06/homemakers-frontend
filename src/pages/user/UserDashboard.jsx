import { useAuth } from '../../context/AuthContext';
import Logout from '../../auth/Logout';
import { Link } from 'react-router-dom';

function UserDashboard() {
  const { role } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Dashboard</h2>
      <p>Role: {role}</p>

      <hr />

      <ul>
        <li>
          <Link to="/user/providers">View Providers</Link>
        </li>
        <li>
          <Link to="/user/bookings">My Bookings</Link>
        </li>
      </ul>

      <Logout />
    </div>
  );
}

export default UserDashboard;
