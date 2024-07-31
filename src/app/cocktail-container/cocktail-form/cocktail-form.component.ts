import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CocktailService } from '../../shared/services/cocktail.service';
import { Cocktail } from '../../shared/interfaces/cocktail.interface';
import { first, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-cocktail-form',
  templateUrl: './cocktail-form.component.html',
  styleUrl: './cocktail-form.component.scss',
})
export class CocktailFormComponent implements OnInit, AfterViewInit {
  public cocktailForm!: FormGroup;
  private cocktail: Cocktail;
  private firstCocktail$: Cocktail[];

  public get ingredients() {
    return this.cocktailForm.get('ingredients') as FormArray;
  }

  @ViewChild('nameInput') nameInputRef: ElementRef;

  constructor(
    private fb: FormBuilder,
    private cocktailService: CocktailService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const id = paramMap.get('id');
      const name = paramMap.get('name');
      if (id !== null) {
        this.cocktailService
          .getCocktail$(id, name)
          .pipe(first((x) => !!x)) // !!x convertie en boolean
          .subscribe((cocktail: Cocktail) => (this.cocktail = cocktail));
        this.cocktailForm = this.initForm(this.cocktail);
      } else {
        this.cocktailForm = this.initForm();
      }
    });
  }

  private initForm(
    cocktail: Cocktail = {
      _id: '',
      name: '',
      description: '',
      img: '',
      ingredients: [],
    }
  ): FormGroup {
    return (this.cocktailForm = this.fb.group({
      name: [cocktail.name, Validators.required],
      img: [cocktail.img, Validators.required],
      description: [cocktail.description, Validators.required],
      ingredients: this.fb.array(
        cocktail.ingredients.map((ingredient) =>
          this.fb.group({
            name: [ingredient.name, Validators.required],
            quantity: [ingredient.quantity, Validators.required],
          })
        ),
        Validators.required
      ),
    }));
  }

  public addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [0, Validators.required],
      })
    );
  }

  ngAfterViewInit() {
    this.nameInputRef.nativeElement.focus();
  }

  public submit(): void {
    if (this.cocktail) {
      this.cocktailService
        .editCocktails$(this.cocktail._id, this.cocktailForm.value)
        .subscribe();
    } else {
      this.cocktailService.addCocktails$(this.cocktailForm.value).subscribe();
    }
    this.router.navigate(['..'], { relativeTo: this.activatedRoute }); //navigation un cran en arrière
  }

  public delete(): void {
    this.cocktailService.deleteCocktail$(this.cocktail._id).subscribe();
    this.cocktailForm.reset();
  }

  public redirectToCocktailsList() {
    this.cocktailService.fetchCocktails$().subscribe((cocktails) => {
      this.firstCocktail$ = cocktails;
      if (this.firstCocktail$.length > 0) {
        const firstCocktail = this.firstCocktail$[0];
        this.router.navigate([
          `/cocktails-list/${firstCocktail._id}/${firstCocktail.name}`,
        ]);
      }
    });
  }
}
