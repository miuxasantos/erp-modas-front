export enum TipoAcaoAud {
    CREATE = 'Criação',
    UPDATE = 'Atualização',
    DELETE = 'Exclusão',
    LOGIN = 'Login',
    LOGIN_FALHA = 'Falha no login',
}

export const LABEL_ACAO: Record<TipoAcaoAud, string> = {
    [TipoAcaoAud.CREATE]: 'Criação',
    [TipoAcaoAud.UPDATE]: 'Atualização',
    [TipoAcaoAud.DELETE]: 'Exclusão',
    [TipoAcaoAud.LOGIN]: 'Login',
    [TipoAcaoAud.LOGIN_FALHA]: 'Falha no login',
};