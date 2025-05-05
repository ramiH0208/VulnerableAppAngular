// login.component.ts — composant standalone pour saisir l'utilisateur
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="text-align: center; margin-top: 5rem; font-family: sans-serif;">
      <h2>Connexion</h2>
      <input [(ngModel)]="username" placeholder="Entrez votre nom" style="padding: 0.5rem; font-size: 1rem;" />
      <button (click)="login()" style="margin-left: 1rem; padding: 0.5rem 1rem; font-size: 1rem;">Entrer</button>
    </div>
  `
})
export class LoginComponent {
  username = '';

  constructor(private session: UserSessionService, private router: Router) {}

  login() {
    if (this.username.trim()) {
      this.session.setUser(this.username);
      this.router.navigate(['/comment']);
    }
  }
}
