import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { ContasReceberResponseDto } from "@core/dtos/contasReceber/contas-receber-response.dto";

@Injectable({ providedIn: 'root' })
export class ContasReceberApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/contas-receber`;

    getAll(): Observable<ContasReceberResponseDto[]> {
        return this.http.get<ContasReceberResponseDto[]>(this.url);
    }

    getById(id: number): Observable<ContasReceberResponseDto> {
        return this.http.get<ContasReceberResponseDto>(`${this.url}/${id}`);
    }

    getByCaixa(caixaId: number): Observable<ContasReceberResponseDto[]> {
        return this.http.get<ContasReceberResponseDto[]>(`${this.url}/caixa/${caixaId}`);
    }

    create(dto: ContasReceberResponseDto): Observable<ContasReceberResponseDto> {
        return this.http.post<ContasReceberResponseDto>(this.url, dto);
    }

    update(id: number, dto: ContasReceberResponseDto): Observable<ContasReceberResponseDto> {
        return this.http.put<ContasReceberResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    receber(id: number, dto: ContasReceberResponseDto): Observable<ContasReceberResponseDto> {
        return this.http.put<ContasReceberResponseDto>(`${this.url}/${id}/receber`, dto)
    }
}
