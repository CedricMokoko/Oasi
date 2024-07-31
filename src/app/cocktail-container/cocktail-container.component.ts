import { Component, OnInit } from '@angular/core';
import { Cocktail } from '../shared/interfaces/cocktail.interface';
import { CocktailService } from '../shared/services/cocktail.service';
import { Observable, Subscription } from 'rxjs';
import { CocktailDataService } from '../shared/services/data-cocktail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cocktail-container',
  templateUrl: './cocktail-container.component.html',
  styleUrls: ['./cocktail-container.component.scss'],
})
export class CocktailContainerComponent implements OnInit {
  public cocktailsListParent$: Observable<Cocktail[]> =
    this.cocktailService.cocktails$;

  private subscriptions: Subscription = new Subscription();

  public firstCocktail$: Observable<Cocktail | null>;

  // Injection de notre Service Cocktail
  constructor(
    private cocktailService: CocktailService,
    private cocktailDataService: CocktailDataService,
    private router: Router
  ) {
    this.firstCocktail$ = this.cocktailDataService.cocktail$;
  }

  ngOnInit(): void {
    // Sottoscrivi all'Observable per ottenere i dati
    this.firstCocktail$.subscribe((cocktail) => {
      if (cocktail) {
        // Esegui la redirezione se i dati sono disponibili
        this.router.navigate(['/cocktails-list', cocktail._id, cocktail.name]);
      }
    });
  }

  public clearCarello(): void {
    this.cocktailService.clearCocktailList$().subscribe({
      next: () => console.log('Carrello svuotato con successo'),
      error: (error) =>
        console.error('Errore durante lo svuotamento del carrello', error),
    });
  }
}
