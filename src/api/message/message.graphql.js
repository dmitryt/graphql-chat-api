const User = require('../user/user.graphql');

/* eslint-disable no-tabs */
const Message = `
	type Message {
		id: ID!
		content: String!
		statusMessage: Boolean!
		sender: User!
		createdAt: String!
		updatedAt: String!
	}

	input Sender {
		id: ID!
		username: String!
		firstName: String
		lastName: String
	}

	input NewMessage {
		content: String!
		statusMessage: Boolean!
	}

	extend type Mutation {
		newMessage(input: NewMessage!, sender: Sender!): Message
	}
`;

module.exports = () => [Message, User];
