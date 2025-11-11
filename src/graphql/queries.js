/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      portfolioItems {
        nextToken
        __typename
      }
      conversationsAsBiker {
        nextToken
        __typename
      }
      conversationsAsPhotographer {
        nextToken
        __typename
      }
      reviewsGiven {
        nextToken
        __typename
      }
      reviewsReceived {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
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
        owner
        __typename
      }
      nextToken
      __typename
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
      owner
      photographer {
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
        owner
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPortfolios = /* GraphQL */ `
  query ListPortfolios(
    $filter: ModelPortfolioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPortfolios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        photographer_id
        image_key
        title
        description
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      completed_by
      biker {
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
        owner
        __typename
      }
      photographer {
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
        owner
        __typename
      }
      messages {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        biker_id
        photographer_id
        biker_name
        photographer_name
        last_message
        last_message_at
        status
        completed_by
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      conversation {
        id
        biker_id
        photographer_id
        biker_name
        photographer_name
        last_message
        last_message_at
        status
        completed_by
        createdAt
        updatedAt
        __typename
      }
      sender {
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
        owner
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        conversationID
        sender_id
        content
        media_key
        media_type
        is_read
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      reviewer {
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
        owner
        __typename
      }
      reviewee {
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
        owner
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        reviewer_id
        reviewee_id
        conversation_id
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const portfoliosByPhotographer = /* GraphQL */ `
  query PortfoliosByPhotographer(
    $photographer_id: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPortfolioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    portfoliosByPhotographer(
      photographer_id: $photographer_id
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        photographer_id
        image_key
        title
        description
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const conversationsByBiker = /* GraphQL */ `
  query ConversationsByBiker(
    $biker_id: ID!
    $last_message_at: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    conversationsByBiker(
      biker_id: $biker_id
      last_message_at: $last_message_at
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        biker_id
        photographer_id
        biker_name
        photographer_name
        last_message
        last_message_at
        status
        completed_by
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const conversationsByPhotographer = /* GraphQL */ `
  query ConversationsByPhotographer(
    $photographer_id: ID!
    $last_message_at: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    conversationsByPhotographer(
      photographer_id: $photographer_id
      last_message_at: $last_message_at
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        biker_id
        photographer_id
        biker_name
        photographer_name
        last_message
        last_message_at
        status
        completed_by
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesByConversation = /* GraphQL */ `
  query MessagesByConversation(
    $conversationID: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByConversation(
      conversationID: $conversationID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        conversationID
        sender_id
        content
        media_key
        media_type
        is_read
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesBySender_idAndCreatedAt = /* GraphQL */ `
  query MessagesBySender_idAndCreatedAt(
    $sender_id: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesBySender_idAndCreatedAt(
      sender_id: $sender_id
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        conversationID
        sender_id
        content
        media_key
        media_type
        is_read
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByReviewer_idAndCreatedAt = /* GraphQL */ `
  query ReviewsByReviewer_idAndCreatedAt(
    $reviewer_id: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByReviewer_idAndCreatedAt(
      reviewer_id: $reviewer_id
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        reviewer_id
        reviewee_id
        conversation_id
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const reviewsByReviewee = /* GraphQL */ `
  query ReviewsByReviewee(
    $reviewee_id: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    reviewsByReviewee(
      reviewee_id: $reviewee_id
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        reviewer_id
        reviewee_id
        conversation_id
        rating
        comment
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
