export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'form' | 'document_upload' | 'payment_redirect' | 'quote_display' | 'options_selection' | 'confirmation' | 'payment_buttons' | 'receipt' | 'human_agent_handoff';
  title: string;
  description?: string;
  [key: string]: any;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'phone';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  validation?: ValidationRule;
  default_value?: string;
  help_text?: string;
}

export interface ValidationRule {
  pattern?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  min_age?: number;
  max_age?: number;
  custom_message?: string;
}

export interface DataCollection {
  collected: string[];
  missing: string[];
  completion_percentage: number;
  next_required_field?: string;
}

export interface ChatResponse {
  message: string;
  session_id: string;
  current_state: string;
  actions: ChatAction[];
  data_collection: DataCollection;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ChatRequest {
  session_id?: string;
  message: string;
  form_data?: Record<string, any>;
  uploaded_documents?: string[];
  selected_action?: string;
  action_data?: Record<string, any>;
}

export interface SessionInfo {
  session_id: string;
  current_state: string;
  created_at: string;
  updated_at: string;
  customer_data_collected: string[];
  conversation_turns: number;
  selected_variant?: string;
}

export interface QuoteVariant {
  name: string;
  premium: number;
  features: string[];
  sum_assured: number;
  policy_term: number;
  premium_paying_term: number;
  recommended: boolean;
  action: string;
}