import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton
} from "@mui/material";
import {Edit as EditIcon} from "@mui/icons-material";
import TaskDialog from "../task/TaskDialog";
import MeetingDialog from "./MeetingDialog";


const MeetingCard = ({ meeting, onClick, onDeleteClick, onUpdate, onChange, onCancel }) => {
    const [openDialog, setOpenDialog] = useState(false);

    // Открытие диалога редактирования
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    // Закрытие диалога
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = onDeleteClick;

    return (
        <>
            <Card sx={{ width: "100%", mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">{meeting.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {meeting.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Начало: {new Date(meeting.begin).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Окончание: {new Date(meeting.end).toLocaleString()}
                    </Typography>
                    {meeting.place && (
                        <Typography variant="body2" color="text.secondary">
                            Место: {meeting.place.name} (вместимость: {meeting.place.capacity})
                        </Typography>
                    )}
                    {meeting.keypoint && (
                        <Typography variant="body2" color="text.secondary">
                            Ключевая точка: {meeting.keypoint.name} - {new Date(meeting.keypoint.timestamp).toLocaleString()}
                        </Typography>
                    )}
                    {/*<Button variant="contained" color="primary" onClick={() => onEdit(meeting)}>*/}
                    {/*    Редактировать*/}
                    {/*</Button>*/}
                    <IconButton
                        onClick={handleDialogOpen}
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 15, // немного отодвигаем кнопку от галочки
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </CardContent>
            </Card>
            {openDialog && <MeetingDialog meeting={meeting} onClose={()=>{handleDialogClose();}} onCancel={()=>{handleDialogClose(); onCancel();}} onUpdate={(meeting)=>{handleDialogClose();onUpdate(meeting);}} />}

        </>
    );
};

export default MeetingCard;