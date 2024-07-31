import { Ingredients } from './ingredients.interface';

/**  Création de l'interface pour nos cocktails
Comme nous l'avons vu dans la leçon introductive à TypeScript, 
une interface est un modèle permettant de décrire un objet, 
une classe ou une fonction, donc une interface ne s'instancie pas!!!



Elles sont très utiles pour éviter les typos et pour l'autocomplétion. 
Elles permettent également de ne pas se tromper sur les propriétés et 
méthodes requises ou optionnelles.

'avantage des interfaces TypeScript est qu'elles ne sont pas compilées, 
autrement dit elles ne sont pas présentes dans le code JavaScript servi.

Elles ont donc énormément d'avantages pendant le développement, sans 
l'inconvénient d'alourdir le code envoyé aux utilisateurs ! 

Le point d'interrogation permet de rendre certains champs optionnels,
ce qui veut dire que notre interface fonctionnera qu'on precise ce champ
ou non lors de l'utilisation de l'interface.
*/
export interface Cocktail {
  _id?: string;
  name: string;
  img?: string;
  description: string;
  ingredients: Ingredients[];
}
