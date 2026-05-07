import bleach
from typing import Any

# Layer 4: Allowed tags for rich text
ALLOWED_TAGS = [
    'a', 'abbr', 'acronym', 'b', 'blockquote', 'code',
    'em', 'i', 'li', 'ol', 'strong', 'ul', 'p', 'br', 'span'
]
ALLOWED_ATTRS = {
    'a': ['href', 'title'],
    'abbr': ['title'],
    'acronym': ['title'],
    'span': ['style'],
}

def sanitize_html(content: str) -> str:
    """Sanitize HTML content, allowing only safe tags"""
    if not content:
        return content
    return bleach.clean(content, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)

def sanitize_text(content: str) -> str:
    """Strip all HTML tags from plain text"""
    if not content:
        return content
    return bleach.clean(content, tags=[], attributes={}, strip=True)

def sanitize_recursive(data: Any) -> Any:
    """Recursively sanitize strings in a dict or list"""
    if isinstance(data, str):
        return sanitize_text(data)
    elif isinstance(data, dict):
        return {k: sanitize_recursive(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_recursive(item) for item in data]
    return data
