export default {
    name: 'clientWishlist',
    title: 'Client Wishlist',
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
        name: 'dreamDestinations',
        title: 'Dream Destinations',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'destination' }] }, { type: 'string' }],
      },
      {
        name: 'dreamStays',
        title: 'Dream Stays',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'stay' }] }, { type: 'string' }],
      },
      {
        name: 'bucketListExperiences',
        title: 'Bucket List Experiences',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'experience' }] }, { type: 'string' }],
      },
      {
        name: 'occasionDrivenWishes',
        title: 'Occasion-Driven Wishes',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'wishlistSummary',
        title: 'Wishlist Summary',
        type: 'text',
        rows: 4,
      },
    ],
    preview: {
      select: {
        title: 'client.fullName',
      },
      prepare({ title }) {
        return {
          title: title || 'Client Wishlist',
          subtitle: 'Wishlist',
        }
      },
    },
  }
  