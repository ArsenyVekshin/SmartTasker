import React, {useState} from "react";
import {Card, CardContent, Typography, Chip, IconButton} from "@mui/material";
import TaskDialog from "./TaskDialog";
import { Check as CheckIcon, Edit as EditIcon, Delete as DeleteIcon  } from "@mui/icons-material";
const TaskStatusChip = ({ task }) => {
    // Функция для определения стиля в зависимости от статуса
    const getStatusStyle = (status) => {
        switch (status) {
            case 'FREE':
                return { backgroundColor: 'rgba(76,175,80,0.4)', color: 'white' }; // Зеленый
            case 'OCCUPIED':
                return { backgroundColor: 'rgba(244,67,54,0.4)', color: 'white' }; // Красный
            case 'INPROGRESS':
                return { backgroundColor: 'rgba(255,152,0,0.4)', color: 'white' }; // Оранжевый
            case 'FINISHED':
                return { backgroundColor: 'rgba(33,150,243,0.4)', color: 'white' }; // Синий
            case 'CANCELED':
                return { backgroundColor: 'rgba(158,158,158,0.4)', color: 'white' }; // Серый
            case 'BLOCKED':
                return { backgroundColor: 'rgba(156,39,176,0.4)', color: 'white' }; // Фиолетовый
            case 'TROUBLES':
                return { backgroundColor: 'rgba(255,87,34,0.4)', color: 'white' }; // Красно-оранжевый
            default:
                return { backgroundColor: 'rgba(158,158,158,0.4)', color: 'white' }; // Серый по умолчанию
        }
    };

    return (
        <Chip
            label={`Status: ${task.status}`}
            size="small"
            style={{ marginTop: 5, ...getStatusStyle(task.status) }}
        />
    );
};
const TaskCard = ({ task, provided, onClick, onDeleteClick, onUpdate, onChange, onCancel }) => {
    const [openDialog, setOpenDialog] = useState(false);

    // Открытие диалога редактирования
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    // Закрытие диалога
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = onDeleteClick;

    // Обработка клика на карточку, чтобы не открывался диалог
    const handleCardClick = (event) => {
        event.stopPropagation(); // предотвращаем открытие диалога при клике на карточку
    };

    return (
        <>
            <Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                    marginBottom: 8,
                    cursor: "grab", // Указываем явно, что можно перетаскивать
                    position: "relative", // добавляем позиционирование для кнопки
                    ...provided.draggableProps.style, // Добавляем анимацию перетаскивания
                }}
                onClick={handleCardClick} // предотвращаем открытие диалога при клике на карточку
            >
                <CardContent>
                    <Typography variant="subtitle1">{task.name}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <TaskStatusChip task={task} />
                    <Chip label={`Owner: ${task.owner}`} size="small" style={{ marginTop: 5, marginLeft: 5 }} />
                </CardContent>

                {/* Кнопка изменения */}
                <IconButton
                    onClick={handleDialogOpen}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 8, // немного отодвигаем кнопку от галочки
                    }}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    onClick={handleDelete}
                    style={{
                        position: "absolute",
                        top: 8,
                        right: 40,
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Card>

            {/* Диалог изменения задачи */}
            {openDialog && <TaskDialog task={task} onClose={()=>{handleDialogClose(); onUpdate(task);}} onCancel={()=>{handleDialogClose(); onCancel();}} onUpdate={onChange} />}
        </>
    );
};
export default TaskCard;

