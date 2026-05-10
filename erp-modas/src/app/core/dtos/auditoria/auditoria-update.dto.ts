import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";

export interface AuditoriaUpdateDto {
    usuarioId: number;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: string;
}