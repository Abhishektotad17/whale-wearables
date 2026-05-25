import { useNavigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { roles } = useRole();

  return (
    <div className="w-full max-w-md mx-auto relative mt-20">
      <div className="card text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-2">
          You don't have permission to view this page.
        </p>
        {roles.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Your role: <span className="font-semibold text-primary">{roles.join(', ')}</span>
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full h-12 bg-gradient-primary hover:shadow-glow rounded-md
                     font-semibold text-lg text-primary-foreground transition-all duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;