
const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  let parsedPage;
  let parsedPerPage;

  if (page <= 0) {
    parsedPage = parseNumber('1');
  } else {
    parsedPage = parseNumber(page, 1);
  }

  if (perPage <= 0) {
    parsedPerPage = parseNumber('10');
  } else {
    parsedPerPage = parseNumber(perPage, 10);
  }

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
