export default {
    name: 'itinerary',
    title: 'Itinerary',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Itinerary Title',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'client',
        title: 'Client',
        type: 'reference',
        to: [{ type: 'clientProfile' }],
        validation: Rule => Rule.required(),
      },
      {
        name: 'tripBrief',
        title: 'Trip Brief',
        type: 'reference',
        to: [{ type: 'tripBrief' }],
      },
      {
        name: 'recommendationSet',
        title: 'Recommendation Set',
        type: 'reference',
        to: [{ type: 'recommendationSet' }],
      },
      {
        name: 'startDate',
        title: 'Start Date',
        type: 'date',
      },
      {
        name: 'endDate',
        title: 'End Date',
        type: 'date',
      },
      {
        name: 'destinations',
        title: 'Destinations',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'destination' }] }],
      },
      {
        name: 'days',
        title: 'Days',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'itineraryDay' }] }],
      },
      {
        name: 'headlineSummary',
        title: 'Headline Summary',
        type: 'text',
        rows: 4,
      },
      {
        name: 'clientFacingNotes',
        title: 'Client Facing Notes',
        type: 'text',
        rows: 5,
      },
      {
        name: 'internalNotes',
        title: 'Internal Notes',
        type: 'text',
        rows: 5,
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        initialValue: 'draft',
        options: {
          list: [
            { title: 'Draft', value: 'draft' },
            { title: 'Client Review', value: 'client_review' },
            { title: 'Revisions', value: 'revisions' },
            { title: 'Confirmed', value: 'confirmed' },
            { title: 'Archived', value: 'archived' },
          ],
        },
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'client.fullName',
      },
    },
  }
  