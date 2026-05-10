import { Cargo } from "../../enums/cargo.enum";

export interface UsuarioUpdateDto {
    nome?: string;
    email?: string;
    status?: boolean;
    ultimoAcesso?: string;
    cargo?: Cargo;
}