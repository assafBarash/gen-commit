module.exports = [
  {
    prompts: [
      {
        type: 'text',
        name: 'ticket',
        message: 'Enter ticket number',
        format: (ticketNumber) => (ticketNumber ? `#${ticketNumber}` : ''),
      },
      {
        type: 'text',
        name: 'crs',
        message: 'Enter CRs (separated by ,)',
        format: (crs) =>
          crs
            ? `#cr${crs
                .split(',')
                .map((cr) => `@${cr}`)
                .join('')}`
            : '',
      },
    ],
    format: '{{ticket}} {{crs}}',
  },
];
