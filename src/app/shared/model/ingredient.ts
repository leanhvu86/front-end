
export class Ingredient {
    _id: Object;
    quantitative: string;
    typeOfquntitative: string;
    ingredientName: string;
    ingredientCode: string;
    note: string;
    status: number;
    constructor(quantitative: string,
        typeOfquntitative: string,
        ingredientName: string,
        note: string) {
        this.quantitative = quantitative;
        this.typeOfquntitative = typeOfquntitative;
        this.ingredientName = ingredientName;
        this.note = note;
    }
}