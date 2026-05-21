import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { ClienteResponseDto } from "@core/dtos/cliente/cliente-response.dto";
import { ClienteRequestDto } from "@core/dtos/cliente/cliente-request.dto";
import { ClienteUpdateDto } from "@core/dtos/cliente/cliente-update.dto";

@Injectable({ providedIn: 'root' })
export class ClienteApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/clientes`;

    getAll(): Observable<ClienteResponseDto[]> {
        return this.http.get<ClienteResponseDto[]>(this.url);
    }

    getById(id: number): Observable<ClienteResponseDto> {
        return this.http.get<ClienteResponseDto>(`${this.url}/${id}`);
    }

    create(dto: ClienteRequestDto): Observable<ClienteResponseDto> {
        return this.http.post<ClienteResponseDto>(this.url, dto);
    }

    update(id: number, dto: ClienteUpdateDto): Observable<ClienteResponseDto> {
        return this.http.put<ClienteResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
