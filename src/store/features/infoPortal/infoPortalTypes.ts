import type { FolderResponse } from "../../types/InfoPortal/FolderResponse";
import type { FolderDetailResponse } from "../../types/InfoPortal/FolderResponse";
import type { PageDetailResponse } from "../../types/InfoPortal/PageResponse";
import type { StatisticsResponse } from "../../types/InfoPortal/StatisticsResponse";

export interface InfoPortalState {
  api: {
    data: {
      folders: FolderResponse[];
      currentFolder: FolderDetailResponse["folder"] | null;
      currentPage: PageDetailResponse["page"] | null;
      statistics: StatisticsResponse["statistics"] | null;
    };
    loading: boolean;
    error: string;
  };
}

