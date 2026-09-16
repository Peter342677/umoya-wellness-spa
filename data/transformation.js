// The "6-Week Total Body Transformation" package - a flagship bundle
// combining Zinzino, THINNR, and 5 T-Shape 2 sessions. Kept separate from
// data/services.js (which drives the auto-generated /services/:slug pages)
// since this has its own dedicated landing page, real advertised pricing,
// and a $100 deposit instead of the site-wide deposit.
module.exports = {
  slug: 'total-body-transformation',
  category: 'Package',
  name: '6-Week Total Body Transformation',
  price: 1495,
  priceFormatted: '$1,495',
  depositAmount: 100,
  depositAmountFormatted: '$100',
  includes: [
    {
      title: 'Zinzino',
      text: 'Starts with a BalanceTest (measuring your Omega-6:3 fatty acid ratio), Gut Health Test, Vitamin D Test, and HbA1c Test. Then BalanceOil+ for immune support, gut health, and targeted restoration, alongside Zinzino weight-management products.',
    },
    {
      title: 'THINNR',
      text: 'A homeopathic weight-management protocol for appetite support and sustainable results.',
    },
    {
      title: 'T-Shape 2 (5 Sessions)',
      text: 'Five Italian-engineered body contouring sessions to sculpt, tone, and accelerate results.',
    },
  ],
  steps: [
    { label: 'Wellness Lab Test', text: 'Know your body. Personalize your plan.' },
    { label: 'Zinzino + THINNR', text: 'Reset, balance, and support healthy metabolism.' },
    { label: 'T-Shape 2', text: 'Sculpt, tone, and accelerate results.' },
  ],
  highlights: ['Lose Up to 25 lbs in 6 Weeks', 'No Muscle Loss', 'Sustainable Long Term', 'Medically Guided'],
  financingNote:
    'Flexible financing available through Affirm, CareCredit, and Sunbit - soft credit pull, everyone considered.',
};
