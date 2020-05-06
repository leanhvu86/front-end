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
    ingredientArray: string;
    ingredients: any;
    ingredientsGroup: [];
    cockStep: any;
    country: Country[];
    foodType: FoodType[];
    cookWay: CookWay[];
    status: any;
    like: boolean;
    totalPoint: any;
    doneCount: any;
    viewCount: any;
    user: any;
    updateUser: any;
    description: string;
    createAt: any;
    updateAt: any;
    seq: any;
    ord: any;
}
