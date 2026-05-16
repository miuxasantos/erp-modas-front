import { inject, Injectable, signal } from "@angular/core";
import { CaixaRequestDto } from "@core/dtos/caixa/caixa-request.dto";
import { CaixaResponseDto } from "@core/dtos/caixa/caixa-response.dto";
import { StatusCaixa } from "@core/enums/status-caixa.enum";
import { map, Observable, tap } from "rxjs";
import { CaixaApiService } from "./caixa-api.service";
import { Caixa } from "@core/models/caixa.model";
import { CaixaUpdateDto } from "@core/dtos/caixa/caixa-update.dto";

@Injectable({ providedIn: 'root' })
export class CaixaService {
    private readonly api = inject(CaixaApiService);

    private readonly _caixaAtual =  signal<Caixa | null>(null);
    readonly caixaAtual = this._caixaAtual.asReadonly();
    readonly caixaAberto = () => this._caixaAtual()?.statusCaixa === StatusCaixa.ABERTO;

    carregarCaixaAtual(): Observable<Caixa> {
        return this.api.getCaixaAtual().pipe(
            map(dto => new Caixa(dto)),
            tap(caixa => this._caixaAtual.set(caixa)),
        );
    }

    abrir(): Observable<Caixa> {
        return this.api.abrirCaixa().pipe(
            map(dto => new Caixa(dto)),
            tap(caixa => this._caixaAtual.set(caixa)),
        );
    }

    fechar(id: number): Observable<Caixa> {
        return this.api.fecharCaixa(id).pipe(
            map(dto => new Caixa(dto)),
            tap(caixa => this._caixaAtual.set(caixa)),
        );
    }

    getAll(): Observable<Caixa[]> {
        return this.api.getAll().pipe(
            map(dtos => dtos.map(dto => new Caixa(dto)))
        );
    }
}
