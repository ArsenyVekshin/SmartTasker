import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import errorReducer from './errorSlice'
import kanbanSlice from "./kanbanSlice";
import scheduleSlice from "./scheduleSlice";

const store = configureStore({
    reducer: {
        kanban: kanbanSlice,
        schedule: scheduleSlice,
        user: userReducer,
        error: errorReducer,
    },
})

export default store;