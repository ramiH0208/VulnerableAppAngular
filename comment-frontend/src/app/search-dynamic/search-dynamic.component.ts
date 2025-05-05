// search-dynamic.component.ts
import {
  Component, OnInit, ViewChild, ViewContainerRef, Compiler,
  Injector, NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService, Comment } from '../comment/comment.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search-dynamic',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container" style="padding: 2rem; max-width: 600px; margin: auto; font-family: sans-serif;">
      <h2>Recherche dynamique vulnérable</h2>
      <input id="searchInput" type="text" placeholder="Entrez un mot-clé"
             style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;" />
      <button (click)="search()" style="padding: 0.5rem 1rem; background: #007BFF; color: white; border: none;">
        Rechercher
      </button>

      <div style="margin-top: 2rem;">
        <h3>Résultat pour :</h3>
        <p><strong>{{ searchQuery }}</strong></p>
        <ng-template #dynamicResult></ng-template>
      </div>
    </div>
  `
})
export class SearchDynamicComponent implements OnInit {
  @ViewChild('dynamicResult', { read: ViewContainerRef, static: true }) dynamic!: ViewContainerRef;
  comments: Comment[] = [];
  searchQuery: string = '';

  constructor(
    private commentService: CommentService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    const q = new URLSearchParams(location.search).get('q') || '';
    this.searchQuery = q;

    const input = document.getElementById('searchInput') as HTMLInputElement;
    if (input) input.value = q;

    this.commentService.getComments().subscribe(data => {
      this.comments = data;
      this.displayFiltered(q);
    });
  }

  search(): void {
    const input = (document.getElementById('searchInput') as HTMLInputElement).value;
    location.href = '/search-dynamic?q=' + encodeURIComponent(input);
  }

  displayFiltered(keyword: string): void {
    const matches = this.comments.filter(c => c.content.includes(keyword));

    const dynamicHtml = matches.map(c => `
      <div style="margin-bottom:1rem;padding:1rem;background:#f9f9f9;border-radius:4px;">
        <strong>${c.author}</strong><br>
        <div>${c.content}</div>
      </div>
    `).join('');

    const template = `<div>${dynamicHtml}</div>`; // ⚠️ vulnérable

    const tmpCmp = Component({ template })(class {});
    const tmpModule = NgModule({ declarations: [tmpCmp] })(class {});

    this.compiler.compileModuleAndAllComponentsAsync(tmpModule).then(factories => {
      const compFactory = factories.componentFactories[0];
      this.dynamic.clear();
      this.dynamic.createComponent(compFactory, 0, this.injector);
    });
  }
}
