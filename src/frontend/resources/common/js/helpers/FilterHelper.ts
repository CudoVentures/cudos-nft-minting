import Filterable from '../models/Filterable';
import S from '../utilities/Main';

export default class FilterHelper {

    static filter(data: Filterable[], filterString: string): Filterable[] {
        const filterWords = filterString.toLowerCase().split(' ');

        return data.map((filterable) => {
            const filterResult = new FilterResult(filterable, 0);

            if (filterString === S.Strings.EMPTY) {
                filterResult.sort = 1;
            }

            const source = filterable.getFilterableString().toLowerCase().split(' ');
            source.forEach((sourceWord) => {
                filterWords.forEach((filterWord) => {
                    if (sourceWord === filterWord) {
                        filterResult.sort += 2;
                        return;
                    }

                    if (sourceWord.indexOf(filterWord) !== -1) {
                        filterResult.sort += 1;
                    }
                });
            });

            return filterResult;
        }).sort(FilterHelper.cmp).filter((filterResult) => {
            return filterResult.sort !== 0;
        }).map((filterResult) => {
            return filterResult.data;
        });
    }

    static cmp(a: FilterResult, b: FilterResult) {
        return b.sort - a.sort;
    }

}

class FilterResult {

    data: Filterable;
    sort: number;

    constructor(data: Filterable, sort: number) {
        this.data = data;
        this.sort = sort;
    }

}
