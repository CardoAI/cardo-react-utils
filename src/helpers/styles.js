export const initializeStyleAttr = (attr, value) => {
  if (!value)
    return;
   if (typeof value !== "string")
    value = value + "px";

  return `${attr}: ${value};`
};
