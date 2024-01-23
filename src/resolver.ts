import { Db, ObjectId } from 'mongodb';
import { anonymizeCustomer } from './eventListener';

const resolvers = {
  Query: {
    getCustomers: async (_, __, { db }: { db: Db }) => {
      try {
        const customers = await db.collection('customers').find().toArray();
        return customers;
      } catch (error) {
        throw new Error('Failed to fetch customers');
      }
    },
    getAnonymizedCustomers: async (_, __, { db }: { db: Db }) => {
      try {
        const customers = await db
          .collection('customers_anonymised')
          .find()
          .toArray();
        return customers;
      } catch (error) {
        throw new Error('Failed to fetch anonymized customers');
      }
    },
  },
  Mutation: {
    anonymizeCustomer: async (
      _,
      { id }: { id: string },
      { db }: { db: Db },
    ) => {
      try {
        const customer = await db
          .collection('customers')
          .findOne({ _id: new ObjectId(id) });

        if (!customer) {
          throw 'Customer not found';
        }

        const anonymizedCustomer = anonymizeCustomer([customer as any]);

        return { _id: customer._id, ...anonymizedCustomer[0] };
      } catch (error) {
        throw new Error(error || 'Failed to anonymize customer');
      }
    },
  },
};

export default resolvers;
