import { parseDataLocal } from "@core/utils/data.utils";
import { CondicionalResponseDto } from "../dtos/condicional/condicional-response.dto";
import { Cliente } from "./cliente.model";
import { ItemCondicional } from "./dependentes/item-condicional.model";

export class Condicional {
    id: number;
    cliente: Cliente;
    dataInicio: Date;
    periodo: number;
    dataFinal: Date | null;
    itensCondicional: ItemCondicional[];

    constructor(dto: CondicionalResponseDto) {
        this.id = dto.id;
        this.cliente = new Cliente(dto.cliente);
        this.dataInicio = parseDataLocal(dto.dataInicio)!;
        this.periodo = dto.periodo;
        this.dataFinal = parseDataLocal(dto.dataFinal);
        this.itensCondicional = dto.itensCondicional?.map(item => new ItemCondicional(item) || []);
    }
}