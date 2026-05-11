import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";
import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface AuditoriaResponseDto {
    id: number;
    usuario: UsuarioResponseDto;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: string;
}