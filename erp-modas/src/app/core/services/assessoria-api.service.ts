import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { AssessoriaResponseDto } from "@core/dtos/assessoria/assessoria-response.dto";
import { AssessoriaRequestDto } from "@core/dtos/assessoria/assessoria-request.dto";
import { AssessoriaUpdateDto } from "@core/dtos/assessoria/assessoria-update.dto";

@Injectable({providedIn: 'root'})
export class AssessoriaApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/assessorias`;

    getAll(): Observable<AssessoriaResponseDto[]> {
        return this.http.get<AssessoriaResponseDto[]>(this.url);
    }

    getById(id: number): Observable<AssessoriaResponseDto> {
        return this.http.get<AssessoriaResponseDto>(`${this.url}/${id}`);
    }

    create(dto: AssessoriaRequestDto): Observable<AssessoriaResponseDto> {
        return this.http.post<AssessoriaResponseDto>(this.url, dto);
    }

    update(id: number, dto: AssessoriaUpdateDto): Observable<AssessoriaResponseDto> {
        return this.http.put<AssessoriaResponseDto>(`${this.url}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}