export interface SessionTokenUpdateDto {
    token?: string;
    usuarioId?: number;
    dataCriacao?: string;
    dataExp?: string;
    ativo?: boolean;
}