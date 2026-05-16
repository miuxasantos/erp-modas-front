import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { UsuarioResponseDto } from "@core/dtos/usuario/usuario-response.dto";
import { UsuarioRequestDto } from "@core/dtos/usuario/usuario-request.dto";
import { UsuarioUpdateDto } from "@core/dtos/usuario/usuario-update.dto";

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/usuarios`;

    getAll(): Observable<UsuarioResponseDto[]> {
        return this.http.get<UsuarioResponseDto[]>(this.url);
    }

    getById(id: number): Observable<UsuarioResponseDto> {
        return this.http.get<UsuarioResponseDto>(`${this.url}/${id}`);
    }

    create(dto: UsuarioRequestDto): Observable<UsuarioResponseDto> {
        return this.http.post<UsuarioResponseDto>(this.url, dto);
    }

    update(id: number, dto: UsuarioUpdateDto): Observable<UsuarioResponseDto> {
        return this.http.put<UsuarioResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
