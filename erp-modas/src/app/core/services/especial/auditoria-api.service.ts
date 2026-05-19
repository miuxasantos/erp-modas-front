import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { AuditoriaResponseDto } from "@core/dtos/auditoria/auditoria-response.dto";

@Injectable({ providedIn: 'root' })
export class VendaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/auditorias`;

    getAll(): Observable<AuditoriaResponseDto[]> {
        return this.http.get<AuditoriaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<AuditoriaResponseDto> {
        return this.http.get<AuditoriaResponseDto>(`${this.url}/${id}`);
    }
}
