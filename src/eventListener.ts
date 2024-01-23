export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postcode: string;
  };
}

const anonymizeCustomer = (customers: CustomerData[]) => {
  const anonymizedCustomers = customers.map((customer: CustomerData) => {
    const anonymizedCustomer = {
      firstName: generateRandomString(8),
      lastName: generateRandomString(8),
      email: customer.email.replace(/^(.*@)/, generateRandomString(8) + '@'),
      address: {
        line1: generateRandomString(8),
        line2: generateRandomString(8),
        city: customer.address.city,
        state: customer.address.state,
        postcode: generateRandomString(8),
      },
      createdAt: new Date(),
    };

    return anonymizedCustomer;
  });

  return anonymizedCustomers;
};

const listenToCustomerChanges = (db: any) => {
  const customerCursor = db.collection('customers').watch();

  customerCursor.on('change', async (change: any) => {
    if (
      change.operationType === 'insert' ||
      change.operationType === 'update'
    ) {
      const anonymizedCustomer = anonymizeCustomer([change.fullDocument]);

      await db
        .collection('customers_anonymised')
        .insertMany(anonymizedCustomer);
    }
  });
};

function generateRandomString(length: number): string {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export { listenToCustomerChanges, anonymizeCustomer };
