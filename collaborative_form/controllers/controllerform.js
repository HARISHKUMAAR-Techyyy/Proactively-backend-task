// const formModel = require("../models/formModel");

// exports.renderCreateForm = (req, res) => {
//   res.render("createForm");
// };

// exports.createForm = async (req, res) => {
//   try {
//     const { formName, fields } = req.body;

//     if (!formName || !fields || !Array.isArray(fields)) {
//       return res.status(400).json({ error: "Missing form name or fields." });
//     }

//     const formId = await formModel.createForm(formName);

//     for (const field of fields) {
//       const name = field.name || "";
//       const type = field.type || "text";
//       const options = type === "dropdown" ? field.options || "" : "";
//       await formModel.addField(formId, name, type, options);
//     }

//     console.log("Form created with ID:", formId);
//     res.json({ link: `/form/${formId}` });

//   } catch (error) {
//     console.error("Error creating form:", error);
//     res.status(500).json({ error: "Server error while creating form." });
//   }
// };

// exports.renderForm = async (req, res) => {
//   try {
//     const formId = req.params.id;
//     const form = await formModel.getForm(formId);
//     const fields = await formModel.getFormFields(formId);

//     if (!form) {
//       return res.status(404).send("Form not found");
//     }

//     res.render("form", { form, fields });

//   } catch (error) {
//     console.error("Error rendering form:", error);
//     res.status(500).send("Server error");
//   }
// };


const {
  createForm: createFormModel,
  addField,
  getForm,
  getFormFields,
} = require('../models/modelform');

// Render the "Create Form" page
const renderCreateForm = async (req, res) => {
  try {
    res.render('createForm');
  } catch (error) {
    console.error('Error rendering create form:', error);
    res.status(500).json({ success: false, message: 'Error rendering form' });
  }
};

// Handle form creation (with fields)
const createForm = async (req, res) => {
  try {
    const { formName, fields } = req.body;

    if (!formName || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Form name and at least one field are required',
      });
    }

    // Create form
    const formId = await createFormModel(formName);

    // Add all fields
    for (const field of fields) {
      await addField(formId, field.name, field.type, field.options || '');
    }

    // Respond with success and form link
    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      link: `/form/${formId}`,
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Render a specific form based on ID
const renderForm = async (req, res) => {
  try {
    const formId = req.params.id;

    const form = await getForm(formId);
    const fields = await getFormFields(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    res.render('form', {
      form,
      fields,
    });
  } catch (error) {
    console.error('Error rendering form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  renderCreateForm,
  createForm,
  renderForm,
};
