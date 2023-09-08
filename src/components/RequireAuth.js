import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";


// this component is used to 'protect' different routes. It checks the roles of the user against the 
// roles passed in and if allowed, it renders its child routes (the protected routes), otherwise it redirects
// to /unauthorized or /authenticate
function RequireAuth({ allowedRoles }) {
    const {user} = useAuth();
    //frontend navigation
    const location = useLocation();
    console.log(user)
  return (
    // checks if the role that is passed in as 'allowedRoles' matches the role of the user
        user?.user?.roles.find( role => allowedRoles?.includes(role.name))
            ? <Outlet /> 
            : user !== null 
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/authenticate" state={{ from: location }} replace />
    )
}

export default RequireAuth