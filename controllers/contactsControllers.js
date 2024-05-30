import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact as updateContactService,
} from "../services/contactsServices.js";
import {
  updateContactSchema,
  createContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json({
      data: {
        contacts: JSON.parse(contacts),
      },
    });
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
    return res.status(204).json(deletedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    createContactSchema.validate({ name, email, phone }, { abortEarly: false });
    const newContact = await addContact(name, email, phone);
    res.status(201).json({
      data: { newContact },
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  try {
    updateContactSchema.validate({ name, email, phone }, { abortEarly: false });
    const updatedContact = await updateContactService(id, {
      name,
      email,
      phone,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Success", updatedContact });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
