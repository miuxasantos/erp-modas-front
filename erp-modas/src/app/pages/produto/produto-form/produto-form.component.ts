import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ProdutoApiService } from '@core/services/produto/produto-api.service';
import { CategoriaApiService } from '@core/services/categoria-api.service';
import { CategoriaResponseDto } from '@core/dtos/categoria/categoria-response.dto';
import { UploadApiService } from '@core/services/upload-api.service';

@Component({
  selector: 'app-produto-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    PageHeaderComponent,
  ],
  templateUrl: './produto-form.component.html',
})
export class ProdutoFormComponent implements OnInit {
  private readonly produtoApi    = inject(ProdutoApiService);
  private readonly categoriaApi  = inject(CategoriaApiService);
  private readonly uploadApi = inject(UploadApiService);
  private readonly messageService = inject(MessageService);
  private readonly router        = inject(Router);
  private readonly fb            = inject(FormBuilder);
  private readonly route         = inject(ActivatedRoute);

  id: number | null = null;
  isEdicao = false;
  salvando = signal(false);
  imagemPreview = signal<string | null>(null);
  uploading = signal(false);
  categorias: CategoriaResponseDto[] = [];

  breadcrumbs: MenuItem[] = [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Produtos',  routerLink: '/produtos' },
    { label: 'Novo Produto' },
  ];

  form = this.fb.group({
    nome: new FormControl<string>('', Validators.required),
    codigo: new FormControl<number | null>(null),
    descricao: [''],
    marca: ['', Validators.required],
    tecido: [''],
    precoCusto: [0, Validators.required],
    precoVenda: [0, Validators.required],
    categoriaId: new FormControl<number | null>(null, Validators.required),
    ativo: [true],
    imagem: [''],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    console.log(idParam);

    this.id = idParam ? Number(idParam) : null;

    this.isEdicao = this.id !== null;

    this.categoriaApi.getAll().subscribe({
      next: categorias => this.categorias = categorias,
    });

    if (this.id !== null) {
      this.breadcrumbs[2].label = 'Editar Produto';

      this.produtoApi.getById(this.id).subscribe({
        next: produto => {
          this.form.patchValue({
            ...produto,
            categoriaId: produto.categoriaId,
          });
        },
      });
    }
  }

  onImagemSelecionada(event: Event): void {
    const input   = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => this.imagemPreview.set(reader.result as string);
    reader.readAsDataURL(arquivo);

    this.uploading.set(true);
    this.uploadApi.uploadImagem(arquivo).subscribe({
      next: ({ url }) => {
        this.form.patchValue({ imagem: url });
        this.uploading.set(false);
      },
      error: () => this.uploading.set(false),
    });
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const dto = this.form.getRawValue() as any;

    const request$ = this.isEdicao
      ? this.produtoApi.update(this.id!, dto)
      : this.produtoApi.create(dto);

    request$.subscribe({
      next: (produto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.isEdicao
            ? 'Produto atualizado!'
            : 'Produto criado! Agora cadastre as variações.',
        });
        // após criar, já redireciona para a tela de variações
        this.router.navigate(['/produtos', produto.id, 'variacoes']);
        this.salvando.set(false);
      },
      error: () => this.salvando.set(false),
    });
  }

  cancelar(): void {
    this.router.navigate(['/produtos']);
  }
}