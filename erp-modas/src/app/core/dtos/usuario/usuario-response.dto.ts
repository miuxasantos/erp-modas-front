import { Cargo } from "../../enums/cargo.enum";

export interface UsuarioResponseDto {
    id: number;
    nome: string;
    senha: string;
    email: string;
    status: boolean;
    ultimoAcesso: string;
    cargo: Cargo;
}