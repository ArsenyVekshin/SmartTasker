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

const TaskDialog = ({ task, onClose, onUpdate, onCancel }) => {
    if (!task) return null;
    if (task.keypoint === null)
        task.keypoint = {
            name: "Keypoint",
            description: "Milestone",
            timestamp: new Date().toISOString(),
        };

    // Check if the task is "INPROGRESS" or "OCCUPIED"
    const isStatusLocked = task.status === "INPROGRESS" || task.status === "OCCUPIED";

    return (
        <Dialog open={Boolean(task)} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="Name" value={task.name} onChange={(e) => { task.name = e.target.value; onUpdate(task); }} />
                <TextField fullWidth margin="dense" label="Owner" value={task.owner} onChange={(e) => { task.owner = e.target.value; onUpdate(task); }} />
                <TextField fullWidth margin="dense" label="Description" value={task.description} onChange={(e) => { task.description = e.target.value; onUpdate(task); }} />

                {/* Status Field as Select */}
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select value={task.status} label="Status" onChange={(e) => { task.status = e.target.value; onUpdate(task); }} >
                        <MenuItem value="FREE">FREE</MenuItem>
                        <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
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
                    value={task.repeatPeriod}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { task.repeatPeriod = e.target.value; onUpdate(task); }}
                    disabled={isStatusLocked} // Disable if task is "INPROGRESS" or "OCCUPIED"
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Duration"
                    type="number"
                    value={task.duration}
                    onChange={(e) => { task.duration = e.target.value; onUpdate(task); }}
                    disabled={isStatusLocked} // Disable if task is "INPROGRESS" or "OCCUPIED"
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Start"
                    type="datetime-local"
                    value={task.start.replace('Z', '')}
                    onChange={(e) => { task.start = e.target.value; onUpdate(task); }}
                    disabled={isStatusLocked} // Disable if task is "INPROGRESS" or "OCCUPIED"
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Finish"
                    type="datetime-local"
                    value={task.finish.replace('Z', '')}
                    onChange={(e) => { task.finish = e.target.value; onUpdate(task); }}
                    disabled={isStatusLocked} // Disable if task is "INPROGRESS" or "OCCUPIED"
                />

                <Typography variant="h6" gutterBottom>Keypoint</Typography>
                <TextField fullWidth margin="dense" label="Keypoint Name" value={task.keypoint.name} />
                <TextField fullWidth margin="dense" label="Keypoint Description" value={task.keypoint.description} />
                <TextField fullWidth margin="dense" label="Keypoint Timestamp" type="datetime-local" value={task.keypoint.timestamp.replace('Z', '')} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">{task.id === undefined ? "Add task" : "Edit task"}</Button>
                <Button onClick={onCancel} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDialog;