import { makeObservable, observable } from 'mobx';
import S from '../utilities/Main';

const EMAIL_REGEX = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export default class InputStateHelper {

    keys: string[];
    // parentUpdate: () => void;
    parentChange: (key: string, value: string) => void;

    values: Map < string, string | null >;
    @observable errors: Map < string, boolean >;
    onChanges: Map < string, () => void >;

    constructor(keys: string[], parentChange = null) {
        this.keys = keys;
        // this.parentUpdate = parentUpdate;
        this.parentChange = parentChange;

        this.values = new Map();
        this.errors = new Map();
        this.onChanges = new Map();

        this.keys.forEach((key) => {
            this.values.set(key, S.Strings.EMPTY);
            this.errors.set(key, false);
            this.onChanges.set(key, this.onChange.bind(this, key));
        });

        makeObservable(this);
    }

    setParentCallbacks(parentChange = null) {
        this.parentChange = parentChange;
    }

    onChange(key, value) {
        const cacheErrors = this.errors;
        this.errors = null;

        this.values.set(key, value);
        cacheErrors.set(key, (value === S.Strings.EMPTY || value === null));
        if (this.parentChange !== null) {
            this.parentChange(key, value)
        }

        this.errors = cacheErrors;
        // this.parentUpdate();
    }

    updateValues(values) {
        this.keys.forEach((key, index) => {
            this.values.set(key, values[index]);
        });
    }

    getValues() {
        const cacheErrors = this.errors;
        this.errors = null;

        let valid = true;
        this.values.forEach((value, key) => {
            valid = valid && value !== S.Strings.EMPTY && value !== null;
            cacheErrors.set(key, value === S.Strings.EMPTY || value === null);
        });

        this.errors = cacheErrors;
        if (valid === false) {
            // this.parentUpdate();
            return null;
        }

        return this.values;
    }

    isValid() {
        let valid = true;
        this.errors.forEach((value, key) => {
            valid = valid && !value;
        });
        return valid;
    }

    getValue(key, email: boolean = false) {
        const cacheErrors = this.errors;
        this.errors = null;

        const value = this.values.get(key);
        let valid = value !== S.Strings.EMPTY && value !== null;
        if (email === true) {
            valid = value.match(EMAIL_REGEX) !== null;
        }
        cacheErrors.set(key, !valid);

        this.errors = cacheErrors;
        if (valid === false) {
            // this.parentUpdate();
            return null;
        }

        return value;
    }

}
