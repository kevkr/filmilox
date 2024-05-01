import React from 'react';
import { alpha, styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button } from '@mui/material';
import {
    Link,
    NavigateFunction,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    selectImageProfile,
    selectIsAdmin,
    selectIsLoggedIn,
    selectUsername,
    setIsLoggedIn,
} from '../../redux/userSlice';
import Controller from '../../controller/Controller';
import ApiRouter from '../../api/ApiRouter';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function TopAppBar() {
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useAppDispatch();

    const username = useAppSelector(selectUsername);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isAdmin = useAppSelector(selectIsAdmin);
    const imageProfile = useAppSelector(selectImageProfile);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [searchParams] = useSearchParams();
    const [searchInputQuery, setSearchInputQuery] = React.useState(
        searchParams.get('find')
    );

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogOut = () => {
        handleMenuClose();
        localStorage.removeItem('token');
        dispatch(setIsLoggedIn(false));
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {isAdmin && (
                <MenuItem onClick={() => handleNavigate('/admin')}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AddIcon />
                    </IconButton>
                    <p>Add Movie</p>
                </MenuItem>
            )}
            {isLoggedIn && (
                <MenuItem onClick={() => handleNavigate('/usersettings')}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <SettingsIcon />
                    </IconButton>
                    <p>User Settings</p>
                </MenuItem>
            )}
            <MenuItem onClick={handleLogOut}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {isLoggedIn && (
                <div>
                    {isAdmin && (
                        <MenuItem onClick={() => handleNavigate('/admin')}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AddIcon />
                            </IconButton>
                            <p>Add Movie</p>
                        </MenuItem>
                    )}

                    {isLoggedIn && (
                        <MenuItem
                            onClick={() => handleNavigate('/usersettings')}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <SettingsIcon />
                            </IconButton>
                            <p>User Settings</p>
                        </MenuItem>
                    )}

                    <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <LogoutIcon />
                        </IconButton>
                        <p>Logout</p>
                    </MenuItem>
                </div>
            )}
            {!isLoggedIn && (
                <div>
                    <MenuItem onClick={() => handleNavigate('/register')}>
                        <IconButton
                            size="large"
                            aria-label="show 4 new mails"
                            color="inherit"
                        >
                            <LogoutIcon />
                        </IconButton>
                        <p>Register</p>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/login')}>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <LoginIcon />
                        </IconButton>
                        <p>Login</p>
                    </MenuItem>
                </div>
            )}
        </Menu>
    );

    const handleNavigate = (route: string) => {
        handleMenuClose();
        navigate(route);
    };

    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        handleNavigate(`/search?find=${searchInputQuery}`);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={() => handleNavigate('/')}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <img
                            data-testid="logo"
                            src={require('./logo.png')}
                            alt="logo"
                            className="w-8 h-8"
                        />
                    </IconButton>
                    <Link to="/">
                        <Typography
                            data-testid="brand-text"
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Filmilox
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1 }} />
                    <div className="max-w-7xl w-full">
                        <Search data-testid="search">
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <form onSubmit={handleSearchSubmit}>
                                <StyledInputBase
                                    fullWidth
                                    placeholder="Search…"
                                    onInput={(
                                        e: React.FormEvent<HTMLDivElement>
                                    ) => {
                                        setSearchInputQuery(
                                            (e.target as HTMLTextAreaElement)
                                                .value
                                        );
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                                <input type="submit" hidden />
                            </form>
                        </Search>
                    </div>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {!isLoggedIn && (
                            <>
                                <Button
                                    data-testid="loginBtn"
                                    onClick={() => handleNavigate('login')}
                                    variant="outlined"
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                >
                                    Login
                                </Button>
                                <Button
                                    data-testid="registerBtn"
                                    onClick={() => handleNavigate('register')}
                                    variant="outlined"
                                    color="inherit"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                        {isLoggedIn && (
                            <IconButton onClick={handleProfileMenuOpen}>
                                {imageProfile ? (
                                    <Avatar
                                        alt={username}
                                        src={ApiRouter.getImageLink(
                                            imageProfile
                                        )}
                                    />
                                ) : (
                                    <Avatar
                                        {...Controller.stringAvatar(username)}
                                    />
                                )}
                            </IconButton>
                        )}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
