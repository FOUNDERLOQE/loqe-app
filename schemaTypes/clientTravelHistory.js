export default {
    name: 'clientTravelHistory',
    title: 'Client Travel History',
    type: 'document',
    fields: [
      {
        name: 'client',
        title: 'Client',
        type: 'reference',
        to: [{ type: 'clientProfile' }],
        validation: Rule => Rule.required(),
      },
      {
        name: 'visitedDestinations',
        title: 'Visited Destinations',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'destinationName', title: 'Destination Name', type: 'string' },
              { name: 'year', title: 'Year', type: 'number' },
              { name: 'liked', title: 'Liked?', type: 'boolean' },
              { name: 'notes', title: 'Notes', type: 'text' },
            ],
          },
        ],
      },
      {
        name: 'favoriteTrips',
        title: 'Favorite Trips',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'dislikedTrips',
        title: 'Disliked Trips',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'luxuryExposureLevel',
        title: 'Luxury Exposure Level',
        type: 'string',
        options: {
          list: [
            { title: 'Emerging Luxury Traveler', value: 'emerging' },
            { title: 'Experienced Luxury Traveler', value: 'experienced' },
            { title: 'Ultra Luxury Traveler', value: 'ultra_luxury' },
          ],
        },
      },
      {
        name: 'repeatDestinations',
        title: 'Repeat Destinations',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'historySummary',
        title: 'Travel History Summary',
        type: 'text',
        rows: 4,
      },
    ],
    preview: {
      select: {
        title: 'client.fullName',
        subtitle: 'luxuryExposureLevel',
      },
      prepare({ title, subtitle }) {
        return {
          title: title || 'Travel History',
          subtitle: subtitle || 'Client Travel History',
        }
      },
    },
  }
  