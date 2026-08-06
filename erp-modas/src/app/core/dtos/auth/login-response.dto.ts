import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface LoginResponseDto {
  token: string;
  tipo: string;
  usuario: UsuarioResponseDto;
  expiraEmSegundos: number;
}