import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import AccountSwitch from '@mui/icons-material/SwitchAccount';
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../../store/userSlice";


import GroupsIcon from '@mui/icons-material/Groups';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const NavBar = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        dispatch(logOut());
        navigate('/sign-in');
    };

    const handleMenuClick = (path) => {
        handleClose();
        navigate(path);
    }

    return (
        <nav position="static">
            <Toolbar>
                <div style={{display: 'flex', alignItems: 'center', marginRight: 'auto'}}>
                    <Button color="inherit" onClick={() => navigate('/kanban')}>
                        <ViewKanbanIcon sx={{marginRight: 1}}/>
                        Kanban
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/schedule')}>
                        <CalendarMonthIcon sx={{marginRight: 1}}/>
                        Schedule
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/meetings')}>
                        <GroupsIcon sx={{marginRight: 1}}/>
                        Meetings
                    </Button>
                </div>

                {!user.auth && (
                    <div>
                        <Button color="inherit" onClick={() => navigate('/sign-in')}>Sing In</Button>
                        <Button color="inherit" onClick={() => navigate('/sign-up')} style={{marginLeft: '8px'}}>Sign
                            Up</Button>
                    </div>
                )}

                {user.auth && (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Button
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            color="inherit"
                        >
                            <AccountCircle sx={{marginRight: 1}}/> {user.username}
                        </Button>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => handleMenuClick('/sign-in')}>
                                <AccountSwitch sx={{marginRight: 1}}/> Change Account
                            </MenuItem>
                            <MenuItem onClick={handleLogOut}>
                                <Logout sx={{marginRight: 1}}/> Logout
                            </MenuItem>

                        </Menu>
                    </div>
                )}
            </Toolbar>
        </nav>
    );
};

export default NavBar;
