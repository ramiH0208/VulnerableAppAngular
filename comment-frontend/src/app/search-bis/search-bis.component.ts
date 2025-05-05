// search-bis.component.ts — démo vulnérabilité DOMPurify (CVE-2022-23494)
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
      <h2>Démo XSS (mXSS / DOMPurify bypass) avec DOMPurify 2.3.9</h2>
      <input id="searchInput" type="text" placeholder="Ex : payload XSS SVG" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;" />
      <button (click)="search()" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none;">Injecter</button>

      <div style="margin-top: 2rem;">
        <h3>Résultat :</h3>
        <div id="queryDisplay" style="margin-bottom: 1rem;"></div>
        <button (click)="remutate()" style="padding: 0.4rem 0.8rem; background: #ffc107; border: none; color: black; border-radius: 4px;">Relancer mutation DOM</button>
      </div>
    </div>
  `
})
export class SearchBisComponent implements OnInit {
  remutate(): void {
    const queryDisplay = document.getElementById('queryDisplay');
    if (queryDisplay) queryDisplay.innerHTML += '';
  }
  ngOnInit(): void {
    const q = new URLSearchParams(location.search).get('q') || '';

    const sanitized = DOMPurify.sanitize(q, {
      ALLOW_UNKNOWN_PROTOCOLS: true,
      WHOLE_DOCUMENT: false,
      ADD_TAGS: ['math', 'mtext', 'mglyph', 'style', 'table', 'img'],
      ADD_ATTR: ['title', 'onerror', 'src']
    });

    const queryDisplay = document.getElementById('queryDisplay');
    if (queryDisplay) {
      queryDisplay.innerHTML = sanitized + `<p style="margin-top:1rem;"><strong>💡 Payload inséré. Si exécutable, le XSS doit apparaître.</strong></p>';"><strong>💡 Payload inséré. Si exécutable, le XSS doit apparaître.</strong></p>`;
      // mutation forcée : innerHTML += '' déclenche le re-parsing DOM
      queryDisplay.innerHTML += '';
    }

    const input = document.getElementById('searchInput') as HTMLInputElement;
    if (input) input.value = q;
  }

  search(): void {
    const input = (document.getElementById('searchInput') as HTMLInputElement).value;
    location.href = '/search-bis?q=' + encodeURIComponent(input);
  }
}
