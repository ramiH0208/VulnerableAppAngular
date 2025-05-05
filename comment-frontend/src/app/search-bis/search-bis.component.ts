import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-search-bis',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container" style="padding: 2rem; max-width: 600px; margin: auto; font-family: sans-serif;">
      <h2>Démo mXSS avec DOMPurify 2.0.17</h2>
      <input id="searchInput" type="text" placeholder="Ex : payload mXSS" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;" />
      <button (click)="search()" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none;">Injecter</button>

      <div style="margin-top: 2rem;">
        <h3>Résultat :</h3>
        <div id="queryDisplay" style="margin-bottom: 1rem;"></div>
      </div>
    </div>
  `
})
export class SearchBisComponent implements OnInit {
  ngOnInit(): void {
    const q = new URLSearchParams(location.search).get('q') || '';

    const sanitized = DOMPurify.sanitize(q); // DOMPurify 2.0.17 ne bloque pas le payload mXSS

    const queryDisplay = document.getElementById('queryDisplay');
    if (queryDisplay) {
      queryDisplay.innerHTML = sanitized;
    }

    const input = document.getElementById('searchInput') as HTMLInputElement;
    if (input) input.value = q;
  }

  search(): void {
    const input = (document.getElementById('searchInput') as HTMLInputElement).value;
    location.href = '/search-bis?q=' + encodeURIComponent(input);
  }
}
