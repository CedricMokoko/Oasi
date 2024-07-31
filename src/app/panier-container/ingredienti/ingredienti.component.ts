import { Component, Input } from '@angular/core';
import { Ingredients } from '../../shared/interfaces/ingredients.interface';

@Component({
  selector: 'app-ingredienti',
  templateUrl: './ingredienti.component.html',
  styleUrl: './ingredienti.component.scss',
})
export class IngredientiComponent {
  //Dato proveniente da panier-container
  @Input()
  public ingredienti: Ingredients[] = [];
}
