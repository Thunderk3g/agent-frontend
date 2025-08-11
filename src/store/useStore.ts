import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface PersonalDetails {
  fullName?: string;
  dateOfBirth?: string;
  age?: string;
  gender?: string;
  mobileNumber?: string;
  email?: string;
  pinCode?: string;
  annualIncome?: string;
  tobaccoUser?: boolean;
}

interface QuoteDetails {
  sumAssured?: string;
  policyTerm_years?: string;
  premiumPayingTerm_years?: string;
  frequency?: string;
  selectedVariant?: string;
}

interface RiderSelection {
  id: string;
  name: string;
  uin: string;
  premium: number;
  selected: boolean;
}

interface PaymentDetails {
  paymentMethod?: string;
  status?: 'pending' | 'processing' | 'success' | 'failed';
  paymentId?: string;
  transactionId?: string;
  policyNumber?: string;
}

interface FormCompletion {
  personal_details: {
    completed: boolean;
    completion_percentage: number;
  };
  insurance_requirements: {
    completed: boolean;
    completion_percentage: number;
  };
  rider_selection: {
    completed: boolean;
    completion_percentage: number;
  };
  payment_details: {
    completed: boolean;
    completion_percentage: number;
  };
}

interface StoreState {
  // Session management
  sessionId?: string;
  sessionState: string;
  
  // Form data
  personalDetails: PersonalDetails;
  quoteDetails: QuoteDetails;
  riderSelections?: RiderSelection[];
  paymentDetails: PaymentDetails;
  
  // Form completion tracking
  formCompletion: FormCompletion;
  
  // Chat state
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
  }>;
  
  // UI state
  currentStep: number;
  isLoading: boolean;
  
  // Actions
  setSessionId: (id: string) => void;
  setSessionState: (state: string) => void;
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  updateQuoteDetails: (details: Partial<QuoteDetails>) => void;
  updateRiderSelections: (riders: RiderSelection[]) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
  updateFormCompletion: (formType: keyof FormCompletion, data: Partial<FormCompletion[keyof FormCompletion]>) => void;
  addMessage: (content: string, sender: 'user' | 'agent') => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  clearSession: () => void;
  syncWithBackend: () => Promise<void>;
  loadFromBackend: (sessionId: string) => Promise<void>;
}

