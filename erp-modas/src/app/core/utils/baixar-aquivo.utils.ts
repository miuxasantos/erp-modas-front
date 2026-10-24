/**
 * Dispara o download de um Blob no navegador.
 * O download precisa passar pelo HttpClient (por causa do token JWT no header),
 * então não dá para usar um <a href> direto para a URL da API.
 */
export function baixarArquivo(blob: Blob, nomeArquivo: string): void {
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Libera a memória do Blob depois que o navegador iniciou o download
    setTimeout(() => URL.revokeObjectURL(url));
}

/** Lê o nome do arquivo de: attachment; filename="relatorio-vendas_2026-10-01_a_2026-10-31.pdf" */
export function nomeDoContentDisposition(header: string | null): string | null {
    const resultado = header?.match(/filename="?([^";]+)"?/i);
    return resultado ? resultado[1] : null;
}