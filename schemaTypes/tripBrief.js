export default {
    name: 'tripBrief',
    title: 'Trip Brief',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Brief Title',
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
        name: 'tripType',
        title: 'Trip Type',
        type: 'string',
        options: {
          list: [
            { title: 'Holiday', value: 'holiday' },
            { title: 'Honeymoon', value: 'honeymoon' },
            { title: 'Celebration', value: 'celebration' },
            { title: 'Family Vacation', value: 'family_vacation' },
            { title: 'Wellness Retreat', value: 'wellness_retreat' },
            { title: 'Corporate Leisure', value: 'corporate_leisure' },
          ],
        },
      },
      {
        name: 'originCity',
        title: 'Origin City',
        type: 'string',
      },
      {
        name: 'dateFlexibility',
        title: 'Date Flexibility',
        type: 'string',
        options: {
          list: [
            { title: 'Fixed', value: 'fixed' },
            { title: 'Flexible', value: 'flexible' },
            { title: '+/- 3 Days', value: 'plus_minus_3' },
            { title: '+/- 1 Week', value: 'plus_minus_1_week' },
          ],
        },
      },
      {
        name: 'travelWindow',
        title: 'Travel Window',
        type: 'object',
        fields: [
          { name: 'startDate', title: 'Start Date', type: 'date' },
          { name: 'endDate', title: 'End Date', type: 'date' },
        ],
      },
      {
        name: 'tripLengthDays',
        title: 'Trip Length (Days)',
        type: 'number',
      },
      {
        name: 'travellerCount',
        title: 'Traveller Count',
        type: 'number',
      },
      {
        name: 'occasion',
        title: 'Occasion',
        type: 'string',
      },
      {
        name: 'mustHaveDestinations',
        title: 'Must-Have Destinations',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'destination' }] }, { type: 'string' }],
      },
      {
        name: 'mustHaveExperiences',
        title: 'Must-Have Experiences',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'experience' }] }, { type: 'string' }],
      },
      {
        name: 'mustAvoid',
        title: 'Must Avoid',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'workingSummary',
        title: 'Working Summary',
        type: 'text',
        rows: 5,
      },
      {
        name: 'plannerNotes',
        title: 'Planner Notes',
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
            { title: 'Ready for Recommendation', value: 'ready_for_recommendation' },
            { title: 'Recommendation Sent', value: 'recommendation_sent' },
            { title: 'Itinerary in Progress', value: 'itinerary_in_progress' },
            { title: 'Confirmed', value: 'confirmed' },
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
  