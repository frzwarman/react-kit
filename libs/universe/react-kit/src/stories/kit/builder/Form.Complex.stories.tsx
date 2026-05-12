import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from '../../../kit/builder/form/components/FormBuilder';
import type { FormBuilderSectionConfig } from '../../../kit/builder/form/components/FormBuilder';
import {
  createSection,
  createField,
  commonValidations,
  createDependency,
  conditions,
  validators,
} from '../../../kit/builder/form/utils';

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof FormBuilder>;

export const ComplexExample: Story = {
  name: 'Complex example',
  render: () => {
    const handleSubmit = (data: unknown) => {
      console.log('Complex form submitted:', data);
    };

    const handleFieldChange = (
      name: string,
      value: unknown,
      allValues: Record<string, unknown>,
    ) => {
      console.log(`Field ${name} changed to:`, value);
      console.log('All form values:', allValues);
    };

    const sections = [
      createSection.card('Personal Information', [
        createField.text('firstName', 'First Name', {
          required: true,
          placeholder: 'Enter first name',
        }),
        createField.text('lastName', 'Last Name', {
          required: true,
          placeholder: 'Enter last name',
        }),
        createField.email('email', 'Email Address', {
          required: true,
          placeholder: 'Enter email address',
        }),
        createField.date('dateOfBirth', 'Date of Birth', { required: true }),
        createField.select(
          'gender',
          'Gender',
          [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
            { label: 'Prefer not to say', value: 'not_specified' },
          ],
          { placeholder: 'Select gender' },
        ),
      ]),

      createSection.card('Address Information', [
        createField.object(
          'address',
          'Primary Address',
          [
            createField.text('street', 'Street Address', {
              required: true,
              placeholder: '123 Main St',
              gridCols: 2,
            }),
            createField.text('city', 'City', {
              required: true,
              placeholder: 'New York',
            }),
            createField.text('state', 'State/Province', {
              required: true,
              placeholder: 'NY',
            }),
            createField.text('postalCode', 'Postal Code', {
              required: true,
              placeholder: '10001',
            }),
            createField.select(
              'country',
              'Country',
              [
                { label: 'United States', value: 'US' },
                { label: 'Canada', value: 'CA' },
                { label: 'United Kingdom', value: 'UK' },
                { label: 'Australia', value: 'AU' },
              ],
              { required: true, defaultValue: 'US' },
            ),
          ],
          { gridCols: 2 },
        ),

        createField.checkbox(
          'sameAsShipping',
          'Billing address same as shipping',
          { defaultValue: true, gridCols: 2 },
        ),

        createField.object(
          'billingAddress',
          'Billing Address',
          [
            createField.text('street', 'Street Address', {
              required: true,
              placeholder: '123 Main St',
              gridCols: 2,
            }),
            createField.text('city', 'City', {
              required: true,
              placeholder: 'New York',
            }),
            createField.text('state', 'State/Province', {
              required: true,
              placeholder: 'NY',
            }),
            createField.text('postalCode', 'Postal Code', {
              required: true,
              placeholder: '10001',
            }),
            createField.select(
              'country',
              'Country',
              [
                { label: 'United States', value: 'US' },
                { label: 'Canada', value: 'CA' },
                { label: 'United Kingdom', value: 'UK' },
                { label: 'Australia', value: 'AU' },
              ],
              { required: true, defaultValue: 'US' },
            ),
          ],
          {
            gridCols: 2,
            dependencies: [
              createDependency.showWhen('sameAsShipping', conditions.isFalse()),
            ],
          },
        ),
      ]),

      createSection.card('Employment Information', [
        createField.select(
          'employmentStatus',
          'Employment Status',
          [
            { label: 'Employed', value: 'employed' },
            { label: 'Self-employed', value: 'self_employed' },
            { label: 'Unemployed', value: 'unemployed' },
            { label: 'Student', value: 'student' },
            { label: 'Retired', value: 'retired' },
          ],
          { required: true, placeholder: 'Select employment status' },
        ),

        createField.text('company', 'Company Name', {
          required: true,
          placeholder: 'Enter company name',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('employed'),
            ),
          ],
        }),

        createField.text('jobTitle', 'Job Title', {
          required: true,
          placeholder: 'Enter job title',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('employed'),
            ),
          ],
        }),

        createField.text('businessName', 'Business Name', {
          required: true,
          placeholder: 'Enter business name',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('self_employed'),
            ),
          ],
        }),

        createField.text('businessType', 'Type of Business', {
          placeholder: 'e.g., Consulting, Retail, etc.',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('self_employed'),
            ),
          ],
        }),

        createField.text('school', 'School/University', {
          required: true,
          placeholder: 'Enter school name',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('student'),
            ),
          ],
        }),

        createField.text('major', 'Major/Field of Study', {
          placeholder: 'Enter your major',
          dependencies: [
            createDependency.showWhen(
              'employmentStatus',
              conditions.equals('student'),
            ),
          ],
        }),

        createField.number('annualIncome', 'Annual Income', {
          placeholder: '50000',
          validation: validators.minItems(0, 'Income must be positive'),
          dependencies: [
            createDependency.showWhen('employmentStatus', (value) =>
              ['employed', 'self_employed'].includes(value),
            ),
          ],
        }),
      ]),

      createSection.card('Skills & Experience', [
        createField.array(
          'skills',
          'Skills',
          [
            createField.text('name', 'Skill Name', {
              required: true,
              placeholder: 'e.g., JavaScript, Project Management',
            }),
            createField.select(
              'level',
              'Proficiency Level',
              [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Expert', value: 'expert' },
              ],
              { required: true, placeholder: 'Select level' },
            ),
            createField.number('yearsOfExperience', 'Years of Experience', {
              placeholder: '2',
              validation: validators.minItems(0, 'Years must be positive'),
            }),
          ],
          {
            gridCols: 2,
            defaultValue: [{ name: '', level: '', yearsOfExperience: 0 }],
          },
        ),
      ]),

      createSection.card('Professional References', [
        createField.checkbox(
          'hasReferences',
          'I have professional references',
          { defaultValue: false, gridCols: 2 },
        ),
        createField.array(
          'references',
          'References',
          [
            createField.text('name', 'Full Name', {
              required: true,
              placeholder: 'John Doe',
            }),
            createField.text('title', 'Job Title', {
              required: true,
              placeholder: 'Senior Manager',
            }),
            createField.text('company', 'Company', {
              required: true,
              placeholder: 'ABC Corporation',
            }),
            createField.email('email', 'Email', {
              required: true,
              placeholder: 'john.doe@company.com',
            }),
            createField.text('phone', 'Phone', {
              validation: commonValidations.phone,
              placeholder: '+1 (555) 123-4567',
            }),
            createField.select(
              'relationship',
              'Relationship',
              [
                { label: 'Direct Supervisor', value: 'supervisor' },
                { label: 'Colleague', value: 'colleague' },
                { label: 'Client', value: 'client' },
                { label: 'Other', value: 'other' },
              ],
              { required: true, placeholder: 'Select relationship' },
            ),
          ],
          {
            gridCols: 2,
            defaultValue: [],
            dependencies: [
              createDependency.showWhen('hasReferences', conditions.isTrue()),
            ],
          },
        ),
      ]),

      createSection.card('Additional Information', [
        createField.textarea('additionalInfo', 'Additional Comments', {
          placeholder: "Any additional information you'd like to share...",
          gridCols: 2,
        }),
        createField.checkbox(
          'agreeToTerms',
          'I agree to the terms and conditions',
          { required: true, gridCols: 2 },
        ),
        createField.checkbox(
          'allowMarketing',
          'I agree to receive marketing communications',
          { defaultValue: false, gridCols: 2 },
        ),
      ]),
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Professional Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your professional profile with detailed information. This
            form demonstrates complex nested structures and field dependencies.
          </p>
        </div>

        <FormBuilder
          sections={sections}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
          className="space-y-8"
        />
      </div>
    );
  },
};

