import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CaixaResponseDto } from "@core/dtos/caixa/caixa-response.dto";
import { CaixaRequestDto } from "@core/dtos/caixa/caixa-request.dto";
import { CaixaUpdateDto } from "@core/dtos/caixa/caixa-update.dto";

@Injectable({ providedIn: 'root' })
export class CaixaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/caixas`;

    getAll(): Observable<CaixaResponseDto[]> {
        return this.http.get<CaixaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<CaixaResponseDto> {
        return this.http.get<CaixaResponseDto>(`${this.url}/${id}`);
    }

    getCaixaAtual(): Observable<CaixaResponseDto> {
        return this.http.get<CaixaResponseDto>(`${this.url}/atual`);
    }

    create(dto: CaixaRequestDto): Observable<CaixaResponseDto> {
        return this.http.post<CaixaResponseDto>(this.url, dto);
    }

    update(id: number, dto: CaixaUpdateDto): Observable<CaixaResponseDto> {
        return this.http.put<CaixaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    abrirCaixa(): Observable<CaixaResponseDto> {
        return this.http.post<CaixaResponseDto>(`${this.url}/abrir`, {});
    }

    fecharCaixa(id: number): Observable<CaixaResponseDto> {
        return this.http.post<CaixaResponseDto>(`${this.url}/${id}/fechar`, {});
    }
}
