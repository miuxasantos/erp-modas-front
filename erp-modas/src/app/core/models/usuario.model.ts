import { UsuarioResponseDto } from "../dtos/usuario/usuario-response.dto";
import { Cargo } from "../enums/cargo.enum";

export class Usuario {
    id: number
    nome: string;
    email: string;
    status: boolean;
    ultimoAcesso: Date;
    cargo: Cargo;

    constructor(dto: UsuarioResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.email = dto.email;
        this.status = dto.status;
        this.ultimoAcesso = new Date(dto.ultimoAcesso);
        this.cargo = dto.cargo;
    }

    get primeiroNome(): string {
        return this.nome.split(' ')[0];
    }

    // útil para controle de acesso nas telas
    get isProprietario(): boolean {
        return this.cargo === Cargo.PROPRIETARIO;
    }

    get isAtivo(): boolean {
        return this.status;
    }
}