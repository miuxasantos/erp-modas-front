import { ProdutoResponseDto } from "../dtos/produto/produto-response.dto";
import { Categoria } from "./categoria.model";

export class Produto {
    id: number;
    nome: string;
    codigo: number;
    descricao: string;
    ativo: boolean;
    precoCusto: number;
    precoVenda: number;
    dataInclusao: Date;
    dataDesativacao: Date | null;
    tecido: string;
    marca: string;
    categoria?: Categoria;
    categoriaId: number;
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
        this.dataDesativacao = dto.dataDesativacao != null ? new Date(dto.dataDesativacao) : null;;
        this.tecido = dto.tecido;
        this.marca = dto.marca;
        //this.categoria = new Categoria(dto.categoria);
        this.categoriaId = dto.categoriaId;
        this.imagem = dto.imagem;
    }

    get margemLucro(): number {
        if (!this.precoVenda || this.precoVenda === 0) return 0;
        return ((this.precoVenda - this.precoCusto) / this.precoCusto) * 100;
    }

    get margemLucroFormatada(): string {
        return `${this.margemLucro.toFixed(2)}%`;
    }

    get margemLucroSeverity(): string {
        if (this.margemLucro >= 40) return 'text-green-600';
        if (this.margemLucro >= 20) return 'text-yellow-500';
        return 'text-red-500';
    }
}
