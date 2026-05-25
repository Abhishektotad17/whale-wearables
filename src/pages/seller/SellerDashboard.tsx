import { useRole } from '../../hooks/useRole';

const SellerDashboard = () => {
  const { isSeller, isAdmin } = useRole();

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-6">
      <div className="card">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Seller Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage your products, inventory and orders.
          {isAdmin && (
            <span className="ml-2 text-primary font-medium">(Viewing as Admin)</span>
          )}
        </p>

        {/* Quick stats — fill in real data later */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'My Products', value: '—' },
            { label: 'My Orders',   value: '—' },
            { label: 'Revenue',     value: '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-muted/30 p-6 text-center">
              <p className="text-3xl font-bold text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Product management — add real table later */}
        <div className="rounded-lg border border-white/10 bg-muted/30 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            My Products
          </h2>
          <p className="text-muted-foreground text-sm">
            Product listing coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;