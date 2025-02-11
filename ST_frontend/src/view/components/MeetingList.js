import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import MeetingCard from "./meeting/MeetingCard";
import MeetingDialog from "./meeting/MeetingDialog";
import { getMeeting, getSchedule, createMeeting, getPlaces, createPlace, updateMeeting, getMeetings } from "../../service/Service";

const MeetingList = () => {
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Режим редактирования
    const [places, setPlaces] = useState([]);
    const [newMeeting, setNewMeeting] = useState({
        id: null, // Добавлено поле id для редактирования
        name: "",
        description: "",
        duration: 0,
        begin: "",
        end: "",
        repeatPeriod: 0,
        keypoint: {
            id: null,
            name: "",
            description: "",
            timestamp: ""
        },
        place: {
            id: null,
            name: "",
            address: "",
            capacity: 0,
            available: true
        },
        owner: "", // Обязательное поле
        isOnline: false
    });

    const [isCreatingPlace, setIsCreatingPlace] = useState(false);
    const [newPlace, setNewPlace] = useState({
        name: "",
        address: "",
        capacity: 0,
        available: true
    });

    const [errors, setErrors] = useState({
        owner: false // Ошибка, если поле owner не заполнено
    });

    useEffect(() => {
        fetchMeetings();
        fetchPlaces();
    }, []);

    const fetchMeetings = () => {
        getMeetings().then(meetings=>setMeetings(meetings));
    };

    const fetchPlaces = () => {
        return getPlaces().then(places => setPlaces(places));
    };

    const handleEdit = (meeting) => {
        setSelectedMeeting(meeting);
        setNewMeeting(meeting); // Заполняем форму данными встречи
        setIsEditing(true); // Включаем режим редактирования
        setIsCreating(true); // Открываем диалог
    };

    const handleClose = () => {
        setSelectedMeeting(null);
        setIsEditing(false); // Сбрасываем режим редактирования
        handleCancelCreate(); // Сбрасываем форму
    };

    const handleCreate = () => {
        setIsCreating(true);
        setIsEditing(false); // Сбрасываем режим редактирования
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewMeeting({
            id: null,
            name: "",
            description: "",
            duration: 0,
            begin: "",
            end: "",
            repeatPeriod: 0,
            keypoint: {
                id: null,
                name: "",
                description: "",
                timestamp: ""
            },
            place: {
                id: null,
                name: "",
                address: "",
                capacity: 0,
                available: true
            },
            owner: "",
            isOnline: false
        });
        setErrors({ owner: false }); // Сброс ошибок
    };

    const handleSave = () => {
        // Проверка обязательного поля owner
        if (!newMeeting.owner) {
            setErrors({ owner: true });
            return;
        }

        const meetingToSend = {
            ...newMeeting,
            place: newMeeting.isOnline
                ? {
                    id: null,
                    name: "Онлайн встреча",
                    address: newMeeting.place.address,
                    capacity: 150,
                    available: true
                }
                : newMeeting.place,
            keypoint: newMeeting.keypoint.name ? newMeeting.keypoint : null // Если keypoint не заполнен, отправляем null
        };

        if (isEditing) {
            // Режим редактирования: используем updateMeeting
            updateMeeting(newMeeting.id, meetingToSend)
                .then(response => {
                    setMeetings(meetings.map(meeting => meeting.id === response.id ? response : meeting));
                    setIsCreating(false);
                    handleCancelCreate();
                })
                .catch(error => {
                    console.error("Error updating meeting:", error);
                });
        } else {
            // Режим создания: используем createMeeting
            createMeeting(meetingToSend)
                .then(response => {
                    setMeetings([...meetings, response]);
                    setIsCreating(false);
                    handleCancelCreate();
                })
                .catch(error => {
                    console.error("Error creating meeting:", error);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleKeypointChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting(prevState => ({
            ...prevState,
            keypoint: {
                ...prevState.keypoint,
                [name]: value
            }
        }));
    };

    const handlePlaceChange = (e) => {
        const selectedPlaceId = e.target.value;
        const selectedPlace = places.find(place => place.id === selectedPlaceId);
        setNewMeeting(prevState => ({
            ...prevState,
            place: selectedPlace || {
                id: null,
                name: "",
                address: "",
                capacity: 0,
                available: true
            }
        }));
    };

    const handleOnlineChange = (e) => {
        const isOnline = e.target.checked;
        setNewMeeting(prevState => ({
            ...prevState,
            isOnline,
            place: {
                ...prevState.place,
                address: isOnline ? prevState.place.address : ""
            }
        }));
    };

    const handleCreatePlace = () => {
        setIsCreatingPlace(true);
    };

    const handleCancelCreatePlace = () => {
        setIsCreatingPlace(false);
        setNewPlace({
            name: "",
            address: "",
            capacity: 0,
            available: true
        });
    };

    const handleSavePlace = () => {
        createPlace(newPlace)
            .then(() => {
                return fetchPlaces();
            })
            .then(() => {
                const newPlaceInList = places.find(place => place.name === newPlace.name && place.address === newPlace.address);
                if (newPlaceInList) {
                    setNewMeeting(prevState => ({
                        ...prevState,
                        place: newPlaceInList
                    }));
                }
                setIsCreatingPlace(false);
                handleCancelCreatePlace();
            })
            .catch(error => {
                console.error("Error creating place:", error);
            });
    };

    const handlePlaceInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleCreate}>
                Создать мероприятие
            </Button>
            <List>
                {meetings.map((meeting) => (
                    <ListItem key={meeting.id}>
                        <MeetingCard meeting={meeting} onEdit={handleEdit} />
                    </ListItem>
                ))}
            </List>
            <MeetingDialog meeting={selectedMeeting} onClose={handleClose} />

            <Dialog open={isCreating} onClose={handleCancelCreate}>
                <DialogTitle>{isEditing ? "Редактировать мероприятие" : "Создать новое мероприятие"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Название"
                        fullWidth
                        value={newMeeting.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Описание"
                        fullWidth
                        value={newMeeting.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="duration"
                        label="Длительность (в минутах)"
                        fullWidth
                        type="number"
                        value={newMeeting.duration}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="begin"
                        label="Начало"
                        fullWidth
                        type="datetime-local"
                        value={newMeeting.begin}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="end"
                        label="Конец"
                        fullWidth
                        type="datetime-local"
                        value={newMeeting.end}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="repeatPeriod"
                        label="Период повторения"
                        fullWidth
                        type="number"
                        value={newMeeting.repeatPeriod}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="owner"
                        label="Владелец*"
                        fullWidth
                        value={newMeeting.owner}
                        onChange={handleChange}
                        error={errors.owner}
                        helperText={errors.owner ? "Поле обязательно для заполнения" : ""}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newMeeting.isOnline}
                                onChange={handleOnlineChange}
                                name="isOnline"
                            />
                        }
                        label="Онлайн встреча"
                    />
                    {newMeeting.isOnline ? (
                        <TextField
                            margin="dense"
                            name="place.address"
                            label="Ссылка на онлайн встречу"
                            fullWidth
                            value={newMeeting.place.address}
                            onChange={(e) =>
                                setNewMeeting(prevState => ({
                                    ...prevState,
                                    place: {
                                        ...prevState.place,
                                        address: e.target.value
                                    }
                                }))
                            }
                        />
                    ) : (
                        <>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Место встречи</InputLabel>
                                <Select
                                    value={newMeeting.place.id || ""}
                                    onChange={handlePlaceChange}
                                    label="Место встречи"
                                >
                                    {places.map(place => (
                                        <MenuItem key={place.id} value={place.id}>
                                            {place.name} ({place.address})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button onClick={handleCreatePlace} color="primary">
                                Создать новое место
                            </Button>
                        </>
                    )}
                    <TextField
                        margin="dense"
                        name="keypoint.name"
                        label="Название ключевой точки"
                        fullWidth
                        value={newMeeting.keypoint.name}
                        onChange={handleKeypointChange}
                    />
                    <TextField
                        margin="dense"
                        name="keypoint.description"
                        label="Описание ключевой точки"
                        fullWidth
                        value={newMeeting.keypoint.description}
                        onChange={handleKeypointChange}
                    />
                    <TextField
                        margin="dense"
                        name="keypoint.timestamp"
                        label="Время ключевой точки"
                        fullWidth
                        type="datetime-local"
                        value={newMeeting.keypoint.timestamp}
                        onChange={handleKeypointChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCreate} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {isEditing ? "Сохранить изменения" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCreatingPlace} onClose={handleCancelCreatePlace}>
                <DialogTitle>Создать новое место</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Название места"
                        fullWidth
                        value={newPlace.name}
                        onChange={handlePlaceInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Адрес"
                        fullWidth
                        value={newPlace.address}
                        onChange={handlePlaceInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="capacity"
                        label="Вместимость"
                        fullWidth
                        type="number"
                        value={newPlace.capacity}
                        onChange={handlePlaceInputChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newPlace.available}
                                onChange={(e) =>
                                    setNewPlace(prevState => ({
                                        ...prevState,
                                        available: e.target.checked
                                    }))
                                }
                                name="available"
                            />
                        }
                        label="Доступно"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCreatePlace} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSavePlace} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MeetingList;