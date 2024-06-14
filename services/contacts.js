import Contact from "../schemas/contact.js";

export const listContacts = async (criteria, { skip, limit }) => {
  const contacts = await Contact.find(criteria).skip(skip).limit(limit);
  return contacts;
};

export const getContactById = async ({ id, owner }) => {
  const contact = await Contact.findOne({ _id: id, owner });
  return contact ? contact : null;
};

export const addContact = async ({ name, email, phone, owner }) => {
  const newContact = await Contact.create({ name, email, phone, owner });
  return newContact;
};

export const updateContact = async (id, owner, fields) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    fields,
    { new: true }
  );
  return updatedContact ? updatedContact : null;
};

export const removeContact = async ({ id, owner }) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
  return deletedContact ? deletedContact : null;
};

export const updateStatusContact = async (id, owner, favorite) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    { favorite },
    { new: true }
  );
  return updatedContact ? updatedContact : null;
};
