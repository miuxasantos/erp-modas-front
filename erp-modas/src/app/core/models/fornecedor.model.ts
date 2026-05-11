import { FornecedorResponseDto } from "../dtos/fornecedor/fornecedor-response.dto";

export class Fornecedor {
    id: number;
    nome: string;
    contato: string;
    assessoria: string;

    constructor(dto: FornecedorResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.contato = dto.contato;
        this.assessoria = dto.assessoria;
    }
}