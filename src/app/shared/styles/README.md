# Heading System Documentation

This document explains the consistent heading system implemented across the E-Summit 25 application.

## Available Heading Classes

### Primary Headings
- `.heading-primary` - Main page titles with gradient effect (4rem)
- `.heading-secondary` - Section titles in white (3rem)  
- `.heading-tertiary` - Subsection titles in purple (2rem)

### Specialized Headings
- `.heading-timeline` - Timeline section headings with gradient
- `.heading-faq` - FAQ section headings in purple
- `.heading-contact` - Contact section headings in purple
- `.heading-two-line` - Two-line headings with different colors

### Event-Specific Classes
- `.heading-event-highlight` - Event name highlights with gradient

### Utility Classes
- `.heading-left` - Left align text
- `.heading-center` - Center align text
- `.heading-mb-0`, `.heading-mb-1`, `.heading-mb-2` - Margin bottom utilities

## Usage Examples

### Basic Headings
```html
<h1 class="heading-primary">Main Page Title</h1>
<h2 class="heading-secondary">Section Title</h2>
<h3 class="heading-tertiary">Subsection Title</h3>
```

### Specialized Sections
```html
<h3 class="heading-timeline">Timeline</h3>
<h3 class="heading-faq">FAQs</h3>
<h3 class="heading-contact">Contact Us</h3>
```

### Two-Line Headings
```html
<div class="heading-two-line">
  <span class="line-primary">Why</span>
  <span class="line-secondary">E-Summit?</span>
</div>
```

### Event Name Highlights
```html
<h2 class="heading-secondary">
  What is <span class="heading-event-highlight">i-HACK?</span>
</h2>
```

## Responsive Behavior

All heading classes include responsive breakpoints:
- Desktop: Full size
- Tablet (≤768px): Reduced size
- Mobile (≤480px): Further reduced size

## Migration Notes

The following old classes have been replaced:
- `.timeheading` → `.heading-timeline`
- Individual heading styles → Consistent class system
- Inline styles → Utility classes

## Best Practices

1. Use semantic HTML elements (h1, h2, h3) with appropriate heading classes
2. Maintain heading hierarchy for accessibility
3. Use utility classes for spacing adjustments
4. Prefer class-based styling over inline styles