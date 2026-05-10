import { ItemCondicionalResponseDto } from "../itemCondicional/item-condicional-response.dto";

export interface CompraUpdateDto {
    clienteId: number;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itens: ItemCondicionalResponseDto[];
}