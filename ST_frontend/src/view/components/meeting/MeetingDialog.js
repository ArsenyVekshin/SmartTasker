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
    ListItemButton,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel, Checkbox, FormControlLabel
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import {getSuitablePlaces, getUsersList} from "../../../service/Service";
import CheckIcon from '@mui/icons-material/Check';
import { showErrorOnlyText } from "../ErrorMessage";

const MeetingDialog = ({ meeting, onClose, onUpdate, onCancel }) => {
    const [editedMeeting, setEditedMeeting] = useState(meeting || {});
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [placeDialogOpen, setPlaceDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [places, setPlaces] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(editedMeeting.members || []);
    const [allocate, setAllocate] = useState(false);

    function getCurrentDateTime(now) {    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    useEffect(() => {
        if(!meeting) return;
        if(!meeting.members) meeting.members= [];
        setEditedMeeting(meeting || {
            name: "",
            description: "",
            duration: 0,
            begin: getCurrentDateTime(new Date()),
            end: getCurrentDateTime(new Date(Date.now()+3600000)),
            repeatPeriod: 0,
            keypoint: null,
            place: null,
            members: [],
            owner: "", // Обязательное поле
            isOnline: false});
        setSelectedUsers(meeting.members || []);
        setAllocate((meeting || {
            name: "",
            description: "",
            duration: 0,
            begin: getCurrentDateTime(new Date()),
            end: getCurrentDateTime(new Date(Date.now()+3600000)),
            repeatPeriod: 0,
            keypoint: null,
            place: null,
            members: [],
            owner: "", // Обязательное поле
            isOnline: false}).place?.name==='');
        fetchUsersList();
    }, [meeting]);

    const fetchUsersList = async () => {
        setUsers(await getUsersList());
    };

    const fetchSuitablePlaces = async () => {
        if (meeting.id)
            setPlaces(await getSuitablePlaces(meeting.id));
        else
            setPlaces([{name: 'Сохраните встречу перед поиском свободного помещения'}])
    };

    const handleChange = (field) => (event) => {
        setEditedMeeting({ ...editedMeeting, [field]: event.target.value });
    };

    const handleUserDialogClose = () => {
        setUserDialogOpen(false);
    };

    const handlePlaceDialogClose = () => {
        setPlaceDialogOpen(false);
    };

    const handlePlaceDialogOpen = () => {
        fetchSuitablePlaces();
        setPlaceDialogOpen(true);

    };

    const handleUserSelect = (user) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(user)
                ? prevSelected.filter((u) => u !== user)
                : [...prevSelected, user]
        );
    };

    const handleSaveUsers = () => {
        
        setEditedMeeting({ ...editedMeeting, members: selectedUsers });
        setUserDialogOpen(false);
    };

    const handleSavePlace = (place) => {
        setEditedMeeting({ ...editedMeeting, place: { name: place } });
        setPlaceDialogOpen(false);
    };

    function checkBeforeUpdate() {
        if (new Date(editedMeeting.begin) >= new Date(editedMeeting.end))
            showErrorOnlyText('Время конца должно быть позднее времени начала');
        else if (editedMeeting.name === '')
            showErrorOnlyText('Встреча должна иметь название');
        // else if (editedMeeting.members.length == 0)
        //     showErrorOnlyText('Должен быть хотя бы один участник');
        else {
            onUpdate(editedMeeting, allocate);
        }
    }

    function isNum(str) {
        return (new RegExp(/^\d*$/).test(str)) && (str==='' || String(Number(str))===str);
    }

    return (
        <Dialog open={meeting!==null} onClose={onClose}>
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
                        <TextField fullWidth label="Начало" type="datetime-local" value={editedMeeting.begin || ""} onChange={handleChange("begin")} disabled={editedMeeting.id!==null} />
                    </Grid>

                    {/* Конец */}
                    <Grid item xs={6}>
                        <TextField fullWidth label="Конец" type="datetime-local" value={editedMeeting.end || ""} onChange={handleChange("end")} disabled={editedMeeting.id!==null} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth label="Repeat Period" type="number" value={editedMeeting.repeatPeriod || ""} onChange={(e)=>{if(isNum(e.target.value)) handleChange("repeatPeriod")(e.target.value)}} disabled={editedMeeting.id!==null} />
                    </Grid>


                    {/* Ключевая точка */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Ключевая точка" value={editedMeeting.keypoint?.name || "Не указано"} onChange={handleChange("keypoint.name")} />
                    </Grid>

                    {/* Участники */}
                    {editedMeeting.members && (
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
                    )}


                    {/* Место проведения */}
                    {editedMeeting.id && <Grid item xs={12}>
                        <Typography variant="h6" style={{ display: "flex", alignItems: "center" }}>
                            Место проведения: {editedMeeting.place?.name || "Не указано"}
                            {editedMeeting.members && editedMeeting.members.length > 0 && (
                                <IconButton onClick={handlePlaceDialogOpen} style={{ marginLeft: 8 }}>
                                    <AddIcon />
                                </IconButton>
                            )}

                        </Typography>
                        {editedMeeting.place?.name === "online" && (
                            <TextField
                                fullWidth
                                label="Ссылка"
                                value={editedMeeting.place?.link || ""}
                                onChange={handleChange("place.link")}
                                style={{ marginTop: 8 }}
                            />
                        )}
                    </Grid>}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
                <Button onClick={() => checkBeforeUpdate()} variant="contained" color="primary">Сохранить</Button>
            </DialogActions>

            {/* Диалог выбора пользователей */}
            <Dialog open={userDialogOpen} onClose={handleUserDialogClose}>
                <DialogTitle>Выберите участников</DialogTitle>
                <DialogContent>
                    <List>
                        {users.map((user, index) => (
                            <ListItemButton key={index} onClick={() => handleUserSelect(user)}>
                                {user}
                                {selectedUsers.includes(user) && (<CheckIcon style={{ position: 'absolute', right: 0 }} />)}
                            </ListItemButton>
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
                                <MenuItem key={index} value={place.name}>{place.name}</MenuItem>
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
