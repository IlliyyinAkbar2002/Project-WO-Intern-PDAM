export const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }

  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc: any, key) => {
      const value = obj[key];
      const snakeKey = key
        .replace(/\.?([A-Z]+)/g, (x, y) => "_" + y.toLowerCase())
        .replace(/^_/, "");

      if (value === undefined) return acc; // ❗ penting untuk Laravel
      acc[snakeKey] = toSnakeCase(value);
      return acc;
    }, {});
  }
  return obj;
};

export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc: any, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());

      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};
