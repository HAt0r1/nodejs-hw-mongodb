const calculationPaginationData = (totalItems, page, perPage) => {
  const totalPage = Math.ceil(totalItems / perPage);
  const hasNextPage = page !== totalPage;
  const hasPrevPage = page !== 1;

  return {
    page,
    perPage,
    totalItems,
    totalPage,
    hasNextPage,
    hasPrevPage,
  };
};

export default calculationPaginationData;
