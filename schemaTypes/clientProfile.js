export default {
    name: 'clientProfile',
    title: 'Client Profile',
    type: 'document',
    fields: [
      {
        name: 'fullName',
        title: 'Full Name',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'fullName',
          maxLength: 96,
        },
        validation: Rule => Rule.required(),
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
      },
      {
        name: 'phone',
        title: 'Phone',
        type: 'string',
      },
      {
        name: 'nationality',
        title: 'Nationality',
        type: 'string',
      },
      {
        name: 'cityOfResidence',
        title: 'City of Residence',
        type: 'string',
      },
      {
        name: 'clientType',
        title: 'Client Type',
        type: 'string',
        options: {
          list: [
            { title: 'Individual', value: 'individual' },
            { title: 'Couple', value: 'couple' },
            { title: 'Family', value: 'family' },
            { title: 'Group', value: 'group' },
            { title: 'Corporate', value: 'corporate' },
          ],
          layout: 'dropdown',
        },
      },
      {
        name: 'travellerComposition',
        title: 'Traveller Composition',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'traveller',
            fields: [
              { name: 'name', title: 'Name', type: 'string' },
              {
                name: 'type',
                title: 'Type',
                type: 'string',
                options: {
                  list: [
                    { title: 'Adult', value: 'adult' },
                    { title: 'Child', value: 'child' },
                    { title: 'Infant', value: 'infant' },
                  ],
                },
              },
              { name: 'age', title: 'Age', type: 'number' },
            ],
          },
        ],
      },
      {
        name: 'relationshipManagerNotes',
        title: 'Relationship Manager Notes',
        type: 'text',
        rows: 5,
      },
      {
        name: 'preferenceProfile',
        title: 'Preference Profile',
        type: 'reference',
        to: [{ type: 'clientPreferenceProfile' }],
      },
      {
        name: 'constraintsProfile',
        title: 'Constraints Profile',
        type: 'reference',
        to: [{ type: 'clientConstraints' }],
      },
      {
        name: 'travelHistory',
        title: 'Travel History',
        type: 'reference',
        to: [{ type: 'clientTravelHistory' }],
      },
      {
        name: 'wishlist',
        title: 'Wishlist',
        type: 'reference',
        to: [{ type: 'clientWishlist' }],
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        initialValue: 'active',
        options: {
          list: [
            { title: 'Lead', value: 'lead' },
            { title: 'Active', value: 'active' },
            { title: 'Repeat', value: 'repeat' },
            { title: 'Dormant', value: 'dormant' },
          ],
        },
      },
    ],
    preview: {
      select: {
        title: 'fullName',
        subtitle: 'clientType',
      },
      prepare({ title, subtitle }) {
        return {
          title,
          subtitle: subtitle ? `Client Type: ${subtitle}` : 'Client Profile',
        }
      },
    },
  }
  