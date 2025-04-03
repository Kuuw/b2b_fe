export interface LogType {
    logTypeId: string;
    logTypeName: string;
}

export interface Log {
    logId: string;
    userId: string;
    logMessage: string;
    createdAt: Date;
    logType: LogType;
}

export interface LogCreate {
    logTypeId: string;
    userId: string;
    logMessage: string;
}

export interface LogTypeCreate {
    logTypeName: string;
}

export interface LogTypeUpdate extends LogTypeCreate {
    logTypeId: string;
} 