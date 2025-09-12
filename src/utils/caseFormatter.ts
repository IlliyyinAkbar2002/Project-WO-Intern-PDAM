export const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, "_$1").toLowerCase(), 
        toSnakeCase(value),
      ])
    );
  }
  return obj;
};

export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), 
        toCamelCase(value),
      ])
    );
  }
  return obj;
};
