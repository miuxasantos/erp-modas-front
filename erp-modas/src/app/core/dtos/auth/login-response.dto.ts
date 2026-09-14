import { UsuarioResponseDto } from "../usuario/usuario-response.dto";

export interface LoginResponseDto {
  token: string;
  tipo: string;
  usuarioResponseDTO: UsuarioResponseDto;
  expiraEmSegundos: number;
}