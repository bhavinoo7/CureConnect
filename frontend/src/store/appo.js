import { createSlice } from "@reduxjs/toolkit";

const appoSlice = createSlice({
    name: "appo",
    initialState: { Pending: 0, Completed: 0, Cancelled: 0 },
    reducers: {
        storePending: (state, action) => {
            state.Pending = action.payload;
        },
        storeCompleted: (state, action) => {
            state.Completed = action.payload;
        },
        storeCancelled: (state, action) => {
            state.Cancelled = action.payload;
        }
    },
    });

    export const appoAction = appoSlice.actions;
    export default appoSlice;