import {Entries} from "../types/entries";

export const handlebarsHelpers = {
    findPrice: (entries: Entries, selectedItem: string) => {
        const found = entries.find(el => el[0] === selectedItem);

        if (!found) {
            throw new Error(`Cannot find price of "${selectedItem}".`);
        }

        const [, price] = found;
        return price;
    },

    pricify: (price: number): string => price.toFixed(2),

    isNotInArray: <T>(array: T[], element: T): boolean => !array.includes(element),

    isInArray: <T>(array: T[], element: T): boolean => array.includes(element),
};

// const {isInArray} = handlebarsHelpers;
//
// console.log(isInArray([1, 2, 3], 2));
// console.log(isInArray(['a', 'b', 'c'], 5));
