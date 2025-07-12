    export interface UsuarioRespuestaDto {
    id: number;
    nombreUsuario: string;
    correo: string;
    nombreCompleto: string;
    telefono: string;
    rol: string;
    token?: string;
    }

    export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
    errors?: { [key: string]: string[] };
    }

    export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    }