export const ComplexTabsExample: Story = {
  name: 'Complex example (Tabs)',
  render: () => {
    const handleSubmit = (data: unknown) => {
      console.log('Complex tabs form submitted:', data);
    };

    const handleFieldChange = (
      name: string,
      value: unknown,
      allValues: Record<string, unknown>,
    ) => {
      console.log(`[Tabs] Field ${name} changed to:`, value);
      console.log('[Tabs] All form values:', allValues);
    };

    const sections: FormBuilderSectionConfig[] = [
      {
        title: 'Profile Builder',
        layout: 'tabs',
        variant: 'card',
        defaultTabId: 'basic',
        tabsListClassName: 'w-full',
        tabsContentClassName: 'mt-2',
        tabs: [
          {
            id: 'basic',
            label: 'Basic Info',
            sections: [
              createSection.card(
                'Basic Information',
                [
                  createField.text('firstName', 'First Name', {
                    required: true,
                  }),
                  createField.text('lastName', 'Last Name', { required: true }),
                  createField.email('email', 'Email Address', {
                    required: true,
                  }),
                  createField.date('dateOfBirth', 'Date of Birth', {
                    required: true,
                  }),
                ],
                { grid: { cols: 1, mdCols: 2, gap: 'gap-4' } },
              ),
            ],
          },
          {
            id: 'address',
            label: 'Addresses',
            sections: [
              createSection.card('Address Information', [
                createField.object(
                  'address',
                  'Primary Address',
                  [
                    createField.text('street', 'Street Address', {
                      required: true,
                      gridCols: 2,
                    }),
                    createField.text('city', 'City', { required: true }),
                    createField.text('state', 'State/Province', {
                      required: true,
                    }),
                    createField.text('postalCode', 'Postal Code', {
                      required: true,
                    }),
                    createField.select(
                      'country',
                      'Country',
                      [
                        { label: 'United States', value: 'US' },
                        { label: 'Canada', value: 'CA' },
                        { label: 'United Kingdom', value: 'UK' },
                        { label: 'Australia', value: 'AU' },
                      ],
                      { required: true, defaultValue: 'US' },
                    ),
                  ],
                  { gridCols: 2 },
                ),
                createField.checkbox(
                  'sameAsShipping',
                  'Billing same as shipping',
                  { defaultValue: true, gridCols: 2 },
                ),
                createField.object(
                  'billingAddress',
                  'Billing Address',
                  [
                    createField.text('street', 'Street Address', {
                      required: true,
                      gridCols: 2,
                    }),
                    createField.text('city', 'City', { required: true }),
                    createField.text('state', 'State/Province', {
                      required: true,
                    }),
                    createField.text('postalCode', 'Postal Code', {
                      required: true,
                    }),
                    createField.select(
                      'country',
                      'Country',
                      [
                        { label: 'United States', value: 'US' },
                        { label: 'Canada', value: 'CA' },
                        { label: 'United Kingdom', value: 'UK' },
                        { label: 'Australia', value: 'AU' },
                      ],
                      { required: true, defaultValue: 'US' },
                    ),
                  ],
                  {
                    gridCols: 2,
                    dependencies: [
                      createDependency.showWhen(
                        'sameAsShipping',
                        conditions.isFalse(),
                      ),
                    ],
                  },
                ),
              ]),
            ],
          },
          {
            id: 'employment',
            label: 'Employment',
            sections: [
              createSection.card('Employment Information', [
                createField.select(
                  'employmentStatus',
                  'Employment Status',
                  [
                    { label: 'Employed', value: 'employed' },
                    { label: 'Self-employed', value: 'self_employed' },
                    { label: 'Unemployed', value: 'unemployed' },
                    { label: 'Student', value: 'student' },
                  ],
                  { required: true },
                ),
                createField.text('company', 'Company Name', {
                  dependencies: [
                    createDependency.showWhen(
                      'employmentStatus',
                      conditions.equals('employed'),
                    ),
                  ],
                }),
                createField.text('jobTitle', 'Job Title', {
                  dependencies: [
                    createDependency.showWhen(
                      'employmentStatus',
                      conditions.equals('employed'),
                    ),
                  ],
                }),
                createField.text('businessName', 'Business Name', {
                  dependencies: [
                    createDependency.showWhen(
                      'employmentStatus',
                      conditions.equals('self_employed'),
                    ),
                  ],
                }),
                createField.text('school', 'School/University', {
                  dependencies: [
                    createDependency.showWhen(
                      'employmentStatus',
                      conditions.equals('student'),
                    ),
                  ],
                }),
              ]),
            ],
          },
        ],
      },
    ];

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Professional Profile (Tabs)
          </h1>
          <p className="text-gray-600 mt-2">
            This story shows how to organize complex forms into tabs.
          </p>
        </div>
        <FormBuilder
          sections={sections}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
          className="space-y-8"
        />
      </div>
    );
  },
};
