import { ItemCondicionalRequestDto } from "../itemCondicional/item-condicional-request.dto";

export interface CondicionalRequestDto {
    clienteId: number;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itensCondicional: ItemCondicionalRequestDto[];
}