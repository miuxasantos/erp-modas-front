import { parseDataLocal } from "@core/utils/data.utils";
import { ProdutoResponseDto } from "../dtos/produto/produto-response.dto";
import { Tecido } from "./apoio/tecido.model";
import { Categoria } from "./categoria.model";
import { Marca } from "./marca.model";

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
    tecido: Tecido;
    marca: Marca;
    categoria?: Categoria;
    noCatalogo: boolean;
    imagem: string;

    constructor (dto: ProdutoResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.codigo = dto.codigo;
        this.descricao = dto.descricao;
        this.ativo = dto.ativo;
        this.precoCusto = dto.precoCusto;
        this.precoVenda = dto.precoVenda;
        this.dataInclusao = parseDataLocal(dto.dataInclusao)!;
        this.dataDesativacao = parseDataLocal(dto.dataDesativacao);
        this.tecido = new Tecido(dto.tecido);
        this.marca = new Marca(dto.marca);
        this.categoria = new Categoria(dto.categoria);
        this.noCatalogo = dto.noCatalogo ?? false;
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
