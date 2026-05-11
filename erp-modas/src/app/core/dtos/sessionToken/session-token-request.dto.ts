import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface SessionTokenRequestDto {
    token: string;
    usuario: UsuarioResponseDto;
    dataCriacao: string;
    dataExp: string;
    ativo: boolean;
}