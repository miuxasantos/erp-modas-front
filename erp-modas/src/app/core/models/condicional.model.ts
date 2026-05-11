import { ItemCondicional } from "./item-condicional.model";

export class Condicional {
    id: number;
    cliente: Cliente;
    dataInicio: Date;
    periodo: number;
    dataFinal: Date;
    itensCondicional: ItemCondicional[];

    constructor(dto: CondicionalResponseDto) {
        this.id = dto.id;
        this.cliente = new Cliente(dto.cliente);
        this.dataInicio = new Date(dto.dataInicio);
        this.periodo = dto.periodo;
        this.dataFinal = new Date(dto.dataFinal);
        this.itensCondicional = dto.itensCondicional.map(item => new ItemCondicional(item));
    }
}