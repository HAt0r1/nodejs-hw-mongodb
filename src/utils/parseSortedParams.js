import { sortedParams, keyPairsParams } from '../constans/sortedParams.js';

const sortedOrderParams = (sortedOrder) => {
  const { ASC, DESC } = sortedParams;
  const keySortedParam = [ASC, DESC].includes(sortedOrder);
  if (keySortedParam) return sortedOrder;
  return ASC;
};

const sortedByParams = (sortedBy) => {
  if (keyPairsParams.includes(sortedBy)) return sortedBy;
  return '_id';
};

export const parseSortedParams = ({ sortOrder, sortBy }) => {
  const sortedOrder = sortedOrderParams(sortOrder);
  const sortedBy = sortedByParams(sortBy);
  return {
    sortOrder: sortedOrder,
    sortBy: sortedBy,
  };
};
