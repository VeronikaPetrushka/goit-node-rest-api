import {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact as updateContactService,
  updateStatusContact,
} from "../services/contactsServices2.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export async function getOneContact(req, res) {
  const id = req.params.id;
  try {
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deleteContact(req, res) {
  const id = req.params.id;
  try {
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }
    return res.status(200).json(deletedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate({ name, email, phone });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newContact = await addContact(name, email, phone);
  if (newContact) {
    res.status(200).json(newContact);
  } else {
    res
      .status(400)
      .json({ message: "Invalid data provided. Please check your input." });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { error } = updateContactSchema.validate({ name, email, phone });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!name && !email && !phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  const updatedContact = await updateContactService(id, { name, email, phone });

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(updatedContact);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== "boolean") {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const updatedContact = await updateStatusContact(id, { favorite });

  if (updatedContact) {
    return res.status(200).json(updatedContact);
  } else {
    return res.status(404).json({ message: "Not found" });
  }
};
