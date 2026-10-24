// Datas no formato ISO (yyyy-MM-dd), que é o que o @DateTimeFormat(iso = DATE) do backend espera
export interface FiltroPeriodoDto {
    inicio: string;
    fim: string;
}