import type { AppDispatch } from "../../store";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
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
} from "./infoPortalSlice";
import {
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  getStatistics,
} from "../../apis/infoPortalApis";
import type { InfoPortalErrorResponse } from "../../types/InfoPortal/InfoPortalErrorResponse";
import type { FolderRequest } from "../../types/InfoPortal/FolderRequest";
import type { UpdateFolderRequest } from "../../types/InfoPortal/FolderRequest";
import type { PageRequest } from "../../types/InfoPortal/PageRequest";
import type { UpdatePageRequest } from "../../types/InfoPortal/PageRequest";
import type { UpdateSectionsRequest } from "../../types/InfoPortal/PageRequest";
import { updatePageSections, uploadAttachment, deleteAttachment } from "../../apis/infoPortalApis";

// Folders
export const getFoldersAction = () => async (dispatch: AppDispatch) => {
  dispatch(getFoldersRequest());
  try {
    getAllFolders()
      .then((data) => {
        dispatch(getFoldersSuccess(data));
      })
      .catch((error: AxiosError<InfoPortalErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(getFoldersFailed(error.response.data));
        } else {
          dispatch(getFoldersFailed({ error: "Failed to fetch folders" }));
        }
      });
  } catch {
    toast.error("Failed to get folders");
    dispatch(getFoldersFailed({ error: "Unknown error" }));
  }
};

export const getFolderByIdAction =
  (folderId: string) => async (dispatch: AppDispatch) => {
    dispatch(getFolderByIdRequest());
    try {
      getFolderById(folderId)
        .then((data) => {
          dispatch(getFolderByIdSuccess(data));
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(getFolderByIdFailed(error.response.data));
          } else {
            dispatch(getFolderByIdFailed({ error: "Failed to fetch folder" }));
          }
        });
    } catch {
      toast.error("Failed to get folder");
      dispatch(getFolderByIdFailed({ error: "Unknown error" }));
    }
  };

export const createFolderAction =
  (folder: FolderRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(createFolderRequest());
    try {
      createFolder(folder)
        .then((data) => {
          dispatch(createFolderSuccess(data.folder));
          toast.success("Folder created successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(createFolderFailed(error.response.data));
            toast.error("Failed to create folder");
          } else {
            dispatch(createFolderFailed({ error: "Failed to create folder" }));
            toast.error("Failed to create folder");
          }
        });
    } catch {
      toast.error("Failed to create folder");
      dispatch(createFolderFailed({ error: "Unknown error" }));
    }
  };

export const updateFolderAction =
  (folderId: string, folder: UpdateFolderRequest, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateFolderRequest());
    try {
      updateFolder(folderId, folder)
        .then((data) => {
          dispatch(updateFolderSuccess(data.folder));
          toast.success("Folder updated successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(updateFolderFailed(error.response.data));
            toast.error("Failed to update folder");
          } else {
            dispatch(updateFolderFailed({ error: "Failed to update folder" }));
            toast.error("Failed to update folder");
          }
        });
    } catch {
      toast.error("Failed to update folder");
      dispatch(updateFolderFailed({ error: "Unknown error" }));
    }
  };

export const deleteFolderAction =
  (folderId: string, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(deleteFolderRequest());
    try {
      deleteFolder(folderId)
        .then(() => {
          dispatch(deleteFolderSuccess(folderId));
          toast.success("Folder deleted successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(deleteFolderFailed(error.response.data));
            toast.error("Failed to delete folder");
          } else {
            dispatch(deleteFolderFailed({ error: "Failed to delete folder" }));
            toast.error("Failed to delete folder");
          }
        });
    } catch {
      toast.error("Failed to delete folder");
      dispatch(deleteFolderFailed({ error: "Unknown error" }));
    }
  };

// Pages
export const getPageByIdAction =
  (pageId: string) => async (dispatch: AppDispatch) => {
    dispatch(getPageByIdRequest());
    try {
      getPageById(pageId)
        .then((data) => {
          dispatch(getPageByIdSuccess(data));
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(getPageByIdFailed(error.response.data));
          } else {
            dispatch(getPageByIdFailed({ error: "Failed to fetch page" }));
          }
        });
    } catch {
      toast.error("Failed to get page");
      dispatch(getPageByIdFailed({ error: "Unknown error" }));
    }
  };

