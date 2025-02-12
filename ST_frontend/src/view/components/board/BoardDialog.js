import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { showErrorOnlyText } from "../ErrorMessage";

const BoardDialog = ({ board, onClose, onUpdate, onCancel }) => {
    if (!board) return null;

    function checkAndClose() {
        if (board.name !== '')
            onClose();
        else
            showErrorOnlyText('Название доски не должно быть пустым');
    }

    return (
        <Dialog open={Boolean(board)} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>Edit Board</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="Name" value={board.name} onChange={(e)=>{board.name = e.target.value; onUpdate(board)}} required />
                <TextField fullWidth margin="dense" label="Owner" value={board.owner} onChange={(e)=>{board.owner = e.target.value; onUpdate(board)}} />
            </DialogContent>
            <DialogActions>
                <Button onClick={checkAndClose} color="primary">{board.id===undefined?"Add board":"Edit board"}</Button>
                <Button onClick={onCancel} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BoardDialog;
