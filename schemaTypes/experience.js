export default {
    name: 'experience',
    title: 'Experience',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Experience Name',
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
        name: 'experienceType',
        title: 'Experience Type',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
          list: [
            'Adventure',
            'Cultural',
            'Wellness',
            'Food',
            'Nightlife',
            'Nature',
            'Family',
            'Romantic',
            'Water',
            'Wildlife',
            'Luxury Exclusive',
          ],
        },
      },
      {
        name: 'durationType',
        title: 'Duration Type',
        type: 'string',
        options: {
          list: [
            { title: '2-4 Hours', value: '2_4_hours' },
            { title: 'Half Day', value: 'half_day' },
            { title: 'Full Day', value: 'full_day' },
            { title: 'Multi Day', value: 'multi_day' },
          ],
        },
      },
      {
        name: 'intensity',
        title: 'Intensity',
        type: 'string',
        options: {
          list: [
            { title: 'Low', value: 'low' },
            { title: 'Moderate', value: 'moderate' },
            { title: 'High', value: 'high' },
          ],
        },
      },
      {
        name: 'bestFor',
        title: 'Best For',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'kidFriendly',
        title: 'Kid Friendly',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'privateAvailable',
        title: 'Private Available',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'weatherSensitivity',
        title: 'Weather Sensitivity',
        type: 'string',
        options: {
          list: [
            { title: 'Low', value: 'low' },
            { title: 'Medium', value: 'medium' },
            { title: 'High', value: 'high' },
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
  