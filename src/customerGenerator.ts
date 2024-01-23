import { faker } from '@faker-js/faker';

const generateCustomers = async (db: any) => {
  setInterval(async () => {
    const customersBatch = Array.from(
      { length: Math.floor(Math.random() * 10) + 1 },
      () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        address: {
          line1: faker.location.streetAddress(),
          line2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postcode: faker.location.zipCode(),
        },
      }),
    );
		
    await db.collection('customers').insertMany(customersBatch);
  }, 200);
};

export default generateCustomers;
