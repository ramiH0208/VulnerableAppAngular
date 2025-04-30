// search.component.ts (DOM XSS réaliste : affichage de la requête avec innerHTML)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService, Comment } from '../comment/comment.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container" style="padding: 2rem; max-width: 600px; margin: auto; font-family: sans-serif;">
      <h2>Recherche dans les commentaires</h2>
      <input id="searchInput" type="text" placeholder="Entrez un mot-clé" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;" />
      <button (click)="search()" style="padding: 0.5rem 1rem; background: #007BFF; color: white; border: none;">Rechercher</button>

      <div style="margin-top: 2rem;">
        <h3>Résultat pour :</h3>
        <div id="queryDisplay" style="margin-bottom: 1rem;"></div>
        <div id="result"></div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    const q = new URLSearchParams(location.search).get('q') || '';

    // XSS vulnérable ici : affichage direct de l'entrée utilisateur
    document.getElementById('queryDisplay')!.innerHTML = q;

    this.commentService.getComments().subscribe(data => {
      this.comments = data;
      this.displayFiltered(q);
      (document.getElementById('searchInput') as HTMLInputElement).value = q;
    });
  }

  search(): void {
    const input = (document.getElementById('searchInput') as HTMLInputElement).value;
    location.href = '/search?q=' + encodeURIComponent(input);
  }

  displayFiltered(keyword: string): void {
    const resultEl = document.getElementById('result')!;
    const matches = this.comments.filter(c => c.content.includes(keyword));
    resultEl.innerHTML = matches.map(c => `
      <div style="margin-bottom:1rem;padding:1rem;background:#f9f9f9;border-radius:4px;">
        <strong>${c.author}</strong><br>
        <div>${c.content}</div>
      </div>
    `).join('');
  }
}