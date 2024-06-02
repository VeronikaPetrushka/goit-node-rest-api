import Contact from "./schemas/schemas.js";

export const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const addContact = async ({ name, email, phone }) => {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
};

export const updateContact = async (id, fields) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, fields, {
    new: true,
  });
  return updatedContact;
};

export const removeContact = async (id) => {
  const deletedContact = await Contact.findByIdAndDelete(id);
  return deletedContact;
};

export const updateStatusContact = async (id, favorite) => {
  const updatedStatus = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
  return updatedStatus;
};
