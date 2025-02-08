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

const TaskDialog = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <Dialog open={Boolean(task)} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="Name" value={task.name} />
                <TextField fullWidth margin="dense" label="Description" value={task.description} />

                {/* Status Field as Select */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select value={task.status} label="Status">
                        <MenuItem value="FREE">FREE</MenuItem>
                        <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
                        <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
                        <MenuItem value="FINISHED">FINISHED</MenuItem>
                        <MenuItem value="CANCELED">CANCELED</MenuItem>
                        <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                        <MenuItem value="TROUBLES">TROUBLES</MenuItem>
                    </Select>
                </FormControl>

                {/* Repeat Period Field as datetime-local */}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Repeat Period"
                    type="datetime-local"
                    value={task.repeatPeriod}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField fullWidth margin="dense" label="Start" type="datetime-local" value={task.start} />
                <TextField fullWidth margin="dense" label="Finish" type="datetime-local" value={task.finish} />

                <Typography variant="h6" gutterBottom>Keypoint</Typography>
                <TextField fullWidth margin="dense" label="Keypoint Name" value={task.keypoint.name} />
                <TextField fullWidth margin="dense" label="Keypoint Description" value={task.keypoint.description} />
                <TextField fullWidth margin="dense" label="Keypoint Timestamp" type="datetime-local" value={task.keypoint.timestamp} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDialog;
