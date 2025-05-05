import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Weather {
    id: ID!
    location: String!
    temperature: Float!
    description: String!
    icon: String!
    date: String!
  }

  type Query {
    getWeather(location: String!): Weather
    getWeatherHistory(location: String, from: String, to: String): [Weather]
  }

  type Mutation {
    fetchWeather(location: String!): Weather
  }
`);

export default schema;