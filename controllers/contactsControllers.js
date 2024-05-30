import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact as updateContactService,
} from "../services/contactsServices.js";

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

export async function getOneContact(req, res) {
  const contactId = req.params.id;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
}

export async function deleteContact(req, res) {
  const contactId = req.params.id;
  try {
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    }
    return res.status(204).json(deletedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
}

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await addContact(name, email, phone);
  if (newContact) {
    res.status(201).json({
      status: "success",
      code: 201,
      data: { newContact },
    });
  } else {
    res
      .status(400)
      .json({ message: "Invalid data provided. Please check your input." });
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

  const updatedContact = await updateContactService(id, { name, email, phone });

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ message: "Success", updatedContact });
};
