import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    List,
    ListItem,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";

const MeetingDialog = ({ meeting, onClose, onSave }) => {
    const [editedMeeting, setEditedMeeting] = useState(meeting || {});
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [placeDialogOpen, setPlaceDialogOpen] = useState(false);
    const [users, setUsers] = useState([
        "User 1", "User 2", "User 3", "User 4", "User 5" // Пример списка пользователей, надо запросить с бэка
    ]);
    const [places, setPlaces] = useState([
        "Room 1", "Room 2", "Room 3", "Online" // Пример списка мест, надо запрсоитьь с бэка
    ]);
    const [selectedUsers, setSelectedUsers] = useState(editedMeeting.members || []);

    useEffect(() => {
        setEditedMeeting(meeting || {});
        setSelectedUsers(editedMeeting.members || []);
    }, [meeting]);

    const handleChange = (field) => (event) => {
        setEditedMeeting({ ...editedMeeting, [field]: event.target.value });
    };

    const handleUserDialogClose = () => {
        setUserDialogOpen(false);
    };

    const handlePlaceDialogClose = () => {
        setPlaceDialogOpen(false);
    };

    const handleUserSelect = (user) => {
        setSelectedUsers([...selectedUsers, user]);
    };

    const handleSaveUsers = () => {
        setEditedMeeting({ ...editedMeeting, members: selectedUsers });
        setUserDialogOpen(false);
    };

    const handleSavePlace = (place) => {
        setEditedMeeting({ ...editedMeeting, place: { name: place } });
        setPlaceDialogOpen(false);
    };

    if (!meeting) return null;

    return (
        <Dialog open={Boolean(meeting)} onClose={onClose}>
            <DialogTitle>Редактирование встречи</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {/* Название */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Название" value={editedMeeting.name || ""} onChange={handleChange("name")} />
                    </Grid>

                    {/* Описание */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Описание" value={editedMeeting.description || ""} onChange={handleChange("description")} />
                    </Grid>

                    {/* Начало */}
                    <Grid item xs={6}>
                        <TextField fullWidth label="Начало" type="datetime-local" value={editedMeeting.begin || ""} onChange={handleChange("begin")} />
                    </Grid>

                    {/* Конец */}
                    <Grid item xs={6}>
                        <TextField fullWidth label="Конец" type="datetime-local" value={editedMeeting.end || ""} onChange={handleChange("end")} />
                    </Grid>



                    {/* Ключевая точка */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Ключевая точка" value={editedMeeting.keypoint?.name || "Не указано"} onChange={handleChange("keypoint.name")} />
                    </Grid>

                    {/* Участники */}
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ display: "flex", alignItems: "center" }}>
                            Участники ({editedMeeting.members.length})
                            <IconButton onClick={() => setUserDialogOpen(true)} style={{ marginLeft: 8 }}>
                                <AddIcon />
                            </IconButton>
                        </Typography>
                        {editedMeeting.members && (
                            <List>
                                {editedMeeting.members.map((member, index) => (
                                    <ListItem key={index}><AccountCircle sx={{ marginRight: 1 }} />{member}</ListItem>
                                ))}
                            </List>
                        )}
                    </Grid>
                    {/* Место проведения */}
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ display: "flex", alignItems: "center" }}>
                            Место проведения: {editedMeeting.place?.name || "Не указано"}
                            <IconButton onClick={() => setPlaceDialogOpen(true)} style={{ marginLeft: 8 }}>
                                <AddIcon />
                            </IconButton>
                        </Typography>
                        {editedMeeting.place?.name === "Online" && (
                            <TextField
                                fullWidth
                                label="Ссылка"
                                value={editedMeeting.place?.link || ""}
                                onChange={handleChange("place.link")}
                                style={{ marginTop: 8 }}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
                <Button onClick={() => onSave(editedMeeting)} variant="contained" color="primary">Сохранить</Button>
            </DialogActions>

            {/* Диалог выбора пользователей */}
            <Dialog open={userDialogOpen} onClose={handleUserDialogClose}>
                <DialogTitle>Выберите участников</DialogTitle>
                <DialogContent>
                    <List>
                        {users.map((user, index) => (
                            <ListItem button key={index} onClick={() => handleUserSelect(user)}>
                                {user}
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUserDialogClose}>Отмена</Button>
                    <Button onClick={handleSaveUsers} variant="contained" color="primary">Сохранить</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог выбора места */}
            <Dialog open={placeDialogOpen} onClose={handlePlaceDialogClose}>
                <DialogTitle>Выберите место проведения</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel>Место</InputLabel>
                        <Select
                            value={editedMeeting.place?.name || ""}
                            onChange={(event) => handleSavePlace(event.target.value)}
                        >
                            {places.map((place, index) => (
                                <MenuItem key={index} value={place}>{place}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePlaceDialogClose}>Отмена</Button>
                    <Button onClick={handleSavePlace} variant="contained" color="primary">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default MeetingDialog;
