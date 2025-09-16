import { useAppDispatch, useAppSelector } from '../store';
import {
  createVacationRequestAction,
  getAllVacationRequestsAction,
  updateVacationRequestStatusAction,
} from '../features/vacation/vacationActions';
import type { VacationRequest } from '../types/Vacation/VacationTypes';
import { useCallback } from 'react';

export const useVacation = () => {
  const dispatch = useAppDispatch();
  const vacationState = useAppSelector((state) => state.vacationReducer);

  const createRequest = useCallback(async (request: VacationRequest) => {
    return dispatch(createVacationRequestAction(request));
  }, [dispatch]);

  const getAllRequests = useCallback(async () => {
    return dispatch(getAllVacationRequestsAction());
  }, [dispatch]);


  const updateRequestStatus = useCallback(async (requestId: string, status: 'approved' | 'rejected') => {
    return dispatch(updateVacationRequestStatusAction(requestId, status));
  }, [dispatch]);

  return {
    // State
    requests: vacationState.api.data.requests,
    loading: vacationState.api.loading,
    error: vacationState.api.error,
    
    // Actions
    createRequest,
    getAllRequests,
    updateRequestStatus,
  };
};
