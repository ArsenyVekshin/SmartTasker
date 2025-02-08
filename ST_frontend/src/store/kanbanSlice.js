import {createSlice} from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
    name: 'kanban',
    initialState: {
        boards: [],
        tasks: []
    },
    reducers: {
        addTask(state, action) {
            state.task.unshift(action.payload);
        },
        addBoard(state, action) {
            state.task.unshift(action.payload);
        },
        setBoards(state, action) {
            state.boards = action.payload;
        },
        setTasks(state, action) {
            state.tasks = action.payload;
        },
        clear(state) {
            state.boards = [];
            state.tasks = [];
        },
    }
});

export const {addTask, addBoard, setBoards, setTasks, clear} = kanbanSlice.actions;
export default kanbanSlice.reducer;