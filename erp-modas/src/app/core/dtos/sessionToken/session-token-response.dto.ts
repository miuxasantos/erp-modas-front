import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface SessionTokenResponseDto {
    id: number;
    token: string;
    usuario: UsuarioResponseDto;
    dataCriacao: string;
    dataExp: string;
    ativo: boolean;
}