const initialFormCompletion: FormCompletion = {
  personal_details: { completed: false, completion_percentage: 0 },
  insurance_requirements: { completed: false, completion_percentage: 0 },
  rider_selection: { completed: false, completion_percentage: 0 },
  payment_details: { completed: false, completion_percentage: 0 }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: undefined,
      sessionState: 'onboarding',
      personalDetails: {},
      quoteDetails: {},
      riderSelections: [],
      paymentDetails: {},
      formCompletion: initialFormCompletion,
      messages: [],
      currentStep: 0,
      isLoading: false,

      // Actions
      setSessionId: (id: string) => set({ sessionId: id }),
      
      setSessionState: (state: string) => {
        set({ sessionState: state });
        
        // Auto-update current step based on session state
        const stateToStepMap: Record<string, number> = {
          'onboarding': 0,
          'eligibility_check': 0,
          'product_selection': 1,
          'quote_generation': 1,
          'addon_riders': 2,
          'payment_initiated': 3,
          'document_collection': 4,
          'policy_issued': 4
        };
        
        const targetStep = stateToStepMap[state] || 0;
        set({ currentStep: targetStep });
      },

      updatePersonalDetails: (details: Partial<PersonalDetails>) => {
        const currentDetails = get().personalDetails;
        const updatedDetails = { ...currentDetails, ...details };
        
        // Calculate completion percentage
        const requiredFields = ['fullName', 'dateOfBirth', 'age', 'gender', 'mobileNumber', 'email', 'pinCode', 'annualIncome'];
        const completedFields = requiredFields.filter(field => {
          const value = updatedDetails[field as keyof PersonalDetails];
          return value !== undefined && value !== null && value !== '';
        });
        
        const completionPercentage = (completedFields.length / requiredFields.length) * 100;
        const isCompleted = completionPercentage >= 80;
        
        set({
          personalDetails: updatedDetails,
          formCompletion: {
            ...get().formCompletion,
            personal_details: {
              completed: isCompleted,
              completion_percentage: Math.round(completionPercentage)
            }
          }
        });
      },

      updateQuoteDetails: (details: Partial<QuoteDetails>) => {
        const currentDetails = get().quoteDetails;
        const updatedDetails = { ...currentDetails, ...details };
        
        // Calculate completion percentage
        const requiredFields = ['sumAssured', 'policyTerm_years', 'premiumPayingTerm_years', 'frequency', 'selectedVariant'];
        const completedFields = requiredFields.filter(field => {
          const value = updatedDetails[field as keyof QuoteDetails];
          return value !== undefined && value !== null && value !== '';
        });
        
        const completionPercentage = (completedFields.length / requiredFields.length) * 100;
        const isCompleted = completionPercentage >= 80;
        
        set({
          quoteDetails: updatedDetails,
          formCompletion: {
            ...get().formCompletion,
            insurance_requirements: {
              completed: isCompleted,
              completion_percentage: Math.round(completionPercentage)
            }
          }
        });
      },

      updateRiderSelections: (riders: RiderSelection[]) => {
        set({
          riderSelections: riders,
          formCompletion: {
            ...get().formCompletion,
            rider_selection: {
              completed: true, // Rider selection is always considered complete (can be empty)
              completion_percentage: 100
            }
          }
        });
      },

      updatePaymentDetails: (details: Partial<PaymentDetails>) => {
        const currentDetails = get().paymentDetails;
        const updatedDetails = { ...currentDetails, ...details };
        
        const isCompleted = updatedDetails.status === 'success' && !!updatedDetails.paymentId;
        
        set({
          paymentDetails: updatedDetails,
          formCompletion: {
            ...get().formCompletion,
            payment_details: {
              completed: isCompleted,
              completion_percentage: isCompleted ? 100 : (updatedDetails.paymentMethod ? 50 : 0)
            }
          }
        });
      },

      updateFormCompletion: (formType: keyof FormCompletion, data: Partial<FormCompletion[keyof FormCompletion]>) => {
        set({
          formCompletion: {
            ...get().formCompletion,
            [formType]: { ...get().formCompletion[formType], ...data }
          }
        });
      },

      addMessage: (content: string, sender: 'user' | 'agent') => {
        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content,
          sender,
          timestamp: new Date()
        };
        
        set({ messages: [...get().messages, newMessage] });
      },

      setCurrentStep: (step: number) => set({ currentStep: step }),
      
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      clearSession: () => set({
        sessionId: undefined,
        sessionState: 'onboarding',
        personalDetails: {},
        quoteDetails: {},
        riderSelections: [],
        paymentDetails: {},
        formCompletion: initialFormCompletion,
        messages: [],
        currentStep: 0,
        isLoading: false
      }),

      syncWithBackend: async () => {
        const { sessionId, personalDetails, quoteDetails, paymentDetails } = get();
        if (!sessionId) return;

        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/sync-form-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_id: sessionId,
              form_data: {
                personalDetails,
                quoteDetails,
                paymentDetails
              }
            })
          });

          const result = await response.json();
          if (result.success && result.updated_data) {
            // Update form completion from backend
            set({ formCompletion: result.updated_data.form_completion || get().formCompletion });
          }
        } catch (error) {
          console.error('Failed to sync with backend:', error);
        }
      },

      loadFromBackend: async (sessionId: string) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/session-data/${sessionId}`);
          const result = await response.json();
          
          if (result.success && result.form_data) {
            const { personalDetails, quoteDetails, paymentDetails, formCompletion } = result.form_data;
            
            set({
              sessionId,
              sessionState: result.current_state,
              personalDetails: personalDetails || {},
              quoteDetails: quoteDetails || {},
              paymentDetails: paymentDetails || {},
              formCompletion: formCompletion || initialFormCompletion
            });
          }
        } catch (error) {
          console.error('Failed to load from backend:', error);
        }
      }
    }),
    {
      name: 'etouch-insurance-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        sessionState: state.sessionState,
        personalDetails: state.personalDetails,
        quoteDetails: state.quoteDetails,
        riderSelections: state.riderSelections,
        paymentDetails: state.paymentDetails,
        formCompletion: state.formCompletion,
        currentStep: state.currentStep
      })
    }
  )
);