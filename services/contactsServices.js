import path from "path";
import { promises as fs } from "fs";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const contactsPath = path.resolve(".", "db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return data.toString();
  } catch (err) {
    throw new HttpError(500, "Internal Server Error");
  }
}

export async function getContactById(id) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath));
    const contact = data.find((c) => c.id === id);
    return contact ? contact : null;
  } catch (err) {
    throw new HttpError(500, "Internal Server Error");
  }
}

export async function removeContact(id) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath));
    const updatedContacts = data.filter((c) => c.id !== id);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    const deletedContact = data.find((c) => c.id === id);
    return deletedContact ? deletedContact : null;
  } catch (err) {
    throw new HttpError(500, "Internal Server Error");
  }
}

export async function addContact(name, email, phone) {
  try {
    createContactSchema.validate(data, { abortEarly: false });
    const data = JSON.parse(await fs.readFile(contactsPath));
    const newContact = { id: Date.now(), name, email, phone };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
  } catch (err) {
    throw new HttpError(500, "Internal Server Error");
  }
}

export async function updateContact(contactId, data) {
  try {
    updateContactSchema.validate(data, { abortEarly: false });
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactIndex === -1) {
      throw new HttpError(404, "Contact not found");
    }

    contacts[contactIndex] = { ...contacts[contactIndex], ...data };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[contactIndex];
  } catch (error) {
    if (error.isJoi) {
      throw new HttpError(
        400,
        error.details.map((err) => err.message).join(", ")
      );
    } else {
      throw error;
    }
  }
}
