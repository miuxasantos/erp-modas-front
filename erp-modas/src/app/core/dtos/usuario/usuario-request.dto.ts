import { Cargo } from "../../enums/cargo.enum";

export interface UsuarioRequestDto {
    nome: string;
    email: string;
    status: boolean;
    ultimoAcesso: string;
    cargo: Cargo;
}