import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'in-progress'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        default: ''
    },
    adminResponseDate: {
        type: Date
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
