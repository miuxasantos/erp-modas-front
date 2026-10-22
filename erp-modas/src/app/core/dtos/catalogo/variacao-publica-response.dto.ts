import { CorResponseDto } from "../apoio/cor/cor-response.dto";
import { TamanhoResponseDto } from "../apoio/tamanho/tamanho-response.dto";

export interface VariacaoPublicaResponseDto {
    id: number;
    cor: CorResponseDto | null;
    tamanho: TamanhoResponseDto | null;
    disponivel: boolean;
    imagemEsp: string | null;   
}