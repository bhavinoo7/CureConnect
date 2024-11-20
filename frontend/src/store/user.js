import { createSlice } from "@reduxjs/toolkit";
import Patient from "../pages/Patient";

const userSlice=createSlice({
    name:"user",
    initialState:{username:"",
        id:"",
        email:"",
        role:"",
        username:"",
        user_id:""
    },
    reducers:{
        storeUser:(state,action)=>{
            state.id=action.payload.id;
            state.email=action.payload.email;
            state.role=action.payload.role;
            state.username=action.payload.username;
            state.user_id=action.payload.user_id;
            
        },
        deleteUser:(state)=>{
            state.id=null;
            state.email=null;
            state.role=null;
            state.username=null;
            state.user_id=null;
        }
    }
})

export const userActions=userSlice.actions;

export default userSlice;