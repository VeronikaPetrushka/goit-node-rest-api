import Contact from "../schemas/contact.js";

export const listContacts = async (criteria, { skip, limit }) => {
  const contacts = await Contact.find(criteria).skip(skip).limit(limit);
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact ? contact : null;
};

export const addContact = async ({ name, email, phone, owner }) => {
  const newContact = await Contact.create({ name, email, phone, owner });
  return newContact;
};

export const updateContact = async (id, fields) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, fields, {
    new: true,
  });
  return updatedContact ? updatedContact : null;
};

export const removeContact = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact ? deletedContact : null;
};

export const updateStatusContact = async (id, favorite) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, favorite, {
    new: true,
  });
  return updatedContact ? updatedContact : null;
};
