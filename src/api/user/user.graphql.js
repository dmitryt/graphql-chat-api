
/* eslint-disable no-tabs */
const User = `
	type User {
		id: ID!
		username: String!
		firstName: String
		lastName: String
		lastVisit: String
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		getMe: User!
	}

	input NewUser {
		username: String!
		password: String!
		firstName: String
		lastName: String
	}

	input UpdatedUser {
		firstName: String
		lastName: String
	}

	extend type Mutation {
		newUser(input: NewUser!): User
		updatedUser(input: UpdatedUser!): User
	}
`;

module.exports = () => [User];
