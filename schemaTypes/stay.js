export default {
  name: 'stay',
  title: 'Stay',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Stay Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      to: [{ type: 'destination' }],
      validation: Rule => Rule.required(),
    },
    {
      name: 'brand',
      title: 'Brand',
      type: 'string',
    },
    {
      name: 'stayType',
      title: 'Stay Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hotel', value: 'hotel' },
          { title: 'Resort', value: 'resort' },
          { title: 'Villa', value: 'villa' },
          { title: 'Private Island', value: 'private_island' },
          { title: 'Chalet', value: 'chalet' },
          { title: 'Camp', value: 'camp' },
          { title: 'Boutique Property', value: 'boutique_property' },
        ],
      },
    },
    {
      name: 'starRating',
      title: 'Star Rating',
      type: 'number',
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
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
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
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'destination.title',
      media: 'heroImage',
    },
  },
}
