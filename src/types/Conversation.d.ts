export default interface Conversation {
  id?: number;
  providerId: number;
  clientId: number;
  conversationState: ConversationState;
}

type ConversationState =
  | "initial_message"
  | "service_selection"
  | "date_selection"
  | "service_request"
  | "options_available"
  | "pending_review";
