/**
 * Advanced JSON response parsing utilities
 * Matches backend parsing logic for consistent handling
 */

export interface ParsedResponse {
  text: string;
  storeUpdate?: any;
  metadata?: any;
}

export class ResponseParser {
  /**
   * Check if text appears to be JSON
   */
  static isJsonString(text: string): boolean {
    if (!text) return false;
    const trimmed = text.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  }

  /**
   * Extract reply text from JSON response (mirrors backend logic)
   */
  static extractReplyFromJson(text: string): ParsedResponse {
    const result: ParsedResponse = { text };
    
    if (!text) return result;
    
    try {
      // If it's clearly JSON, try to parse and extract reply
      if (this.isJsonString(text)) {
        const parsed = JSON.parse(text);
        
        if (typeof parsed === 'object' && parsed !== null) {
          // Check for reply field first (most common)
          if (parsed.reply && typeof parsed.reply === 'string') {
            result.storeUpdate = parsed.store_update;
            result.metadata = parsed;
            
            // Also check for next_question and combine if present
            if (parsed.next_question && typeof parsed.next_question === 'string' && parsed.next_question.trim()) {
              result.text = `${parsed.reply}\n\n${parsed.next_question}`;
              return result;
            }
            
            result.text = parsed.reply;
            return result;
          }
          
          // Try other common field names
          const messageFields = ['message', 'response', 'text', 'content'];
          for (const field of messageFields) {
            if (parsed[field] && typeof parsed[field] === 'string') {
              result.text = parsed[field];
              result.metadata = parsed;
              return result;
            }
          }
          
          // Handle specific modes - extract reply from mode-based responses
          if (parsed.mode && parsed.reply) {
            result.text = parsed.reply;
            result.metadata = parsed;
            return result;
          }
          
          // If it's a complete agent response with mode/api_calls but no reply, provide fallback
          if (parsed.mode || parsed.extracted || parsed.api_calls || parsed.reasoning) {
            // For informational mode, try to find content in other fields
            if (parsed.mode === 'informational' && !parsed.reply) {
              const contentFields = ['message', 'response', 'text', 'content'];
              for (const field of contentFields) {
                if (parsed[field] && typeof parsed[field] === 'string') {
                  result.text = parsed[field];
                  result.metadata = parsed;
                  return result;
                }
              }
            }
            result.text = "I'm working on your request. Please let me know if you need any additional information.";
            result.metadata = parsed;
            return result;
          }
        }
      }
    } catch (e) {
      // JSON parsing failed, continue to regex cleanup
    }
    
    // Try regex patterns to extract reply text
    const jsonPatterns = [
      /^\{\s*"reply"\s*:\s*"(.+?)"\s*,.*\}$/s,      // {"reply":"text","other":"data"}
      /^\{\s*"reply"\s*:\s*"(.+?)"\s*\}$/s,         // {"reply":"text"}
      /^\{\s*"message"\s*:\s*"(.+?)"\s*,.*\}$/s,    // {"message":"text","other":"data"}
      /^\{\s*"message"\s*:\s*"(.+?)"\s*\}$/s,       // {"message":"text"}
      /^\{[^}]*"mode"\s*:\s*"[^"]*"[^}]*"reply"\s*:\s*"(.+?)"[^}]*\}$/s,  // {"mode":"informational","reply":"text"}
      /^\{[^}]*"reply"\s*:\s*"(.+?)"[^}]*"mode"\s*:\s*"[^"]*"[^}]*\}$/s   // {"reply":"text","mode":"informational"}
    ];
    
    let cleaned = text;
    for (const pattern of jsonPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        cleaned = match[1];
        break;
      }
    }
    
    // Basic cleanup
    cleaned = cleaned.replace(/\\"/g, '"');      // Unescape quotes
    cleaned = cleaned.replace(/\\n/g, '\n');     // Unescape newlines
    cleaned = cleaned.replace(/\\t/g, '\t');     // Unescape tabs
    cleaned = cleaned.replace(/\\r/g, '\r');     // Unescape carriage returns
    cleaned = cleaned.trim();
    
    // Remove outer quotes if the entire string is wrapped
    if (cleaned.startsWith('"') && cleaned.endsWith('"') && cleaned.length > 2) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Update result if cleanup was successful
    if (cleaned !== text && cleaned.length > 0) {
      result.text = cleaned;
    }
    
    return result;
  }

  /**
   * Handle embedded JSON within text
   */
  static parseEmbeddedJson(text: string): ParsedResponse {
    const result: ParsedResponse = { text };
    
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace > firstBrace && firstBrace > 0) {
      // There's text before the JSON, keep the text part
      const beforeJson = text.slice(0, firstBrace).trim();
      const jsonPart = text.slice(firstBrace, lastBrace + 1);
      
      try {
        const obj = JSON.parse(jsonPart);
        if (obj.reply) {
          result.storeUpdate = obj.store_update;
          result.metadata = obj;
          
          const parts = [beforeJson, obj.reply];
          if (obj.next_question && obj.next_question.trim()) {
            parts.push(obj.next_question);
          }
          result.text = parts.filter(Boolean).join('\n\n');
          return result;
        }
      } catch (e) {
        // If embedded JSON parsing fails, return original text
      }
    }
    
    return result;
  }

  /**
   * Main parsing function - comprehensive JSON cleaning
   */
  static parseResponse(text: string): ParsedResponse {
    if (!text) return { text: '' };
    
    // First try embedded JSON parsing
    if (text.indexOf('{') > 0) {
      const embedded = this.parseEmbeddedJson(text);
      if (embedded.text !== text) {
        return embedded;
      }
    }
    
    // Then try direct JSON extraction
    return this.extractReplyFromJson(text);
  }

  /**
   * Clean response specifically for chat display
   */
  static cleanForDisplay(text: string): string {
    const parsed = this.parseResponse(text);
    return parsed.text;
  }

  /**
   * Extract quote information from response metadata
   */
  static extractQuoteData(response: any): any {
    if (response.metadata?.quotes) {
      return response.metadata.quotes;
    }
    
    // Check for quotes in parsed JSON
    if (response.metadata?.api_results) {
      const quoteResults = response.metadata.api_results.filter(
        (result: any) => result.name === 'premium_calculation' && result.success
      );
      
      if (quoteResults.length > 0) {
        return {
          generated: true,
          best_quote: quoteResults[0].result?.best || {},
          all_quotes: quoteResults[0].result?.quotes || [],
          quote_count: quoteResults[0].result?.quotes?.length || 0
        };
      }
    }
    
    return null;
  }
}

export default ResponseParser;