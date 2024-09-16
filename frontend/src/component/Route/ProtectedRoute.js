// import React, { Fragment } from 'react'
// import { useSelector } from 'react-redux'
// import { Route , Navigate} from 'react-router-dom'

// const ProtectedRoute = ({ Component : Component , ...rest}) => {

//     const { loading , isAuthenticated , user} = useSelector((state)=> state.first)

//   return (
//     <Fragment>
//         {!loading && (
//             <Route 
//             {...rest}
//             render={(props)=> {
//                 if(!isAuthenticated){
//                     return <Navigate to ="/login" />
//                 }
//                 return <Component { ...props} />
//             }}
//             />
//         )}
//     </Fragment>
//   )
// }

// export default ProtectedRoute








// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({isAdmin}) => {
//     const { loading, isAuthenticated , user} = useSelector((state) => state.user);

//     if (loading) return null; // Optionally, you can render a loading spinner here

//     // return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

//     if(isAdmin === true && user.role !== "admin"){
//         return <Navigate to="/login"/>
//     }

//     return isAuthenticated === false ? <Navigate to="/login" /> : <Outlet />;

// };

// export default ProtectedRoute;




import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>; // Display a loading spinner or message
  }

  // If not authenticated, redirect to login
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  // If the route is admin-only and the user is not an admin, redirect to login
  if (isAdmin && user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // Render the requested component
  return <Outlet />;
};

export default ProtectedRoute;

