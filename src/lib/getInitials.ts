export const getInitials = (name: string) => {
  return name?.trim().charAt(0).toUpperCase() || "";
};