import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
// import { fetchCount } from './appAPI';

export interface AppState {
  idDumpster: string;
  status: string;
  reportModal: {
    isOpen: boolean
  }
}

const initialState: AppState = {
  idDumpster: '',
  status: 'loading',
  reportModal: {
    isOpen: false
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAppStatus: (state, action: PayloadAction<string>) => {
      console.log(action);
      state.status = action.payload;
    },
    setIdDumpster: (state, action: PayloadAction<string>) => {
      state.idDumpster = action.payload;
    },
    setIsOpenReportModal: (state, action: PayloadAction<boolean>) => {
      state.reportModal.isOpen = action.payload;

    }
  },

});

export const { setAppStatus, setIdDumpster, setIsOpenReportModal} = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.app.value)`
export const selectCount = (state: RootState) => state.app.status;
export const selectCountIsOpenReportModal = (state: RootState) => state.app.reportModal.isOpen;
export const selectIdDumpster = (state: RootState) => state.app.idDumpster;

export default appSlice.reducer;
