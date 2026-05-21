export function enumToOptions<T extends string>( enumObj: Record<string, T>) {
    return Object.values(enumObj).map(value => ({

        label: value
            .toLowerCase()
            .replace(/_/g, ' ')
            .split(' ')
            .map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(' '),
        value

    }));
}