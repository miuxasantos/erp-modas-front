import { ClienteResponseDto } from "../cliente/cliente-response.dto";
import { ItemCondicionalResponseDto } from "../dependentes/itemCondicional/item-condicional-response.dto";

export interface CondicionalResponseDto {
    id: number;
    cliente: ClienteResponseDto;
    dataInicio: string;
    periodo: number;
    dataFinal: string;
    itensCondicional: ItemCondicionalResponseDto[];
}