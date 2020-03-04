
export class Ingredient {
    _id: Object;
    quantitative: string;
    typeOfquantitative: string;
    ingredientName: string;
    ingredientCode: string;
    note: string;
    status: number;
    constructor(quantitative: string,
        typeOfquntitative: string,
        ingredientName: string,
        note: string) {
        this.quantitative = quantitative;
        this.typeOfquantitative = typeOfquntitative;
        this.ingredientName = ingredientName;
        this.note = note;
    }
}