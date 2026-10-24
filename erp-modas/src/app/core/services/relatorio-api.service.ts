import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { FormatoExportacao } from "@core/enums/formato-exportacao.enum";
import { FiltroPeriodoDto } from "@core/dtos/relatorios/filtro-periodo.dto";
import { RelatorioVendasResponseDto } from "@core/dtos/relatorios/vendas/relatorio-vendas-response.dto";
import { nomeDoContentDisposition } from "@core/utils/baixar-aquivo.utils";
import { FiltroVendasAgrupadasDto } from "@core/dtos/relatorios/vendas/filtro-vendas-agrupadas.dto";
import { VendaAgrupadaResponseDto } from "@core/dtos/relatorios/vendas/venda-agrupada-response.dto";
import { RelatorioComprasResponseDto } from "@core/dtos/relatorios/compras/relatorio-compras-response.dto";
import { CompraResumoResponseDto } from "@core/dtos/relatorios/compras/compra-resumo-response.dto";
import { FiltroEstoqueDto } from "@core/dtos/relatorios/estoque/filtro-estoque.dto";
import { EstoqueGeralResponseDto } from "@core/dtos/relatorios/estoque/estoque-geral-response.dto";
import { EstoqueProdutoResponseDto } from "@core/dtos/relatorios/estoque/estoque-produto-response.dto";
import { FornecedorComprasResponseDto } from "@core/dtos/relatorios/fornecedores/fornecedor-compras-response.dto";
import { FaturamentoPeriodoResponseDto } from "@core/dtos/relatorios/financeiro/faturamento-periodo-response.dto";
import { ContasPeriodoResponseDto } from "@core/dtos/relatorios/financeiro/contas-periodo.response.dto";
import { FiltroFiscalDto } from "@core/dtos/relatorios/fiscal/filtro-fiscal.dto";
import { RelatorioFiscalResponseDto } from "@core/dtos/relatorios/fiscal/relatorio-fiscal-response.dto";

export type FiltrosRelatorio = Record<string, string | number | boolean | null | undefined>;

export interface ArquivoRelatorio {
    blob: Blob;
    nomeArquivo: string;
}

@Injectable({ providedIn: 'root' })
export class RelatorioApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/relatorios`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CONSULTAS (JSON para exibir na tela)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    vendas(filtro: FiltroPeriodoDto): Observable<RelatorioVendasResponseDto> {
        return this.http.get<RelatorioVendasResponseDto>(`${this.url}/vendas`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    vendasAgrupadas(filtro: FiltroVendasAgrupadasDto): Observable<VendaAgrupadaResponseDto[]> {
        // O agrupamento vai no caminho; só as datas viram query params
        const { agrupamento, ...periodo } = filtro;
        return this.http.get<VendaAgrupadaResponseDto[]>(`${this.url}/vendas/${agrupamento}`, {
            params: this.montarParams(periodo),
        });
    }

    compras(filtro: FiltroPeriodoDto): Observable<RelatorioComprasResponseDto> {
        return this.http.get<RelatorioComprasResponseDto>(`${this.url}/compras/periodo`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    comprasMaisProdutos(filtro: FiltroPeriodoDto): Observable<CompraResumoResponseDto[]> {
        return this.http.get<CompraResumoResponseDto[]>(`${this.url}/compras/mais-produtos`, {
            params: this.montarParams({ ...filtro }),
        });
    }

     estoqueGeral(filtro: FiltroEstoqueDto): Observable<EstoqueGeralResponseDto> {
        return this.http.get<EstoqueGeralResponseDto>(`${this.url}/estoque/geral`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    estoqueProdutos(filtro: FiltroEstoqueDto): Observable<EstoqueProdutoResponseDto[]> {
        return this.http.get<EstoqueProdutoResponseDto[]>(`${this.url}/estoque/produtos`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    fornecedores(filtro: FiltroPeriodoDto): Observable<FornecedorComprasResponseDto[]> {
        return this.http.get<FornecedorComprasResponseDto[]>(`${this.url}/compras/fornecedores`, {
            params: this.montarParams({ ...filtro }),
        });
    }

        faturamento(filtro: FiltroPeriodoDto): Observable<FaturamentoPeriodoResponseDto> {
        return this.http.get<FaturamentoPeriodoResponseDto>(`${this.url}/financeiro/faturamento`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    contasAReceber(filtro: FiltroPeriodoDto): Observable<ContasPeriodoResponseDto> {
        return this.http.get<ContasPeriodoResponseDto>(`${this.url}/financeiro/contas-receber`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    contasAPagar(filtro: FiltroPeriodoDto): Observable<ContasPeriodoResponseDto> {
        return this.http.get<ContasPeriodoResponseDto>(`${this.url}/financeiro/contas-pagar`, {
            params: this.montarParams({ ...filtro }),
        });
    }

    fiscal(filtro: FiltroFiscalDto): Observable<RelatorioFiscalResponseDto> {
        return this.http.get<RelatorioFiscalResponseDto>(`${this.url}/financeiro/fiscal`, {
            params: this.montarParams({ ...filtro }),
        });
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // EXPORTAÇÃO (um método só para todos os relatórios)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * caminho = trecho entre /relatorios/ e /exportar no backend:
     * 'vendas', 'vendas/clientes', 'compras/periodo', 'compras/fornecedores',
     * 'compras/mais-produtos', 'estoque', 'financeiro/resumo', 'financeiro/fiscal'
     */
    exportar(caminho: string, formato: FormatoExportacao, filtros: FiltrosRelatorio): Observable<ArquivoRelatorio> {
        return this.http.get(`${this.url}/${caminho}/exportar`, {
            params: this.montarParams({ ...filtros, formato }),
            responseType: 'blob',
            // observe 'response' para ter acesso aos headers (nome do arquivo vem no Content-Disposition)
            observe: 'response',
        }).pipe(
            map(resposta => ({
                blob: resposta.body!,
                nomeArquivo: nomeDoContentDisposition(resposta.headers.get('Content-Disposition'))
                    ?? `relatorio.${formato.toLowerCase()}`,
            }))
        );
    }

    /** Ignora filtros vazios: no backend, parâmetro ausente = sem limite (ex.: datas opcionais) */
    private montarParams(filtros: FiltrosRelatorio): HttpParams {
        let params = new HttpParams();
        for (const [chave, valor] of Object.entries(filtros)) {
            if (valor !== null && valor !== undefined && valor !== '') {
                params = params.set(chave, String(valor));
            }
        }
        return params;
    }
}