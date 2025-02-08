import React, { useState } from "react";
import { Card, CardContent, Typography, List, ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";


const MeetingCard = ({ meeting, onEdit }) => {
    return (
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
                <Button variant="contained" color="primary" onClick={() => onEdit(meeting)}>
                    Редактировать
                </Button>
            </CardContent>
        </Card>
    );
};

export default MeetingCard;