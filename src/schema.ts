import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Address {
    line1: String
    line2: String
    city: String
    state: String
    postcode: String
  }

  type Customer {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    address: Address
    createdAt: String
  }

  type Query {
    getCustomers: [Customer]
    getAnonymizedCustomers: [Customer]
  }

  type Mutation {
    anonymizeCustomer(id: ID!): Customer
  }
`;
