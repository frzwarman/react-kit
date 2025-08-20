import { FormBuilderSectionConfig } from '../components/FormBuilder';
import { createField } from './field-factories';
import { createSection } from './section-factories';
import { commonValidations } from './validations';

// Pre-built common form configurations
export const commonForms = {
  // User registration form
  userRegistration: (): FormBuilderSectionConfig[] => [
    createSection.card('Personal Information', [
      createField.text('firstName', 'First Name', { required: true }),
      createField.text('lastName', 'Last Name', { required: true }),
      createField.email('email', 'Email Address', { required: true }),
      createField.password('password', 'Password', { required: true }),
      createField.password('confirmPassword', 'Confirm Password', {
        required: true,
      }),
    ]),
    createSection.card('Additional Information', [
      createField.text('phone', 'Phone Number', {
        validation: commonValidations.phone,
      }),
      createField.date('dateOfBirth', 'Date of Birth'),
      createField.checkbox(
        'agreeToTerms',
        'I agree to the terms and conditions',
        { required: true },
      ),
    ]),
  ],

  // Contact form
  contact: (): FormBuilderSectionConfig[] => [
    createSection.plain([
      createField.text('name', 'Full Name', { required: true }),
      createField.email('email', 'Email Address', { required: true }),
      createField.text('subject', 'Subject', { required: true }),
      createField.textarea('message', 'Message', {
        required: true,
        gridCols: 2,
      }),
    ]),
  ],

  // Address form
  address: (): FormBuilderSectionConfig[] => [
    createSection.card('Address Information', [
      createField.text('street', 'Street Address', {
        required: true,
        gridCols: 2,
      }),
      createField.text('city', 'City', { required: true }),
      createField.text('state', 'State/Province', { required: true }),
      createField.text('postalCode', 'Postal Code', { required: true }),
      createField.select(
        'country',
        'Country',
        [
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'United Kingdom', value: 'UK' },
          // Add more countries as needed
        ],
        { required: true },
      ),
    ]),
  ],
};
