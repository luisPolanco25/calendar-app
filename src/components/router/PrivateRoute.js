import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

export const PrivateRoute = ({
    component: Component,
     isLoggedIn,
      ...rest
}) => {

    
    return (
        <Route {...rest} 
            component={(props) => (
                (isLoggedIn)
                ? (<Component {...props} />)
                : (<Redirect to="/login" />)
            )}
        />
    )
}


PrivateRoute.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}