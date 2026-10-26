import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'imagemUrl', standalone: true })
export class ImagemUrlPipe implements PipeTransform {
  transform(
    caminho: string | null | undefined,
    variante: 'full' | 'thumb' = 'full'
  ): string {
    if (!caminho) return '';

    if (
      /^(https?:\/\/|data:image\/|blob:)/i.test(caminho)
    ) {
      return caminho;
    }

    const path = variante === 'thumb'
      ? caminho.replace(/\/([^/]+)$/, '/thumb/$1')
      : caminho;

    return `${environment.imagensUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
