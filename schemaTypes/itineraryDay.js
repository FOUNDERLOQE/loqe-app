export default {
    name: 'itineraryDay',
    title: 'Itinerary Day',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Day Title',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'dayNumber',
        title: 'Day Number',
        type: 'number',
        validation: Rule => Rule.required(),
      },
      {
        name: 'destination',
        title: 'Destination',
        type: 'reference',
        to: [{ type: 'destination' }],
      },
      {
        name: 'stay',
        title: 'Stay',
        type: 'reference',
        to: [{ type: 'stay' }],
      },
      {
        name: 'experiences',
        title: 'Experiences',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'experience' }] }],
      },
      {
        name: 'morningPlan',
        title: 'Morning Plan',
        type: 'text',
        rows: 3,
      },
      {
        name: 'afternoonPlan',
        title: 'Afternoon Plan',
        type: 'text',
        rows: 3,
      },
      {
        name: 'eveningPlan',
        title: 'Evening Plan',
        type: 'text',
        rows: 3,
      },
      {
        name: 'logisticsNotes',
        title: 'Logistics Notes',
        type: 'text',
        rows: 3,
      },
      {
        name: 'diningNotes',
        title: 'Dining Notes',
        type: 'text',
        rows: 3,
      },
      {
        name: 'daySummary',
        title: 'Day Summary',
        type: 'text',
        rows: 4,
      },
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'dayNumber',
      },
      prepare({ title, subtitle }) {
        return {
          title,
          subtitle: subtitle ? `Day ${subtitle}` : 'Itinerary Day',
        }
      },
    },
  }
  