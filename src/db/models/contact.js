import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    isFavourite: {
       type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'home', 'work'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactsCollection = model('contact', contactsSchema, 'contacts');

