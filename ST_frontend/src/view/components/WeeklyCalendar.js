import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, duration } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getSchedule } from "../../service/Service";
dayjs.extend(utc);

const timeSlots = Array.from({ length: 14 * 2 }, (_, i) => 8 * 60 + i * 30);
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekDays(date) {
    // Создаем копию переданной даты, чтобы не изменять оригинал
    const inputDate = new Date(date);

    // Определяем день недели для переданной даты (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    const dayOfWeek = inputDate.getDay();

    // Находим дату понедельника текущей недели
    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Если воскресенье, то отнимаем 6 дней

    // Форматируем даты в строку (например, "YYYY-MM-DD")
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Создаем массив с датами для каждого дня недели
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        weekDays.push(formatDate(currentDate));
    }

    return weekDays;
}

const WeeklyCalendar = () => {
    const [groupedEvents, setGroupedEvents] = useState({});
    const [events, setEvents] = useState([]);

    useEffect(() => {
        Promise.all(getWeekDays(new Date()).map(date=>getSchedule(date)))
        .then(schedule=>{
            let events = schedule.reduce((sum, a)=>sum.concat(a));
            events = events.map(ev=>{ev.start += 'Z'; ev.finish += 'Z'; return ev;});
            setEvents(events);
            const grouped = events.reduce((acc, event) => {
                const day = dayjs.utc(event.start).day();
                if (!acc[day]) acc[day] = [];
                acc[day].push(event);
                return acc;
            }, {});
            setGroupedEvents(grouped);
        })
        .catch((e)=>console.log(e));
    }, []);

    return (
        <Grid container spacing={1} sx={{ width: "100%", overflowX: "auto" }}>
            <Grid item xs={1} />
            {days.map((day, index) => (
                <Grid item xs key={index} sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1">{day}</Typography>
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
                                            height: `${durationMinutes*(1+1/31)}px`,
                                            width: "100%",
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            padding: "4px",
                                            fontSize: "0.75rem",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        {event.owner}
                                    </Paper>
                                );
                            })}
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Grid>
    );
};

export default WeeklyCalendar;
