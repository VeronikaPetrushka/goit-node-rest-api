import path from "path";
import { promises as fs } from "fs";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const contactsPath = path.resolve(".", "db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return data.toString();
}

export async function getContactById(id) {
  const data = JSON.parse(await fs.readFile(contactsPath));
  const contact = data.find((c) => c.id === id);
  return contact ? contact : null;
}

export async function removeContact(id) {
  const data = JSON.parse(await fs.readFile(contactsPath));
  const updatedContacts = data.filter((c) => c.id !== id);
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  const deletedContact = data.find((c) => c.id === id);
  return deletedContact ? deletedContact : null;
}

export async function addContact(name, email, phone) {
  const data = JSON.parse(await fs.readFile(contactsPath));
  createContactSchema.validate(data, { abortEarly: false });
  const newContact = { id: Date.now(), name, email, phone };
  data.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return newContact;
}

export async function updateContact(id, data) {
  updateContactSchema.validate(data, { abortEarly: false });
  const contacts = JSON.parse(await fs.readFile(contactsPath));
  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex === -1) {
    throw HttpError(404, "Contact not found");
  }

  const updatedData = { ...data };
  const existingContact = contacts[contactIndex];

  for (const key in updatedData) {
    if (updatedData[key] === undefined) {
      updatedData[key] = existingContact[key];
    }
  }

  contacts[contactIndex] = { ...existingContact, ...updatedData };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[contactIndex];
}
