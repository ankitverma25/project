import Contact from '../models/contact.model.js';

// Create a new contact message
export const createContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

// Get all contact messages (admin only)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
};

// Update contact status and add response (admin only)
export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminResponse } = req.body;
        
        // First find the contact to get user's email
        const existingContact = await Contact.findById(id);
        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        
        const contact = await Contact.findByIdAndUpdate(
            id,
            {
                status,
                adminResponse,
                adminResponseDate: new Date()
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }        // Send email to user about the response
        const emailContent = `
            Dear ${contact.name},

            Thank you for contacting Revivo. Here's our response to your inquiry:

            Your Message: ${contact.message}

            Our Response: ${adminResponse}

            Status: ${status}

            If you have any further questions, please don't hesitate to contact us again.

            Best regards,
            Revivo Team
        `;

        // Send email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contact.email,
            subject: 'Response to Your Contact Request - Revivo',
            text: emailContent
        });

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully and response sent',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating contact',
            error: error.message
        });
    }
};

// Delete contact message (admin only)
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
};
