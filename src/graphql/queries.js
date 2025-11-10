// GraphQL Queries

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
      instagram_url
      twitter_url
      website_url
      minimum_rate
      rate_details
      createdAt
      updatedAt
    }
  }
`;

export const listUsers = /* GraphQL */ `
  query ListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        instagram_url
        twitter_url
        website_url
        minimum_rate
        rate_details
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listPhotographers = /* GraphQL */ `
  query ListPhotographers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        nickname
        user_type
        prefecture
        bio
        profile_image
        genres
        instagram_url
        twitter_url
        website_url
        minimum_rate
        rate_details
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getPortfolio = /* GraphQL */ `
  query GetPortfolio($id: ID!) {
    getPortfolio(id: $id) {
      id
      photographer_id
      image_key
      title
      description
      createdAt
    }
  }
`;

export const portfoliosByPhotographer = /* GraphQL */ `
  query PortfoliosByPhotographer($photographer_id: ID!, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
    portfoliosByPhotographer(photographer_id: $photographer_id, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
      items {
        id
        photographer_id
        image_key
        title
        description
        createdAt
      }
      nextToken
    }
  }
`;

export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
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

export const conversationsByBiker = /* GraphQL */ `
  query ConversationsByBiker($biker_id: ID!, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
    conversationsByBiker(biker_id: $biker_id, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const conversationsByPhotographer = /* GraphQL */ `
  query ConversationsByPhotographer($photographer_id: ID!, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
    conversationsByPhotographer(photographer_id: $photographer_id, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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

export const messagesByConversation = /* GraphQL */ `
  query MessagesByConversation($conversationID: ID!, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
    messagesByConversation(conversationID: $conversationID, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
      items {
        id
        conversationID
        sender_id
        content
        media_key
        media_type
        is_read
        createdAt
      }
      nextToken
    }
  }
`;

export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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

export const reviewsByReviewee = /* GraphQL */ `
  query ReviewsByReviewee($reviewee_id: ID!, $sortDirection: ModelSortDirection, $limit: Int, $nextToken: String) {
    reviewsByReviewee(reviewee_id: $reviewee_id, sortDirection: $sortDirection, limit: $limit, nextToken: $nextToken) {
      items {
        id
        reviewer_id
        reviewee_id
        conversation_id
        rating
        comment
        createdAt
      }
      nextToken
    }
  }
`;

