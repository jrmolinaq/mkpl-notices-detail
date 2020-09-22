import { Validators } from '@angular/forms';

export const FIELDS = [
  {
    name: 'manualPurchase',
    fields: [
      {
        name: 'provider',
        validators: [
          Validators.required
        ]
      },
      {
        name: 'subsidiary',
        validators: [
          Validators.required
        ]
      },
      {
        name: 'price',
        validators: [
          Validators.required,
          Validators.pattern(new RegExp(/^\d*$/))
        ]
      },
      {
        name: 'social',
        validators: [
          Validators.required
        ]
      },
      {
        name: 'nit',
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]{7,10}-[0-9]{1}')
        ]
      },
      {
        name: 'reference',
        validators: [
          Validators.required
        ]
      },
      {
        name: 'comment',
        validators: [
          Validators.maxLength(100)
        ]
      }
    ]
  }
];