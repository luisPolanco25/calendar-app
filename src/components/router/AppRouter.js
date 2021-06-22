import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
} from 'react-router-dom';
import { startChecking } from '../../actions/auth';
import { LoginScreen } from '../auth/LoginScreen';
import { CalendarScreen } from '../calendar/CalendarScreen';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';

export const AppRouter = () => {

    const dispatch = useDispatch();
    const {checking, uid} = useSelector(state => state.auth)
    

    useEffect(() => {
        
        dispatch(startChecking());
        
    }, [dispatch]);
    
    if (checking) {
        return (<h2>Wait...</h2>);
    }
    
    return (
        <div>
            <Router>

                <Switch>
                    <PublicRoute 
                        exact path="/login" 
                        component={LoginScreen}
                        isLoggedIn={!!uid} 
                    />

                    <PrivateRoute 
                        exact path="/" 
                        component={CalendarScreen} 
                        isLoggedIn={!!uid} 
                    />

                    <Redirect to="/" />
                </Switch>

            </Router>

        </div>
    )
}
