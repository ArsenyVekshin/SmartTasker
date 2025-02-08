import {createSlice} from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        timeIntervals: []
    },
    reducers: {
        addInterval(state, action) {
            state.timeIntervals.unshift(action.payload);
        },
        setIntervals(state, action) {
            state.timeIntervals = action.payload;
        },
        clearIntervals(state) {
            state.timeIntervals = [];
        },

    }
});

export const {addInterval, setIntervals, clearIntervals} = scheduleSlice.actions;

export default scheduleSlice.reducer;