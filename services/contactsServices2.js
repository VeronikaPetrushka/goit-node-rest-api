import Contact from "./schemas/schemas.js";

export const listContacts = async () => {
  return Contact.find();
};

export const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

export const addContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};

export const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

export const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

export const updateStatusContact = (id) => {
  return Contact.findByIdAndUpdate({ _id: id }, favorite, { new: true });
};
