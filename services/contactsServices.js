import path from "path";
import { promises as fs } from "fs";
import HttpError from "../helpers/HttpError.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";

export const contactsPath = path.resolve(".", "db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return data.toString();
  } catch (err) {
    return err.message;
  }
}

export async function getContactById(contactId) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath));
    const contact = data.find((c) => c.id === contactId);
    return contact ? contact : null;
  } catch (err) {
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath));
    const updatedContacts = data.filter((c) => c.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    const deletedContact = data.find((c) => c.id === contactId);
    return deletedContact ? deletedContact : null;
  } catch (err) {
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath));
    const newContact = { id: Date.now(), name, email, phone };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
  } catch (err) {
    return null;
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
  } catch (error) {
    if (error.isJoi) {
      throw HttpError(400, error.details.map((err) => err.message).join(", "));
    } else {
      throw error;
    }
  }
}
