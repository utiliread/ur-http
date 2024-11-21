export const string = (location: string) => {
  const index = location.lastIndexOf("/");
  return location.substring(index + 1);
};

export const number = (location: string) => Number(string(location));
