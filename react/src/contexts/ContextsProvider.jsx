import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
})

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken
        }}>
            {children}
        </StateContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext)
