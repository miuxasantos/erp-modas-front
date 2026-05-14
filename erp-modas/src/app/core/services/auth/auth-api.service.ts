import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { LoginRequestDto } from "@core/dtos/auth/login-request.dto";
import { Observable } from "rxjs";
import { AuthResponseDto } from "@core/dtos/auth/auth-response.dto";

@Injectable({providedIn: 'root'})
export class AuthApiService {
    private readonly http = inject(HttpClient);
    private readonly url = `${environment.apiUrl}/auth`;

    login(dto: LoginRequestDto): Observable<AuthResponseDto> {
        return this.http.post<AuthResponseDto>(`${this.url}/login`, dto);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.url}/logout`, {});
    }
}
