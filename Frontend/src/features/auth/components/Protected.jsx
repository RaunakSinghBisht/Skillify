import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export const Protected = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#131313",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e2e1",
        fontFamily: "'Inter', sans-serif"
      }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
