export function enumToOptions<T extends string>( enumObj: Record<string, T>) {
    return Object.values(enumObj).map(value => ({

        label: value
            .toLowerCase()
            .replace('_', ' ')
            .replace(/\b\w/g, l => l.toUpperCase()),

        value

    }));
}