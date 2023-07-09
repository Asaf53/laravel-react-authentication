import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken} = useStateContext()

    if (!token) {
        return <Navigate to="/login" />
    }


    const onLogout = (ev) => {
        ev.preventDefault()

        axiosClient.post('/logout')
        .then(() => {
            setUser({})
            setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user')
        .then(({data}) => {
            setUser(data)
        })
    }, [])

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
                <Link to="/posts">Posts</Link>
            </aside>
            <div className="content">
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}
                        <a className="btn-logout" onClick={onLogout} href="#">Logout</a>
                    </div>
                </header>
                <main>
                    {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                    }
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
