export function sortByIDList<T extends { id: number }>(list: T[], idList: number[]): T[] {
  const idToIndex = Object.fromEntries(idList.map((item, index) => [item, index]));

  return list.sort((a, b) => idToIndex[a.id] - idToIndex[b.id]);
}

export function getListHash<T>(list: T[]) {
  return list.map((item) => JSON.stringify(item)).join('');
}
