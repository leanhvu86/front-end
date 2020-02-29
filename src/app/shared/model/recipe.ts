import { Country } from './country';
import { FoodType } from './foodType';
import { CookWay } from './cookWay';

export class Recipe {
    _id: Object;
    imageUrl: string;
    recipeName: string;
    content: string;
    videoLink: string;
    hardLevel: string;
    time: string;
    ingredientArray: string;
    ingredients: [];
    ingredientsGroup: [];
    cockStep: [];
    country: Country[];
    foodType: FoodType[];
    cookWay: CookWay[];
    status: number;
}