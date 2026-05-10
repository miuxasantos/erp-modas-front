export interface SessionTokenResponseDto {
    id: number;
    token: string;
    usuarioId: number;
    dataCriacao: string;
    dataExp: string;
    ativo: boolean;
}