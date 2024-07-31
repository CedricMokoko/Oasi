import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cocktail } from '../shared/interfaces/cocktail.interface';
import { CocktailDataService } from '../shared/services/data-cocktail.service';
import { AuthService } from '../shared/services/auth.service'; // Importa il servizio AuthService

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public cocktail$: Observable<Cocktail | null>;

  constructor(
    private cocktailDataService: CocktailDataService,
    public authService: AuthService // Inietta AuthService
  ) {
    this.cocktail$ = this.cocktailDataService.cocktail$;
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated');
      // Esegui eventuali azioni se necessario
    } else {
      console.log('User is not authenticated');
      // Esegui eventuali azioni se necessario
    }
  }

  // Funzione per verificare se l'utente è un admin
  isAdmin(): boolean {
    return (
      this.authService.isAuthenticated() &&
      sessionStorage.getItem('role') === 'admin'
    );
  }

  // Funzione di logout
  logout(): void {
    this.authService.logout();
  }
}
