import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem, Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskCard from "./task/TaskCard";
import TaskDialog from "./task/TaskDialog";
import BoardDialog from "./board/BoardDialog";
import {
    createBoard,
    deleteBoard,
    updateBoard,
    createTask,
    deleteTask,
    updateTask,
    getMyTasksOnBoards,
    getOwnedBoards,
    getTask,
    allocateOccupiedTasks
} from '../../service/Service';

// const initialBoards = [
//     { id: 1, name: "Board 1", owner: "User A" },
//     { id: 2, name: "Board 2", owner: "User B" },
// ];

// const initialTasks = [];

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [boards, setBoards] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const importTasks = () => getMyTasksOnBoards()
        .then((resp)=>{
            let localBoards = resp.map((boardContentDto)=>(
                boardContentDto.list[0].board
            ));
            getOwnedBoards().then((arr)=>{
                arr.forEach(i=>{
                    if(!localBoards.map(b=>b.id).includes(i.id))
                        localBoards = localBoards.concat(i);
                    });
                    setBoards(localBoards);
                });
            setTasks(resp.map((boardContentDto)=>(
                boardContentDto.list
            )).reduce((partSum, a)=>partSum.concat(a)));
        })

    useEffect(()=>{importTasks()}, [])

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;
        if (source.droppableId === destination.droppableId) return;
        const updatedTask = tasks.find((task) => task.id.toString() === draggableId);

        if (!updatedTask) return;

        const newTask = {
            ...updatedTask,
            board: { id: parseInt(destination.droppableId, 10) },
        };

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id.toString() === draggableId ? newTask : task
            )
        );
        updateTask(newTask)
    };

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

    const handleCreateTask = (boardId) => {
        setSelectedTask({
            name: `New Task ${tasks.length + 1}`,
            description: "Description here...",
            status: "FREE",
            board: { id: boardId },
            duration: 60,
            start: getCurrentDateTime(new Date()),
            finish: getCurrentDateTime(new Date(Date.now() + 3600000)),
            repeatPeriod: 0,
            keypoint: {
                name: "Keypoint",
                description: "Milestone",
                timestamp: new Date().toISOString(),
            },
        });
    };

    const handleCreateBoard = () => {
        setSelectedBoard({
            name: `Board ${boards.length + 1}`,
            owner: localStorage.getItem('username'),
        });
        setOpenDialog(true);
    };

    const handleMenuOpen = (event, board) => {
        setMenuAnchor(event.currentTarget);
        setSelectedBoard(board);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedBoard(null);
    };

    const handleSchedule = () => {
        allocateOccupiedTasks().then(importTasks);
    };


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Container>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCreateBoard}
                        style={{ marginRight: 10 }}
                    >
                        Новая доска
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSchedule}
                    >
                        Спланировать расписание
                    </Button>
                </Box>
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
                                                                onDeleteClick={() => deleteTask(task.id).then(importTasks)}
                                                                onChange={(updatedTask)=>setTasks(tasks.map((task)=>task.id===updatedTask.id?updatedTask:task))}
                                                                onUpdate={(updatedTask)=>updateTask(updatedTask).then(importTasks)}
                                                                onCancel={()=>getTask(task.id).then(importTasks)}
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
                                    color="secondary"
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
                    <MenuItem onClick={(e)=>{setOpenDialog(true); setMenuAnchor(false);}}>Редактировать</MenuItem>
                    <MenuItem onClick={(e)=>{deleteBoard(selectedBoard.id).then(importTasks); setMenuAnchor(false);}}>Удалить</MenuItem>
                </Menu>
            </Container>
            <TaskDialog 
                task={selectedTask}
                onClose={()=>{setSelectedTask(null); createTask(selectedTask).then(importTasks);}}
                onUpdate={(newTask)=>setSelectedTask({...newTask})}
                onCancel={()=>setSelectedTask(null)}
            />
            {openDialog && <BoardDialog 
                board={selectedBoard}
                onClose={() => {setSelectedBoard(null); setOpenDialog(false); (selectedBoard.id === undefined?createBoard(selectedBoard):updateBoard(selectedBoard)).then(importTasks);}}
                onUpdate={() => {setSelectedBoard({...selectedBoard})}}
                onCancel={() => {setSelectedBoard(null); setOpenDialog(false); importTasks();}}
            />}
        </DragDropContext>
    );
};

export default KanbanBoard;
