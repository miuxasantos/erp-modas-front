import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";

export interface AuditoriaRequestDto {
    usuarioId: number;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: string;
}