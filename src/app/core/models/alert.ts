export interface AlertModel {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}