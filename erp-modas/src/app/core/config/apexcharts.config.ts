import { ApexLocale, ApexOptions } from 'ng-apexcharts';

const PT_BR: ApexLocale = {
    name: 'pt-br',
    options: {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        toolbar: {
            exportToSVG: 'Baixar SVG',
            exportToPNG: 'Baixar PNG',
            exportToCSV: 'Baixar CSV',
            menu: 'Menu',
            selection: 'Selecionar',
            selectionZoom: 'Selecionar zoom',
            zoomIn: 'Aumentar',
            zoomOut: 'Diminuir',
            pan: 'Navegação',
            reset: 'Reiniciar zoom',
        },
    },
};


const PADROES: ApexOptions = {
    chart: {
        locales: [PT_BR],
        defaultLocale: 'pt-br',
        fontFamily: 'inherit',
        toolbar: { show: false },
        animations: { speed: 400 },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    tooltip: { theme: 'light' },
    noData: { text: 'Sem dados no período' },
};

export function configurarApexCharts(): void {
    (window as unknown as { Apex: ApexOptions }).Apex = PADROES;
}

export const formatarMoeda = (valor: number): string =>
    (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });