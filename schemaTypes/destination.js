export default {
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Destination Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
    },
    {
      name: 'destinationType',
      title: 'Destination Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Beach',
          'Mountain',
          'City',
          'Island',
          'Desert',
          'Countryside',
          'Safari',
          'Cultural',
          'Wellness',
          'Adventure',
          'Snow',
        ],
      },
    },
    {
      name: 'bestMonths',
      title: 'Best Months',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'idealTripLength',
      title: 'Ideal Trip Length (Days)',
      type: 'object',
      fields: [
        { name: 'min', title: 'Minimum', type: 'number' },
        { name: 'max', title: 'Maximum', type: 'number' },
      ],
    },
    {
      name: 'budgetBand',
      title: 'Budget Band',
      type: 'string',
      options: {
        list: [
          { title: '$$$', value: '$$$' },
          { title: '$$$$', value: '$$$$' },
          { title: '$$$$$', value: '$$$$$' },
        ],
      },
    },
    {
      name: 'vibeTags',
      title: 'Vibe Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'suitableFor',
      title: 'Suitable For',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Couples',
          'Families',
          'Solo',
          'Groups',
          'Corporate Retreats',
          'Honeymoon',
          'Celebrations',
        ],
      },
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'stays',
      title: 'Recommended Stays',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'stay' }] }],
    },
    {
      name: 'experiences',
      title: 'Recommended Experiences',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'experience' }] }],
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'country',
      media: 'heroImage',
    },
  },
}
