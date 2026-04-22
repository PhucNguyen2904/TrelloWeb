---
name: Clarity & Momentum
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dae0'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fa'
  surface-container: '#ebeef4'
  surface-container-high: '#e6e8ee'
  surface-container-highest: '#e0e2e9'
  on-surface: '#181c20'
  on-surface-variant: '#404751'
  inverse-surface: '#2d3136'
  inverse-on-surface: '#eef1f7'
  outline: '#707882'
  outline-variant: '#c0c7d2'
  surface-tint: '#00629d'
  primary: '#005f98'
  on-primary: '#ffffff'
  primary-container: '#0079bf'
  on-primary-container: '#fbfbff'
  inverse-primary: '#98cbff'
  secondary: '#535f73'
  on-secondary: '#ffffff'
  secondary-container: '#d4e0f8'
  on-secondary-container: '#576377'
  tertiary: '#8c4a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05f01'
  on-tertiary-container: '#fffbfa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#d7e3fb'
  secondary-fixed-dim: '#bbc7de'
  on-secondary-fixed: '#101c2d'
  on-secondary-fixed-variant: '#3b475b'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#e0e2e9'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 12px
  sidebar_width: 260px
---

## Brand & Style

This design system is built on the pillars of efficiency, structural clarity, and professional trust. It is designed to transform the inherent chaos of project management into a streamlined, calm experience. The aesthetic follows a **Modern Corporate** style, blending the utility of Material Design with the refined minimalism of modern SaaS platforms.

The target audience consists of project managers and agile teams who require a tool that feels "out of the way" yet authoritative. The UI avoids unnecessary decorative elements to focus on content hierarchy and task momentum, ensuring that the interface remains readable even when boards become densely populated with cards and metadata.

## Colors

The palette is anchored by a professional blue, used strategically to indicate primary actions and active states. To prevent visual fatigue in high-use environments, the design system utilizes a sophisticated range of cool grays for structural elements like backgrounds, borders, and sidebar navigation.

- **Primary Blue (#0079BF):** Used for CTA buttons, primary navigation links, and focus indicators.
- **Surface Neutrals:** A range of light grays is used to create a "container-within-container" hierarchy. The main workspace uses a slightly darker neutral to make white cards pop.
- **Semantic Colors:** Success green and warning orange are used exclusively for status indicators, labels, and due dates to provide immediate visual feedback without overwhelming the user.

## Typography

This design system utilizes **Inter** for its exceptional legibility and systematic feel. The type scale is built on a 4px baseline grid to ensure perfect vertical rhythm across lists and cards.

Headlines use tighter letter spacing and heavier weights to provide a strong visual anchor for columns and project titles. Body text is optimized for long-form descriptions within cards, while labels use a slightly heavier weight and uppercase styling to differentiate metadata (like tags or dates) from primary content.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** for the main workspace, allowing project boards to expand horizontally with as many columns as needed. 

- **The Board:** Uses a horizontal scrolling layout where each column (List) has a fixed width of 280px to 320px. 
- **The Sidebar:** A fixed-width navigation panel persists on the left for quick access to workspaces and settings.
- **Rhythm:** An 8px spacing system governs all margins and padding. Gaps between cards are set to 8px, while internal card padding is 12px or 16px to maintain a spacious, professional feel.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a clear sense of interactability. 

- **Level 0 (Surface):** The main application background, using the neutral-50 gray.
- **Level 1 (Containers):** List containers have a slightly darker gray background or a subtle border but no shadow, grounding them to the surface.
- **Level 2 (Interactive Cards):** Task cards are pure white with a soft, diffused shadow (0px 1px 3px rgba(0,0,0,0.1)). This makes them appear physically "lifted" and ready to be dragged.
- **Level 3 (Modals/Overlays):** Large shadows with a higher blur radius (0px 12px 24px rgba(0,0,0,0.15)) are used for card detail views and popovers to focus user attention.

## Shapes

The shape language is consistently **Rounded**, which softens the professional aesthetic and makes the tool feel approachable. 

- **Cards & Buttons:** Use a standard 0.5rem (8px) corner radius.
- **Input Fields:** Match the 8px radius for consistency.
- **Chips/Labels:** Utilize a pill-shaped (full-round) radius to distinguish them from interactive buttons.
- **Selection States:** Focus rings and selection overlays follow the parent element's corner radius with a 2px offset.

## Components

The components within this design system are designed for high-density utility:

- **Buttons:** Primary buttons are solid Blue (#0079BF) with white text. Secondary buttons use a light gray ghost style to remain unobtrusive.
- **Cards:** The core component. Must include a white background, 8px rounded corners, and internal padding of 12px. Support for "Cover Images" should occupy the top of the card with the same top-radius.
- **Lists (Columns):** Feature a header with a title and action menu. The background is a subtle gray to provide contrast against the white cards.
- **Input Fields:** Use a 1px border (#DFE1E6) that transitions to the Primary Blue on focus.
- **Chips (Labels):** Small, color-coded badges for categorization. They use high-contrast text against desaturated backgrounds for readability.
- **Navigation:** A clean top-bar for project-wide actions and a sidebar for organizational navigation. Active links are indicated with a left-accent border in Primary Blue.
- **Progress Indicators:** Linear bars used within cards to show task completion percentages, utilizing the Success Green.