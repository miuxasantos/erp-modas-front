import { ClienteResponseDto } from "../dtos/cliente/cliente-response.dto";

export class Cliente {
    id: number;
    nome: string;
    contato: string;
    documento: string;
    numero: string;
    rua: string;
    bairro: string;
    cidade: string;

    constructor(dto: ClienteResponseDto) {
        this.id = dto.id;
        this.nome = dto.nome;
        this.contato = dto.contato;
        this.documento = dto.documento;
        this.numero = dto.numero;
        this.rua = dto.rua;
        this.bairro = dto.bairro;
        this.cidade = dto.cidade;
    }
}