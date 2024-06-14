import {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact as updateContactService,
  updateStatusContact,
} from "../services/contacts.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/validation.js";

export const getAllContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;

    const criteria = { owner };
    if (favorite !== undefined) {
      criteria.favorite = favorite === "true";
    }

    const contacts = await listContacts(criteria, { skip, limit });

    res.json(contacts);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export async function getOneContact(req, res) {
  const id = req.params.id;
  const { _id: owner } = req.user;
  try {
    const contact = await getContactById({ id, owner });
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
  const { _id: owner } = req.user;
  try {
    const deletedContact = await removeContact({ id, owner });
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
  const { error } = createContactSchema.validate({ ...req.body });
  const { _id: owner } = req.user;

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newContact = await addContact({ name, email, phone, owner });
    return res.status(200).json(newContact);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid data provided. Please check your input." });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const { error } = updateContactSchema.validate({ ...req.body });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!name && !email && !phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  try {
    const updatedContact = await updateContactService(id, ...req.body, owner, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { _id: owner } = req.user;
  const { error } = updateStatusSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedContact = await updateStatusContact(id, owner, { favorite });

    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
