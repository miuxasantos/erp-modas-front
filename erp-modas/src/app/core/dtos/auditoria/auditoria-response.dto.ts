import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";
import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface AuditoriaResponseDto {
    id: number;
    usuarioId: number;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: string;
}