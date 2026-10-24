export interface CompraResumoResponseDto {
    id: number;
    lote: string | null;
    dataChegada: string;
    fornecedor: string;
    unidadesAdicionadas: number;
    produtosDistintos: number;
    valorTotal: number;
}