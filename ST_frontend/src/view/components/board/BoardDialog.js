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

const BoardDialog = ({ board, onClose, onUpdate, onCancel }) => {
    if (!board) return null;
    return (
        <Dialog open={Boolean(board)} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Board</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="Name" value={board.name} onChange={(e)=>{board.name = e.target.value; onUpdate(board)}} />
                <TextField fullWidth margin="dense" label="Owner" value={board.owner} onChange={(e)=>{board.owner = e.target.value; onUpdate(board)}} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">{board.id===undefined?"Add board":"Edit board"}</Button>
                <Button onClick={onCancel} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BoardDialog;
