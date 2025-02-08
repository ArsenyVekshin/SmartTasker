import React, { useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskCard from "./task/TaskCard";
import TaskDialog from "./task/TaskDialog";

const initialBoards = [
    { id: 1, name: "Board 1", owner: "User A" },
    { id: 2, name: "Board 2", owner: "User B" },
];

const initialTasks = [];

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [boards, setBoards] = useState(initialBoards);
    const [selectedTask, setSelectedTask] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;
        if (source.droppableId === destination.droppableId) return;

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id.toString() === draggableId
                    ? { ...task, board: { id: parseInt(destination.droppableId, 10) } }
                    : task
            )
        );
    };

    const handleCreateTask = (boardId) => {
        const newTask = {
            id: tasks.length + 1,
            name: `New Task ${tasks.length + 1}`,
            description: "Description here...",
            status: "FREE",
            owner: "User A",
            board: { id: boardId },
            duration: 60,
            start: new Date().toISOString(),
            finish: new Date(Date.now() + 3600000).toISOString(),
            repeatPeriod: 0,
            keypoint: {
                id: 0,
                name: "Keypoint",
                description: "Milestone",
                timestamp: new Date().toISOString(),
            },
        };
        setTasks([...tasks, newTask]);
    };

    const handleCreateBoard = () => {
        const newBoard = {
            id: boards.length + 1,
            name: `Board ${boards.length + 1}`,
            owner: "User A",
        };
        setBoards([...boards, newBoard]);
    };

    const handleMenuOpen = (event, board) => {
        setMenuAnchor(event.currentTarget);
        setSelectedBoard(board);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedBoard(null);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Container>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleCreateBoard}
                    style={{ marginBottom: 20 }}
                >
                    Новая доска
                </Button>
                <Grid container spacing={2}>
                    {boards.map((board) => (
                        <Grid item xs={12} sm={6} md={4} key={board.id}>
                            <Paper elevation={3} style={{ padding: 10, minHeight: 400, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        {board.name} (Owner: {board.owner})
                                    </Typography>
                                    <IconButton onClick={(event) => handleMenuOpen(event, board)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                                <Droppable droppableId={board.id.toString()}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, minHeight: 350 }}>
                                            {tasks
                                                .filter((task) => task.board.id === board.id)
                                                .map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <TaskCard
                                                                task={task}
                                                                provided={provided}
                                                                onClick={() => setSelectedTask(task)}
                                                            />
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleCreateTask(board.id)}
                                    style={{ marginTop: 10 }}
                                >
                                    Новая задача
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleMenuClose}>Редактировать</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Удалить</MenuItem>
                </Menu>
            </Container>
            <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />
        </DragDropContext>
    );
};

export default KanbanBoard;
