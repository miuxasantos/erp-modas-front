export interface SessionToken {
    id: number;
    token: string;
    usuario: Usuario;
    dataCriacao: Date;
    dataExp: Date;
    ativo: boolean;
}