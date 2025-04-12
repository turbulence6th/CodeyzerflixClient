export interface CodeyzerPaginationRequest<T> {
    page: number;
    size: number;
    details?: T;
}

export interface CodeyzerPaginationResponse<T> {
    totalRecord: number;
    totalPages: number;
    data: T[];
}