import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    TextField,
    IconButton
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {getMeeting, getSchedule, getTask, initWorkday} from "../../service/Service";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
dayjs.extend(utc);

const timeSlots = Array.from({ length: 14 * 2 }, (_, i) => 8 * 60 + i * 30);
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekDays(baseDate, offsetWeeks = 0) {
    const inputDate = new Date(baseDate);
    inputDate.setDate(inputDate.getDate() + offsetWeeks * 7);
    const dayOfWeek = inputDate.getDay();
    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const formatDate = (date) => date.toISOString().split('T')[0];
    return Array.from({ length: 7 }, (_, i) => {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        return { day: days[i], date: formatDate(currentDate) };
    });
}

const WeeklyCalendar = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [groupedEvents, setGroupedEvents] = useState({});
    const [events, setEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const sendInitWorkDay = () => {
        setOpenDialog(false);
        console.log("Начало рабочего дня:", startTime);
        console.log("Конец рабочего дня:", endTime);
        initWorkday(startTime, endTime);
    };

    useEffect(() => {
        const weekDays = getWeekDays(new Date(), weekOffset);
        Promise.all(weekDays.map(({ date }) => getSchedule(date)))
            .then(schedule => {
                let events = schedule.reduce((sum, a) => sum.concat(a), []);
                events = events.map(ev => { ev.start += 'Z'; ev.finish += 'Z'; return ev; });
                return Promise.all(events.map(ev => {
                    if (ev.taskId != null)
                        return getTask(ev.taskId).then(task => ({ ...ev, name: task.name }));
                    else if (ev.meetingId != null)
                        return getMeeting(ev.meetingId).then(meeting => ({ ...ev, name: meeting.name }));
                    else
                        return Promise.resolve({ ...ev, name: 'Чилл' });
                }));
            })
            .then(events => {
                setEvents(events);
                const grouped = events.reduce((acc, event) => {
                    const day = dayjs.utc(event.start).day();
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(event);
                    return acc;
                }, {});
                setGroupedEvents(grouped);
            })
            .catch(e => console.log(e));
    }, [weekOffset]);

    const weekDays = getWeekDays(new Date(), weekOffset);

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2} >
                <IconButton size="small" onClick={() => setWeekOffset(weekOffset - 1)}><ArrowBackIosIcon/></IconButton>
                <Typography variant="h6" sx={{ ml: 2 }}>Неделя {weekOffset >= 0 ? `+${weekOffset}` : weekOffset}</Typography>
                <IconButton size="small" onClick={() => setWeekOffset(weekOffset + 1)} sx={{ ml: 2 }}><ArrowForwardIosIcon/></IconButton>
                <Box display="flex" ml="auto" mb={2}>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                        Запланировать рабочий день
                    </Button>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Запланировать рабочий день на неделю</DialogTitle>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Начало рабочего дня"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <TextField
                        label="Конец рабочего дня"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <Button onClick={sendInitWorkDay} color="primary">Создать</Button>
                </Box>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Закрыть</Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={1} sx={{ width: "100%", overflowX: "auto" }}>
                <Grid item xs={1} />
                {weekDays.map(({ day, date }, index) => (
                    <Grid item xs key={index} sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle1">{day} ({date})</Typography>
                    </Grid>
                ))}
                {timeSlots.map((minute) => (
                    <Grid container key={minute} sx={{ minHeight: '30px', borderBottom: "1px solid #ccc", position: "relative" }}>
                        <Grid item xs={1} sx={{ textAlign: "right", pr: 1 }}>
                            <Typography variant="caption">{`${Math.floor(minute / 60)}:${(minute % 60).toString().padStart(2, "0")}`}</Typography>
                        </Grid>
                        {days.map((_, dayIndex) => (
                            <Grid item xs key={dayIndex} sx={{ position: "relative", borderRight: "1px solid #ddd", minHeight: '30px' }}>
                                {groupedEvents[dayIndex]?.map((event) => {
                                    const startMinute = dayjs.utc(event.start).hour() * 60 + dayjs.utc(event.start).minute();
                                    const endMinute = dayjs.utc(event.finish).hour() * 60 + dayjs.utc(event.finish).minute();
                                    const durationMinutes = endMinute - startMinute;
                                    if (startMinute < minute || startMinute >= minute + 30) return null;
                                    return (
                                        <Paper
                                            key={event.id}
                                            sx={{
                                                position: "absolute",
                                                top: `${(startMinute - minute)}px`,
                                                height: `${durationMinutes * (1 + 1 / 31)}px`,
                                                width: "100%",
                                                backgroundColor: "#1976d2",
                                                color: "white",
                                                padding: "4px",
                                                fontSize: "0.75rem",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            {event.name}
                                        </Paper>
                                    );
                                })}
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default WeeklyCalendar;
