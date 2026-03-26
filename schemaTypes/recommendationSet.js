export default {
    name: 'recommendationSet',
    title: 'Recommendation Set',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Recommendation Title',
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
        validation: Rule => Rule.required(),
      },
      {
        name: 'recommendedDestinations',
        title: 'Recommended Destinations',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'destination',
                title: 'Destination',
                type: 'reference',
                to: [{ type: 'destination' }],
              },
              {
                name: 'score',
                title: 'Fit Score',
                type: 'number',
              },
              {
                name: 'whyRecommended',
                title: 'Why Recommended',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'recommendedStays',
        title: 'Recommended Stays',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'stay',
                title: 'Stay',
                type: 'reference',
                to: [{ type: 'stay' }],
              },
              {
                name: 'score',
                title: 'Fit Score',
                type: 'number',
              },
              {
                name: 'whyRecommended',
                title: 'Why Recommended',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'recommendedExperiences',
        title: 'Recommended Experiences',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'experience',
                title: 'Experience',
                type: 'reference',
                to: [{ type: 'experience' }],
              },
              {
                name: 'score',
                title: 'Fit Score',
                type: 'number',
              },
              {
                name: 'whyRecommended',
                title: 'Why Recommended',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'recommendationLogicSummary',
        title: 'Recommendation Logic Summary',
        type: 'text',
        rows: 6,
      },
      {
        name: 'internalConfidence',
        title: 'Internal Confidence',
        type: 'string',
        options: {
          list: [
            { title: 'High', value: 'high' },
            { title: 'Medium', value: 'medium' },
            { title: 'Low', value: 'low' },
          ],
        },
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        initialValue: 'draft',
        options: {
          list: [
            { title: 'Draft', value: 'draft' },
            { title: 'Shared Internally', value: 'shared_internally' },
            { title: 'Presented to Client', value: 'presented_to_client' },
            { title: 'Approved', value: 'approved' },
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
  