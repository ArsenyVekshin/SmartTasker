import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const timeSlots = Array.from({ length: 14 * 2 }, (_, i) => 8 * 60 + i * 30);
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const exampleEvents = [
    { id: 1, taskId: 101, meeting_id: 201, owner: "Иван Иванов", start: "2025-02-19T09:30:00Z", finish: "2025-02-19T10:30:00Z" },
    { id: 2, taskId: 102, meeting_id: 202, owner: "Петр Петров", start: "2025-02-20T13:00:00Z", finish: "2025-02-20T14:00:00Z" },
    { id: 3, taskId: 103, meeting_id: 203, owner: "Анна Смирнова", start: "2025-02-21T15:00:00Z", finish: "2025-02-21T18:00:00Z" }
];

const WeeklyCalendar = ({ events = exampleEvents }) => {
    const [groupedEvents, setGroupedEvents] = useState({});

    useEffect(() => {
        const grouped = events.reduce((acc, event) => {
            const day = dayjs.utc(event.start).day();
            if (!acc[day]) acc[day] = [];
            acc[day].push(event);
            return acc;
        }, {});
        setGroupedEvents(grouped);
    }, [events]);

    return (
        <Grid container spacing={1} sx={{ width: "100%", overflowX: "auto" }}>
            <Grid item xs={1} />
            {days.map((day, index) => (
                <Grid item xs key={index} sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1">{day}</Typography>
                </Grid>
            ))}
            {timeSlots.map((minute) => (
                <Grid container key={minute} sx={{ minHeight: 30, borderBottom: "1px solid #ccc", position: "relative" }}>
                    <Grid item xs={1} sx={{ textAlign: "right", pr: 1 }}>
                        <Typography variant="caption">{`${Math.floor(minute / 60)}:${(minute % 60).toString().padStart(2, "0")}`}</Typography>
                    </Grid>
                    {days.map((_, dayIndex) => (
                        <Grid item xs key={dayIndex} sx={{ position: "relative", borderRight: "1px solid #ddd", minHeight: 30 }}>
                            {groupedEvents[dayIndex]?.map((event) => {
                                const startMinute = dayjs.utc(event.start).hour() * 60 + dayjs.utc(event.start).minute();
                                const endMinute = dayjs.utc(event.finish).hour() * 60 + dayjs.utc(event.finish).minute();
                                const durationMinutes = endMinute - startMinute;
                                if (startMinute >= minute + 30 || startMinute + durationMinutes <= minute) return null;
                                return (
                                    <Paper
                                        key={event.id}
                                        sx={{
                                            position: "absolute",
                                            top: `${(startMinute - minute) * 3}px`,
                                            height: `${durationMinutes * 3}px`,
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
