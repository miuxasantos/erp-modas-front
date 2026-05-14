export interface SessionTokenRequestDto {
    token: string;
    usuarioId: number;
    dataCriacao: string;
    dataExp: string;
    ativo: boolean;
}