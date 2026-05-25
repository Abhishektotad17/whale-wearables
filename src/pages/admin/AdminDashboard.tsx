import { useRole } from '../../hooks/useRole';
import RoleGuard from '../../features/auth/RoleGuard';

const AdminDashboard = () => {
  const { isAdmin } = useRole();

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-6">
      <div className="card">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage users, roles, products and orders.
        </p>

        {/* Quick stats — fill in real data later */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users',    value: '—' },
            { label: 'Total Orders',   value: '—' },
            { label: 'Total Products', value: '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-muted/30 p-6 text-center">
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Role management — add real table later */}
        <div className="rounded-lg border border-white/10 bg-muted/30 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Role Management
          </h2>
          <p className="text-muted-foreground text-sm">
            User role assignment coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;