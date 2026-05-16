import { Cargo } from "../../enums/cargo.enum";

export interface UsuarioResponseDto {
    id: number;
    nome: string;
    email: string;
    status: boolean;
    ultimoAcesso: string;
    cargo: Cargo;
}