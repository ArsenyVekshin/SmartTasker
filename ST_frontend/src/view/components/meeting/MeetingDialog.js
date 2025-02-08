import React, { useState } from "react";
import { Card, CardContent, Typography, List, ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";


const MeetingDialog = ({ meeting, editedName, setEditedName, onClose }) => {
    return (
        <Dialog open={Boolean(meeting)} onClose={onClose}>
            <DialogTitle>Редактирование встречи</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Название"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={onClose} variant="contained" color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MeetingDialog;
