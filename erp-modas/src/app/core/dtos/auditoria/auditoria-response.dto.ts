import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";

export interface AuditoriaResponseDto {
    id: number;
    usuarioId: number;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: string;
}