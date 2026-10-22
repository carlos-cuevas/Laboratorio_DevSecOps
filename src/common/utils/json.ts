export function keyify(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.keys(obj).reduce((res: string[], el: string) => {
    const value = obj[el];

    if (Array.isArray(value)) {
      return res;
    } else if (typeof value === 'object' && value !== null) {
      return [
        ...res,
        ...keyify(value as Record<string, unknown>, prefix + el + '.'),
      ];
    }

    return [...res, prefix + el];
  }, []);
}

export function getNestedValue(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && (acc as Record<string, unknown>)[key] !== undefined) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
