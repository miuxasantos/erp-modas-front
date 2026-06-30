import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ContasPagarResponseDto } from "@core/dtos/dependentes/contasPagar/contas-pagar-response.dto";
import { DataPagamentoDto } from "@core/dtos/dependentes/contasPagar/data-pagamento.dto";

@Injectable({ providedIn: 'root' })
export class ContasPagarApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/contas-pagar`;

    getAll(): Observable<ContasPagarResponseDto[]> {
        return this.http.get<ContasPagarResponseDto[]>(this.url);
    }

    getById(id: number): Observable<ContasPagarResponseDto> {
        return this.http.get<ContasPagarResponseDto>(`${this.url}/${id}`);
    }

    getByCaixa(caixaId: number): Observable<ContasPagarResponseDto[]> {
        return this.http.get<ContasPagarResponseDto[]>(`${this.url}/caixa/${caixaId}`);
    }

    create(dto: ContasPagarResponseDto): Observable<ContasPagarResponseDto> {
        return this.http.post<ContasPagarResponseDto>(this.url, dto);
    }

    update(id: number, dto: ContasPagarResponseDto): Observable<ContasPagarResponseDto> {
        return this.http.put<ContasPagarResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    pagar(id: number, dto: DataPagamentoDto): Observable<ContasPagarResponseDto> {
        return this.http.put<ContasPagarResponseDto>(`${this.url}/${id}/pagar`, dto)
    }
}
