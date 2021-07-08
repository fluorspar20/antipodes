const randomColor = (): string => {
  let hex = Math.floor(Math.random() * 0xffffff);
  let color = "#" + hex.toString(16);

  return color;
};

export const getRandomColor = (len: number): string[] => {
  let colors: string[] = [];
  for (let i = 0; i < len; i++) colors.push(randomColor());

  return colors;
};
