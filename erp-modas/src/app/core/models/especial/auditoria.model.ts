import { AuditoriaResponseDto } from "../../dtos/auditoria/auditoria-response.dto";
import { TipoAcaoAud } from "../../enums/tipo-acao-aud.enum";
import { Usuario } from "../usuario.model";

export class Auditoria {
    id: number;
    usuario: Usuario;
    tipoAcaoAud: TipoAcaoAud;
    entidade: string;
    entidadeId: number;
    dataHora: Date;

    constructor(dto: AuditoriaResponseDto) {
        this.id = dto.id;
        this.usuario = new Usuario(dto.usuario);
        this.tipoAcaoAud = dto.tipoAcaoAud;
        this.entidade = dto.entidade;
        this.entidadeId = dto.entidadeId;
        this.dataHora = new Date(dto.dataHora);
    }
}   