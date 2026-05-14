import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface AuthResponseDto {
  token: string;
  usuario: UsuarioResponseDto;
}