export const createPageAction =
  (folderId: string, page: PageRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(createPageRequest());
    try {
      createPage(folderId, page)
        .then((data) => {
          dispatch(createPageSuccess({ page: data.page }));
          toast.success("Page created successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(createPageFailed(error.response.data));
            toast.error("Failed to create page");
          } else {
            dispatch(createPageFailed({ error: "Failed to create page" }));
            toast.error("Failed to create page");
          }
        });
    } catch {
      toast.error("Failed to create page");
      dispatch(createPageFailed({ error: "Unknown error" }));
    }
  };

export const updatePageAction =
  (pageId: string, page: UpdatePageRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(updatePageRequest());
    try {
      updatePage(pageId, page)
        .then((data) => {
          dispatch(updatePageSuccess(data.page));
          toast.success("Page updated successfully");
          if (cb) cb();
        })
        .catch((err: AxiosError<InfoPortalErrorResponse>) => {
          if (err?.response?.data) {
            dispatch(updatePageFailed(err.response.data));
            toast.error("Failed to update page");
          } else {
            dispatch(updatePageFailed({ error: "Failed to update page" }));
            toast.error("Failed to update page");
          }
        });
    } catch {
      toast.error("Failed to update page");
      dispatch(updatePageFailed({ error: "Unknown error" }));
    }
  };

export const deletePageAction =
  (pageId: string, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(deletePageRequest());
    try {
      deletePage(pageId)
        .then(() => {
          dispatch(deletePageSuccess(pageId));
          toast.success("Page deleted successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<InfoPortalErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(deletePageFailed(error.response.data));
            toast.error("Failed to delete page");
          } else {
            dispatch(deletePageFailed({ error: "Failed to delete page" }));
            toast.error("Failed to delete page");
          }
        });
    } catch {
      toast.error("Failed to delete page");
      dispatch(deletePageFailed({ error: "Unknown error" }));
    }
  };

// Page Sections
export const updatePageSectionsAction =
  (pageId: string, sections: UpdateSectionsRequest, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      updatePageSections(pageId, sections)
        .then(() => {
          toast.success("Page sections updated successfully");
          // Refresh page data
          dispatch(getPageByIdAction(pageId));
          if (cb) cb();
        })
        .catch(() => {
          toast.error("Failed to update page sections");
        });
    } catch {
      toast.error("Failed to update page sections");
    }
  };

// Attachments
export const uploadAttachmentAction =
  (pageId: string, file: File, name?: string, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      uploadAttachment(pageId, file, name)
        .then(() => {
          toast.success("Attachment uploaded successfully");
          // Refresh page data
          dispatch(getPageByIdAction(pageId));
          if (cb) cb();
        })
        .catch(() => {
          toast.error("Failed to upload attachment");
        });
    } catch {
      toast.error("Failed to upload attachment");
    }
  };

export const deleteAttachmentAction =
  (attachmentId: string, pageId: string, cb?: () => void) => async (dispatch: AppDispatch) => {
    try {
      deleteAttachment(attachmentId)
        .then(() => {
          toast.success("Attachment deleted successfully");
          // Refresh page data
          dispatch(getPageByIdAction(pageId));
          if (cb) cb();
        })
        .catch(() => {
          toast.error("Failed to delete attachment");
        });
    } catch {
      toast.error("Failed to delete attachment");
    }
  };

// Statistics
export const getStatisticsAction = () => async (dispatch: AppDispatch) => {
  dispatch(getStatisticsRequest());
  try {
    getStatistics()
      .then((data) => {
        dispatch(getStatisticsSuccess(data));
      })
      .catch((error: AxiosError<InfoPortalErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(getStatisticsFailed(error.response.data));
        } else {
          dispatch(getStatisticsFailed({ error: "Failed to fetch statistics" }));
        }
      });
  } catch {
    toast.error("Failed to get statistics");
    dispatch(getStatisticsFailed({ error: "Unknown error" }));
  }
};

