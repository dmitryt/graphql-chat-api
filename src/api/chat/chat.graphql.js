const User = require('../user/user.graphql');
const Message = require('../message/message.graphql');

/* eslint-disable no-tabs */
const Chat = `
	type Chat {
		id: ID!
		title: String!
		description: String
		creator: User!
		members: [User]!
		messages: [Message]!
		createdAt: String!
		updatedAt: String!
	}

	type Query {
		allChats: [Chat]!
		chat(id: ID!): Chat
	}

	input NewChat {
		title: String!
		description: String
		creator: String!
	}

	input UpdatedChat {
		title: String!
		description: String
	}

	type Mutation {
		Chat(id: ID!): Chat
		newChat(input: NewChat!): Chat
		updatedChat(input: UpdatedChat!): Chat
		deletedChat(id: ID!): Boolean
	}
`;

module.exports = () => [Chat, Message, User];
