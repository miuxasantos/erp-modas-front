import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UploadApiService {
  private readonly http = inject(HttpClient);
  private readonly url  = `${environment.apiUrl}/uploads`;

  uploadImagem(arquivo: File): Observable<{ caminho: string }> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return this.http.post<{ caminho: string }>(
      `${this.url}/imagem`,
      formData
    );
  }
}