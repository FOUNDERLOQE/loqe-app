export default {
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Destination Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
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
      options: {
        hotspot: true,
      },
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'budgetBand',
      title: 'Budget Band',
      type: 'string',
      options: {
        list: ['$$$', '$$$$', '$$$$$'],
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