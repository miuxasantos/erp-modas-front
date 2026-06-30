import { FornecedorResponseDto } from "../dtos/fornecedor/fornecedor-response.dto";
import { Assessoria } from "./assessoria.model";

export class Fornecedor {
    id: number;
    nome: string;
    contato: string;
    assessoria: Assessoria;

    constructor(dto: FornecedorResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.contato = dto.contato;
        this.assessoria = new Assessoria(dto.assessoria);
    }
}