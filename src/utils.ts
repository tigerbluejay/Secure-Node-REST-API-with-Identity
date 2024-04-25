
export function isInteger(input:string) {

    // only digits, returns true
    return input?.match(/^\d+$/) ?? false;

}