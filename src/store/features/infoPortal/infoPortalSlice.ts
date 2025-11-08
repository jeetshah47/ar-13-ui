import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InfoPortalState } from "./infoPortalTypes";
import type { GetFoldersResponse } from "../../types/InfoPortal/FolderResponse";
import type { FolderDetailResponse } from "../../types/InfoPortal/FolderResponse";
import type { FolderResponse } from "../../types/InfoPortal/FolderResponse";
import type { PageDetailResponse, PageResponse } from "../../types/InfoPortal/PageResponse";
import type { StatisticsResponse } from "../../types/InfoPortal/StatisticsResponse";
import type { InfoPortalErrorResponse } from "../../types/InfoPortal/InfoPortalErrorResponse";

const initialState: InfoPortalState = {
  api: {
    data: {
      folders: [],
      currentFolder: null,
      currentPage: null,
      statistics: null,
    },
    loading: false,
    error: "",
  },
};

const infoPortalSlice = createSlice({
  name: "infoPortal",
  initialState,
  reducers: {
    // Folders
    getFoldersRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.folders = [];
    },
    getFoldersSuccess(state, action: PayloadAction<GetFoldersResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.folders = action.payload.folders;
    },
    getFoldersFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
      state.api.data.folders = [];
    },

    getFolderByIdRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getFolderByIdSuccess(state, action: PayloadAction<FolderDetailResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.currentFolder = action.payload.folder;
    },
    getFolderByIdFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    createFolderRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    createFolderSuccess(state, action: PayloadAction<FolderResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.folders.push(action.payload);
    },
    createFolderFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    updateFolderRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updateFolderSuccess(state, action: PayloadAction<FolderResponse>) {
      state.api.loading = false;
      state.api.error = "";
      const index = state.api.data.folders.findIndex((f) => f.id === action.payload.id);
      if (index !== -1) {
        state.api.data.folders[index] = action.payload;
      }
      if (state.api.data.currentFolder?.id === action.payload.id) {
        state.api.data.currentFolder.name = action.payload.name;
        state.api.data.currentFolder.color = action.payload.color;
      }
    },
    updateFolderFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    deleteFolderRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    deleteFolderSuccess(state, action: PayloadAction<string>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.folders = state.api.data.folders.filter((f) => f.id !== action.payload);
      if (state.api.data.currentFolder?.id === action.payload) {
        state.api.data.currentFolder = null;
      }
    },
    deleteFolderFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    // Pages
    getPageByIdRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getPageByIdSuccess(state, action: PayloadAction<PageDetailResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.currentPage = action.payload.page;
    },
    getPageByIdFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    createPageRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    createPageSuccess(state, action: PayloadAction<{ page: PageResponse }>) {
      state.api.loading = false;
      state.api.error = "";
      if (state.api.data.currentFolder) {
        // Convert PageResponse to include empty sections and attachments
        const pageWithContent = {
          ...action.payload.page,
          sections: [],
          attachments: [],
        };
        state.api.data.currentFolder.pages.push(pageWithContent);
      }
    },
    createPageFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    updatePageRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updatePageSuccess(state, action: PayloadAction<PageResponse>) {
      state.api.loading = false;
      state.api.error = "";
      if (state.api.data.currentFolder) {
        const index = state.api.data.currentFolder.pages.findIndex(
          (p: PageResponse) => p.id === action.payload.id
        );
        if (index !== -1) {
          // Preserve existing sections and attachments
          const existingPage = state.api.data.currentFolder.pages[index];
          state.api.data.currentFolder.pages[index] = {
            ...action.payload,
            sections: existingPage.sections || [],
            attachments: existingPage.attachments || [],
          };
        }
      }
      if (state.api.data.currentPage?.id === action.payload.id) {
        // Preserve existing sections and attachments
        state.api.data.currentPage = {
          ...action.payload,
          sections: state.api.data.currentPage.sections || [],
          attachments: state.api.data.currentPage.attachments || [],
        };
      }
    },
    updatePageFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    deletePageRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    deletePageSuccess(state, action: PayloadAction<string>) {
      state.api.loading = false;
      state.api.error = "";
      if (state.api.data.currentFolder) {
        state.api.data.currentFolder.pages = state.api.data.currentFolder.pages.filter(
          (p: PageResponse) => p.id !== action.payload
        );
      }
      if (state.api.data.currentPage?.id === action.payload) {
        state.api.data.currentPage = null;
      }
    },
    deletePageFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    // Statistics
    getStatisticsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getStatisticsSuccess(state, action: PayloadAction<StatisticsResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.statistics = action.payload.statistics;
    },
    getStatisticsFailed(state, action: PayloadAction<InfoPortalErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error || action.payload.message || "Unknown error";
    },

    // Clear current folder/page
    clearCurrentFolder(state) {
      state.api.data.currentFolder = null;
    },
    clearCurrentPage(state) {
      state.api.data.currentPage = null;
    },
  },
});

export const {
  getFoldersRequest,
  getFoldersSuccess,
  getFoldersFailed,
  getFolderByIdRequest,
  getFolderByIdSuccess,
  getFolderByIdFailed,
  createFolderRequest,
  createFolderSuccess,
  createFolderFailed,
  updateFolderRequest,
  updateFolderSuccess,
  updateFolderFailed,
  deleteFolderRequest,
  deleteFolderSuccess,
  deleteFolderFailed,
  getPageByIdRequest,
  getPageByIdSuccess,
  getPageByIdFailed,
  createPageRequest,
  createPageSuccess,
  createPageFailed,
  updatePageRequest,
  updatePageSuccess,
  updatePageFailed,
  deletePageRequest,
  deletePageSuccess,
  deletePageFailed,
  getStatisticsRequest,
  getStatisticsSuccess,
  getStatisticsFailed,
  clearCurrentFolder,
  clearCurrentPage,
} = infoPortalSlice.actions;

export const infoPortalReducer = infoPortalSlice.reducer;

