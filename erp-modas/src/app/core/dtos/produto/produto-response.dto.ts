import { TecidoResponseDto } from "../apoio/tecido/tecido-response.dto";
import { CategoriaResponseDto } from "../categoria/categoria-response.dto";
import { MarcaResponseDto } from "../marca/marca-response.dto";

export interface ProdutoResponseDto {
    id: number;
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: string;
    dataDesativacao: string;
    tecido: TecidoResponseDto;
    marca: MarcaResponseDto;
    categoria: CategoriaResponseDto;
    imagem: string;
}