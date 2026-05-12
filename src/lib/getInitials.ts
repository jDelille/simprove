export const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase();
  return initials;
};
