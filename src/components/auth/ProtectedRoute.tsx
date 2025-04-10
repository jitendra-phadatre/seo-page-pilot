
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    // You could return a loading spinner here
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
