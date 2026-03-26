export default {
    name: 'clientConstraints',
    title: 'Client Constraints',
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
        name: 'budgetRange',
        title: 'Budget Range',
        type: 'object',
        fields: [
          { name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD' },
          { name: 'min', title: 'Minimum', type: 'number' },
          { name: 'max', title: 'Maximum', type: 'number' },
        ],
      },
      {
        name: 'maxTripLengthDays',
        title: 'Max Trip Length (Days)',
        type: 'number',
      },
      {
        name: 'preferredTravelMonths',
        title: 'Preferred Travel Months',
        type: 'array',
        of: [{ type: 'string' }],
        options: {
          list: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
        },
      },
      {
        name: 'visaLimitations',
        title: 'Visa Limitations',
        type: 'text',
        rows: 3,
      },
      {
        name: 'mobilityConstraints',
        title: 'Mobility Constraints',
        type: 'text',
        rows: 3,
      },
      {
        name: 'dietaryRestrictions',
        title: 'Dietary Restrictions',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'medicalConsiderations',
        title: 'Medical Considerations',
        type: 'text',
        rows: 3,
      },
      {
        name: 'kidsConsiderations',
        title: 'Kids Considerations',
        type: 'text',
        rows: 3,
      },
      {
        name: 'flightTolerance',
        title: 'Flight Tolerance',
        type: 'string',
        options: {
          list: [
            { title: 'Short Haul Only', value: 'short_haul_only' },
            { title: 'Medium Haul OK', value: 'medium_haul_ok' },
            { title: 'Long Haul OK', value: 'long_haul_ok' },
            { title: 'Private Jet Preferred', value: 'private_jet_preferred' },
          ],
        },
      },
      {
        name: 'nonNegotiables',
        title: 'Non-Negotiables',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'internalSummary',
        title: 'Internal Constraints Summary',
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
          title: title || 'Client Constraints',
          subtitle: 'Constraints Profile',
        }
      },
    },
  }
  