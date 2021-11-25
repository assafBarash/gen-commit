const crs = ['a', 'b', 'c'].map((v) => ({ title: v, value: v }));

module.exports = async (defSteps) => {
  console.log('@@banana');
  return [
    defSteps,
    {
      format: ({ crs, ticket }) =>
        crs && ticket ? `${ticket} ${crs}` : ticket || crs || '',
      prompts: [
        {
          type: 'text',
          name: 'ticket',
          message: 'Enter ticket number',
          hint: 'numbers will be prefixed with EE-',
          format: (ticketNumber) => {
            if (!ticketNumber) return '';

            return parseInt(ticketNumber)
              ? `#EE-${ticketNumber}`
              : `#${ticketNumber}`;
          },
        },
        {
          type: 'autocompleteMultiselect',
          name: 'crs',
          message: 'Enter CRs (separated by ,)',
          format: (crs) => (crs.length ? `#cr@${crs}` : ''),
          hint: '- Space to select. Return to submit',
          choices: await crs,
        },
      ],
    },
  ];
};
