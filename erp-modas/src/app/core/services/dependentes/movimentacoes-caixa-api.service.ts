import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { MovimentacoesCaixaResponseDto } from "@core/dtos/movimentacoesCaixa/movimentacoes-caixa-response.dto";
import { MovimentacoesCaixaRequestDto } from "@core/dtos/movimentacoesCaixa/movimentacoes-caixa-request.dto";
import { MovimentacoesCaixaUpdateDto } from "@core/dtos/movimentacoesCaixa/movimentacoes-caixa-update.dto";

@Injectable({ providedIn: 'root' })
export class MovimentacoesCaixaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/movimentacoes-caixa`;

    getAll(): Observable<MovimentacoesCaixaResponseDto[]> {
        return this.http.get<MovimentacoesCaixaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<MovimentacoesCaixaResponseDto> {
        return this.http.get<MovimentacoesCaixaResponseDto>(`${this.url}/${id}`);
    }

    getByCaixa(caixaId: number): Observable<MovimentacoesCaixaResponseDto[]> {
        return this.http.get<MovimentacoesCaixaResponseDto[]>(`${this.url}/caixa/${caixaId}`);
    }

    create(dto: MovimentacoesCaixaRequestDto): Observable<MovimentacoesCaixaResponseDto> {
        return this.http.post<MovimentacoesCaixaResponseDto>(this.url, dto);
    }

    update(id: number, dto: MovimentacoesCaixaUpdateDto): Observable<MovimentacoesCaixaResponseDto> {
        return this.http.put<MovimentacoesCaixaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
