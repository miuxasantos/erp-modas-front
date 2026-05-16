import { ProdutoResponseDto } from "../dtos/produto/produto-response.dto";
import { Categoria } from "./categoria.model";
import { Compra } from "./compra.model";

export class Produto {
    id: number;
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: Date;
    dataDesativacao: Date;
    tecido: string;
    marca: string;
    categoria: Categoria;
    imagem: string;

    constructor (dto: ProdutoResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.codigo = dto.codigo;
        this.descricao = dto.descricao;
        this.ativo = dto.ativo;
        this.precoCusto = dto.precoCusto;
        this.precoVenda = dto.precoVenda;
        this.dataInclusao = new Date(dto.dataInclusao);
        this.dataDesativacao = new Date(dto.dataDesativacao);
        this.tecido = dto.tecido;
        this.marca = dto.marca;
        this.categoria = new Categoria(dto.categoria);
        this.imagem = dto.imagem;
    }
}
