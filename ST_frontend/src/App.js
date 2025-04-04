import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


import {ThemeProvider} from '@mui/material/styles';
import AuthPage, {RegisterPage} from "./view/pages/AuthPage";
import PageNotFound from "./view/pages/PageNotFound";

import "./resources/index.css"
import NavBar from "./view/components/NavBar";
import theme from "./resources/theme";
import Footer from "./view/components/Footer";
import {Box} from "@mui/material";
import {useSelector} from "react-redux";
import ErrorMessage from "./view/components/ErrorMessage";
import KanbanBoard from "./view/components/KanbanBoard";
import WeeklyCalendar from "./view/components/WeeklyCalendar";
import MeetingList from "./view/components/MeetingList";

const App = () => {
    const user = useSelector(state => state.user);

    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
            >
                <Box flexGrow={1}>
                    <Router>
                        <div>
                            <NavBar/>
                            <div className="container-fluid mt-3">
                                <Routes>
                                    <Route path="/" element={<AuthPage/>}/>
                                    <Route path="/sign-in" element={<AuthPage/>}/>
                                    <Route path="/sign-up" element={<RegisterPage/>}/>
                                    {user.auth ? (
                                        <>
                                            <Route path="/main" element={<KanbanBoard/>}/>
                                            <Route path="/kanban" element={<KanbanBoard/>}/>
                                            <Route path="/schedule" element={<WeeklyCalendar/>}/>
                                            <Route path="/meetings" element={<MeetingList/>}/>
                                            <Route path="*" element={<PageNotFound/>}/>
                                        </>
                                    ) : (
                                        <Route path="*" element={<AuthPage/>}/>
                                    )}
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </Box>
                <ErrorMessage/>
                <Footer/>
            </Box>
        </ThemeProvider>
    );
}

export default App;
