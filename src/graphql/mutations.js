// GraphQL Mutations

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      nickname
      user_type
      prefecture
      bike_maker
      bike_model
      bio
      profile_image
      genres
      createdAt
      updatedAt
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      nickname
      user_type
      prefecture
      bike_maker
      bike_model
      bio
      profile_image
      genres
      createdAt
      updatedAt
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;

export const createPortfolio = /* GraphQL */ `
  mutation CreatePortfolio($input: CreatePortfolioInput!) {
    createPortfolio(input: $input) {
      id
      photographer_id
      image_key
      title
      description
      createdAt
    }
  }
`;

export const updatePortfolio = /* GraphQL */ `
  mutation UpdatePortfolio($input: UpdatePortfolioInput!) {
    updatePortfolio(input: $input) {
      id
      photographer_id
      image_key
      title
      description
      createdAt
    }
  }
`;

export const deletePortfolio = /* GraphQL */ `
  mutation DeletePortfolio($input: DeletePortfolioInput!) {
    deletePortfolio(input: $input) {
      id
    }
  }
`;

export const createConversation = /* GraphQL */ `
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      biker_id
      photographer_id
      biker_name
      photographer_name
      last_message
      last_message_at
      status
      createdAt
      updatedAt
    }
  }
`;

export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation($input: UpdateConversationInput!) {
    updateConversation(input: $input) {
      id
      biker_id
      photographer_id
      biker_name
      photographer_name
      last_message
      last_message_at
      status
      createdAt
      updatedAt
    }
  }
`;

export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation($input: DeleteConversationInput!) {
    deleteConversation(input: $input) {
      id
    }
  }
`;

export const createMessage = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      conversationID
      sender_id
      content
      media_key
      media_type
      is_read
      createdAt
    }
  }
`;

export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      id
      conversationID
      sender_id
      content
      media_key
      media_type
      is_read
      createdAt
    }
  }
`;

export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage($input: DeleteMessageInput!) {
    deleteMessage(input: $input) {
      id
    }
  }
`;

export const createReview = /* GraphQL */ `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      reviewer_id
      reviewee_id
      conversation_id
      rating
      comment
      createdAt
    }
  }
`;

export const updateReview = /* GraphQL */ `
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
      reviewer_id
      reviewee_id
      conversation_id
      rating
      comment
      createdAt
    }
  }
`;

export const deleteReview = /* GraphQL */ `
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      id
    }
  }
`;

