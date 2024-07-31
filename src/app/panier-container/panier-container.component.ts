import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredients } from '../shared/interfaces/ingredients.interface';
import { PanierService } from '../shared/services/panier.service';

@Component({
  selector: 'app-panier-container',
  templateUrl: './panier-container.component.html',
  styleUrls: ['./panier-container.component.scss'],
})
export class PanierContainerComponent {
  public ingredienti$: Observable<Ingredients[]> =
    this.panierService.ingredienti$;

  constructor(private panierService: PanierService) {}

  public clearCarello(): void {
    this.panierService.clearCarello$().subscribe({
      next: () => console.log('Carrello svuotato con successo'),
      error: (error) =>
        console.error('Errore durante lo svuotamento del carrello', error),
    });
  }
}
