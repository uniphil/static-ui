export default function expect<T>(el: T | null, msg: string) {
    if (el === null) {
        throw new Error(`Element was null: ${msg}`);
    }
    return el;
}

