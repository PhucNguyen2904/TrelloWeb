import DOMPurify from 'dompurify';

/**
 * Layer 4: Client-side sanitization
 * Use this for any content that must be rendered as HTML.
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol', 'strong', 'ul', 'p', 'br', 'span'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'style'],
  });
}

/**
 * Example usage in a component:
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(richTextFromServer) }} />
 */
