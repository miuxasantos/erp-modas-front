import { CorResponseDto } from "../apoio/cor/cor-response.dto";
import { TamanhoResponseDto } from "../apoio/tamanho/tamanho-response.dto";

export interface VariacaoPublicaResponseDto {
    id: number;
    cor: CorResponseDto;
    tamanho: TamanhoResponseDto;
    disponivel: boolean;
    imagemEsp: string;   
}