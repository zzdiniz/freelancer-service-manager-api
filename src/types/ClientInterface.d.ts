export default interface ClientInterface {
  id: number;
  name: string;
  username: string;
  conversationState?: ConversationState;
}

type ConversationState =
  | "initial_message"
  | "service_selection"
  | "date_selection"
  | "service_request"
  | "options_available"
  | "pending_review";
