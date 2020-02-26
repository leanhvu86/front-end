import { Country } from './country';
import { FoodType } from './foodType';
import { CookWay } from './cookWay';

export class Recipe {
    _id: string;
    imageUrl: string;
    recipeName: string;
    content: string;
    videoLink: string;
    hardLevel: string;
    time: string;
    ingredients: [];
    ingredientsGroup: [];
    cockStep: [];
    country: Country[];
    foodType: FoodType[];
    cookWay: CookWay[];
    status: number;
}