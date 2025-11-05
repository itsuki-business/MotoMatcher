// GraphQL Subscriptions

export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
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

export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
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

export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation($filter: ModelSubscriptionConversationFilterInput) {
    onCreateConversation(filter: $filter) {
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

export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation($filter: ModelSubscriptionConversationFilterInput) {
    onUpdateConversation(filter: $filter) {
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
