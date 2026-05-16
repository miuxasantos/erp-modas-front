import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { VendaResponseDto } from "@core/dtos/venda/venda-response.dto";
import { ItemVendaResponseDto } from "@core/dtos/itemVenda/item-venda-response.dto";
import { VendaRequestDto } from "@core/dtos/venda/venda-request.dto";
import { VendaUpdateDto } from "@core/dtos/venda/venda-update.dto";

@Injectable({ providedIn: 'root' })
export class VendaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/vendas`;

    getAll(): Observable<VendaResponseDto[]> {
        return this.http.get<VendaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<VendaResponseDto> {
        return this.http.get<VendaResponseDto>(`${this.url}/${id}`);
    }

    getItens(vendaId: number): Observable<ItemVendaResponseDto[]> {
        return this.http.get<ItemVendaResponseDto[]>(`${this.url}/${vendaId}/itens`);
    }

    create(dto: VendaRequestDto): Observable<VendaResponseDto> {
        return this.http.post<VendaResponseDto>(this.url, dto);
    }

    update(id: number, dto: VendaUpdateDto): Observable<VendaResponseDto> {
        return this.http.put<VendaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
