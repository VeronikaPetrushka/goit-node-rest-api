import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact as updateContactService,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: JSON.parse(contacts),
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const getOneContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await removeContact(contactId);
    if (deletedContact) {
      res.status(204).json();
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

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
