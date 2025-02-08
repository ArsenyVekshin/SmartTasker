import React, {useState} from "react";
import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import MeetingCard from "./meeting/MeetingCard";
import MeetingDialog from "./meeting/MeetingDialog";

const MeetingList = ({ meetings }) => {
    const testMeetings = [
        {
            id: 1,
            name: "Ежедневная встреча",
            description: "Обсуждение текущих задач",
            begin: "2025-02-08T09:00:00Z",
            end: "2025-02-08T09:30:00Z",
            place: { id: 1, name: "Конференц-зал A", capacity: 10, available: true },
            keypoint: { id: 1, name: "Основной вопрос", timestamp: "2025-02-08T09:15:00Z" }
        },
        {
            id: 2,
            name: "Собрание отдела",
            description: "Разбор квартального отчета",
            begin: "2025-02-08T11:00:00Z",
            end: "2025-02-08T12:00:00Z",
            place: { id: 2, name: "Переговорная 2", capacity: 8, available: false },
            keypoint: { id: 2, name: "Презентация результатов", timestamp: "2025-02-08T11:30:00Z" }
        }
    ];
    meetings = testMeetings;

    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [editedName, setEditedName] = useState("");

    const handleEdit = (meeting) => {
        setSelectedMeeting(meeting);
        setEditedName(meeting.name);
    };

    const handleClose = () => {
        setSelectedMeeting(null);
    };

    return (
        <>
            <List>
                {meetings.map((meeting) => (
                    <ListItem key={meeting.id}>
                        <MeetingCard meeting={meeting} onEdit={handleEdit} />
                    </ListItem>
                ))}
            </List>
            <MeetingDialog meeting={selectedMeeting} editedName={editedName} setEditedName={setEditedName} onClose={handleClose} />
        </>
    );
};

export default MeetingList;
