import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import MeetingCard from "./meeting/MeetingCard";
import MeetingDialog from "./meeting/MeetingDialog";
import { getMeeting, getSchedule, createMeeting, getPlaces, createPlace, updateMeeting, getMeetings } from "../../service/Service";

const MeetingList = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = () => {
        getMeetings().then(meetings=>setMeetings(meetings));
    };

    const handleEdit = (meeting) => {
        setSelectedMeeting(meeting);
    };

    const handleClose = () => {
        setSelectedMeeting(null);
    };

    const handleCreate = () => {
        setSelectedMeeting({
            id: null,
            name: "",
            description: "",
            duration: 0,
            begin: "",
            end: "",
            repeatPeriod: 0,
            keypoint: {
                id: null,
                name: "",
                description: "",
                timestamp: ""
            },
            place: {
                id: null,
                name: "",
                address: "",
                capacity: 0,
                available: true
            },
            owner: "",
            isOnline: false
        });
    };

    const handleSave = (meeting) => {
        console.log(meeting);
        if (meeting.id !== null) {
            // Режим редактирования: используем updateMeeting
            updateMeeting(meeting.id, meeting)
                .then(response => {
                    setMeetings(meetings.map(meeting => meeting.id === response.id ? response : meeting));
                    setSelectedMeeting(null);
                })
                .catch(error => {
                    console.error("Error updating meeting:", error);
                });
        } else {
            // Режим создания: используем createMeeting
            createMeeting(meeting)
                .then(response => {
                    setMeetings([...meetings, response]);
                    setSelectedMeeting(null);
                })
                .catch(error => {
                    console.error("Error creating meeting:", error);
                });
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleCreate}>
                Создать мероприятие
            </Button>
            <List>
                {meetings.map((meeting) => (
                    <ListItem key={meeting.id}>
                        <MeetingCard meeting={meeting} onChange={handleEdit} onUpdate={handleSave}/>
                    </ListItem>
                ))}
            </List>
            {selectedMeeting && selectedMeeting.id == null && <MeetingDialog meeting={selectedMeeting} onClose={handleClose} onUpdate={handleSave} />}\
        </>
    );
};

export default MeetingList;