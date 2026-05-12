import { SessionTokenResponseDto } from "../dtos/sessionToken/session-token-response.dto";
import { Usuario } from "./usuario.model";

export class SessionToken {
    id: number;
    token: string;
    usuario: Usuario;
    dataCriacao: Date;
    dataExp: Date;
    ativo: boolean;

    constructor(dto: SessionTokenResponseDto) {
        this.id = dto.id;
        this.token = dto.token;
        this.usuario = new Usuario(dto.usuario as any);
        this.dataCriacao = new Date(dto.dataCriacao);
        this.dataExp = new Date(dto.dataExp);
        this.ativo = dto.ativo;
    }
}