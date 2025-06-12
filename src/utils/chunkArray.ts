export function chunkArrayWithItemNumber<T extends object>(
  array: T[],
  chunkSize: number
): (T & { itemNumber: number })[][] {
  if (chunkSize <= 0) {
    console.error("chunkSize must be a positive number.");
    return [];
  }

  const result: (T & { itemNumber: number })[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);

    const chunkWithNumbers = chunk.map((item, index) => {
      return {
        ...item,
        itemNumber: i + index,
      };
    });

    result.push(chunkWithNumbers);
  }

  return result;
}

export default chunkArrayWithItemNumber;
