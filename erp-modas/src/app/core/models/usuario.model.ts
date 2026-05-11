import { UsuarioResponseDto } from "../dtos/usuario/usuario-response.dto";
import { Cargo } from "../enums/cargo.enum";

export class Usuario {
    id: number
    nome: string;
    email: string;
    senha: string
    status: boolean;
    ultimoAcesso: Date;
    cargo: Cargo;

    constructor(dto: UsuarioResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.email = dto.email;
        this.senha = dto.senha;
        this.status = dto.status;
        this.ultimoAcesso = new Date(dto.ultimoAcesso);
        this.cargo = dto.cargo;
    }
}