import { useAppDispatch, useAppSelector } from "../store";
import {
  getFoldersAction,
  getFolderByIdAction,
  createFolderAction,
  updateFolderAction,
  deleteFolderAction,
  getPageByIdAction,
  createPageAction,
  updatePageAction,
  deletePageAction,
  updatePageSectionsAction,
  uploadAttachmentAction,
  deleteAttachmentAction,
  getStatisticsAction,
} from "../features/infoPortal/infoPortalActions";
import { clearCurrentFolder, clearCurrentPage } from "../features/infoPortal/infoPortalSlice";
import type { FolderRequest } from "../types/InfoPortal/FolderRequest";
import type { UpdateFolderRequest } from "../types/InfoPortal/FolderRequest";
import type { PageRequest } from "../types/InfoPortal/PageRequest";
import type { UpdatePageRequest } from "../types/InfoPortal/PageRequest";
import type { UpdateSectionsRequest } from "../types/InfoPortal/PageRequest";
import { useCallback } from "react";

export const useInfoPortal = () => {
  const dispatch = useAppDispatch();
  const infoPortalState = useAppSelector((state) => state.infoPortalReducer);

  // Folders
  const getFolders = useCallback(async () => {
    return dispatch(getFoldersAction());
  }, [dispatch]);

  const getFolderById = useCallback(
    async (folderId: string) => {
      return dispatch(getFolderByIdAction(folderId));
    },
    [dispatch]
  );

  const createFolder = useCallback(
    async (folder: FolderRequest, cb?: () => void) => {
      return dispatch(createFolderAction(folder, cb));
    },
    [dispatch]
  );

  const updateFolder = useCallback(
    async (folderId: string, folder: UpdateFolderRequest, cb?: () => void) => {
      return dispatch(updateFolderAction(folderId, folder, cb));
    },
    [dispatch]
  );

  const deleteFolder = useCallback(
    async (folderId: string, cb?: () => void) => {
      return dispatch(deleteFolderAction(folderId, cb));
    },
    [dispatch]
  );

  // Pages
  const getPageById = useCallback(
    async (pageId: string) => {
      return dispatch(getPageByIdAction(pageId));
    },
    [dispatch]
  );

  const createPage = useCallback(
    async (folderId: string, page: PageRequest, cb?: () => void) => {
      return dispatch(createPageAction(folderId, page, cb));
    },
    [dispatch]
  );

  const updatePage = useCallback(
    async (pageId: string, page: UpdatePageRequest, cb?: () => void) => {
      return dispatch(updatePageAction(pageId, page, cb));
    },
    [dispatch]
  );

  const deletePage = useCallback(
    async (pageId: string, cb?: () => void) => {
      return dispatch(deletePageAction(pageId, cb));
    },
    [dispatch]
  );

  // Page Sections
  const updatePageSections = useCallback(
    async (pageId: string, sections: UpdateSectionsRequest, cb?: () => void) => {
      return dispatch(updatePageSectionsAction(pageId, sections, cb));
    },
    [dispatch]
  );

  // Attachments
  const uploadAttachment = useCallback(
    async (pageId: string, file: File, name?: string, cb?: () => void) => {
      return dispatch(uploadAttachmentAction(pageId, file, name, cb));
    },
    [dispatch]
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string, pageId: string, cb?: () => void) => {
      return dispatch(deleteAttachmentAction(attachmentId, pageId, cb));
    },
    [dispatch]
  );

  // Statistics
  const getStatistics = useCallback(async () => {
    return dispatch(getStatisticsAction());
  }, [dispatch]);

  // Clear actions
  const clearFolder = useCallback(() => {
    dispatch(clearCurrentFolder());
  }, [dispatch]);

  const clearPage = useCallback(() => {
    dispatch(clearCurrentPage());
  }, [dispatch]);

  return {
    // State
    folders: infoPortalState.api.data.folders,
    currentFolder: infoPortalState.api.data.currentFolder,
    currentPage: infoPortalState.api.data.currentPage,
    statistics: infoPortalState.api.data.statistics,
    loading: infoPortalState.api.loading,
    error: infoPortalState.api.error,

    // Folder actions
    getFolders,
    getFolderById,
    createFolder,
    updateFolder,
    deleteFolder,

    // Page actions
    getPageById,
    createPage,
    updatePage,
    deletePage,

    // Page content actions
    updatePageSections,
    uploadAttachment,
    deleteAttachment,

    // Statistics
    getStatistics,

    // Clear actions
    clearFolder,
    clearPage,
  };
};

