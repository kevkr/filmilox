import { Route, Routes } from 'react-router-dom';
import Overview from './components/Overview/Overview';
import Login from './components/Authentication/Login';
import Registration from './components/Authentication/Registration';
import FilmOverview from './components/FilmOverview';
import TopAppBar from './components/TopAppBar/TopAppBar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
    fetchUserData,
    selectIsAdmin,
    selectIsLoggedIn,
} from './redux/userSlice';
import SearchResult from './components/Search/SearchResult';
import UserSettings from './components/UserSettings';
import Admin from './components/Admin/Admin';

function App() {
    const dispatch = useAppDispatch();
    const isAdmin: boolean = useAppSelector(selectIsAdmin);
    const isLoggedIn: boolean = useAppSelector(selectIsLoggedIn);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) dispatch(fetchUserData());
    }, [dispatch]);

    return (
        <>
            <TopAppBar />
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/film/:filmId" element={<FilmOverview />} />
                {isAdmin && <Route path="/admin" element={<Admin />} />}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/search" element={<SearchResult />} />
                {isLoggedIn && (
                    <Route path="/usersettings" element={<UserSettings />} />
                )}
            </Routes>
        </>
    );
}

export default App;
