import api from './api.config';
import { Log, LogCreate, LogType, LogTypeCreate, LogTypeUpdate } from '../models/log';

export const getLogs = async () => {
    const response = await api.get('/Log');
    return response.data;
};

export const getLog = async (id: string) => {
    const response = await api.get(`/Log/${id}`);
    return response.data;
};

export const createLog = async (log: LogCreate) => {
    const response = await api.post('/Log', log);
    return response.data;
};

export const deleteLog = async (id: string) => {
    const response = await api.delete(`/Log/${id}`);
    return response.data;
};

// Log Type operations
export const getLogTypes = async () => {
    const response = await api.get('/LogType');
    return response.data;
};

export const getLogType = async (id: string) => {
    const response = await api.get(`/LogType/${id}`);
    return response.data;
};

export const createLogType = async (logType: LogTypeCreate) => {
    const response = await api.post('/LogType', logType);
    return response.data;
};

export const updateLogType = async (logType: LogTypeUpdate) => {
    const response = await api.put('/LogType', logType);
    return response.data;
};

export const deleteLogType = async (id: string) => {
    const response = await api.delete(`/LogType/${id}`);
    return response.data;
}; 