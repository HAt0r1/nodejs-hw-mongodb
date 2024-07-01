import { contactType } from '../constans/dbSchemaParams.js';

const contactTypeParams = (type) => {
  const include = contactType.includes(type);
  if (!include) return;
  return type;
};

const isFavouriteParams = (params) => {
  if (typeof params !== 'string') return;
  const booleanParse = Boolean(params);
  return booleanParse;
};

export const parseFilterParams = ({ isFavourite, contactType }) => {
  const parsedContactType = contactTypeParams(contactType);
  const parsedIsFavourite = isFavouriteParams(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
