import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";

export interface Auditoria {
    id: number;
    usuario: Usuario;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: Date;
}   