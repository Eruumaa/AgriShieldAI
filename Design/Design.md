# AgriShield AI Design System

## Overview
A premium, dark-mode focused design system for agricultural risk intelligence. The aesthetic blends deep navy/slate backgrounds with vibrant, high-contrast neon accents (Emerald, Sky Blue, Purple) to create a futuristic, "glassmorphism" feel. Designed for advanced analytics, it prioritizes clarity, data visualization, and an immersive, AI-driven mood. The overall mood is high-tech, professional, and visually stunning.

## Colors
- **Background Primary** (`#0a0f1c`): Deep navy/black — main page background
- **Background Secondary** (`#0f172a`): Slate 900 — sidebars, chat areas
- **Surface/Card** (`#141c2f`): Solid card background — panels, widgets
- **Surface Hover** (`#1b253b`): Hover states on cards
- **Accent Emerald** (`#10b981`): Primary CTAs, positive trends, "Very Safe" status, safe alerts
- **Accent Sky** (`#0ea5e9`): Secondary accents, links, active states
- **Accent Amber** (`#f59e0b`): Warnings, medium risk, active notifications
- **Accent Red** (`#ef4444`): High risk, critical alerts, destructive actions
- **Accent Purple** (`#8b5cf6`): AI insights, ML features, futuristic elements
- **Text Primary** (`#f1f5f9`): Slate 100 — headings, body text
- **Text Secondary** (`#cbd5e1`): Slate 300 — descriptions, secondary info
- **Text Muted** (`#94a3b8`): Slate 400 — placeholders, minor metadata
- **Border Subtle** (`#1e293b`): Slate 800 — card edges, dividers
- **Border Medium** (`#334155`): Slate 700 — hover borders

## Typography
- **Display Font**: Playfair Display — loaded from Google Fonts
- **Body Font**: Source Sans 3 — loaded from Google Fonts
- **Code Font**: Fira Code — loaded from Google Fonts
Display and heading text uses Playfair Display at bold weight with tight letter spacing (-0.02em). The serif display font conveys craft and intentionality. Body and UI text uses Source Sans 3 at regular (400) and semibold (600) weights — a clean, highly legible sans-serif. Code blocks use Fira Code with ligatures enabled.
Type scale: Display 64px, Headline 48px, Section heading 28px, Subhead 20px, Body 16px, Small 14px, Caption 12px, Overline 11px uppercase tracking-wide.

## Elevation & Effects
- Cards use subtle shadows (`0 1px 3px 0 rgb(0 0 0 / 0.1)`) that enhance depth without overwhelming the dark theme.
- Hover states lift elements and apply glows, e.g., Emerald glow (`0 0 0 2px rgba(16, 185, 129, 0.2)`).
- Glassmorphism is heavily used in the Landing Page and Auth screens (`backdrop-filter: blur(12px)`) to create a floating, futuristic aesthetic.
- Animated mesh gradients and 3D tilt effects (`TiltCard`) provide micro-interactions.

## Components
- **Buttons**: Primary uses an Emerald gradient (`linear-gradient(135deg, var(--accent-emerald), #0dd882)`) with deep dark text for contrast, rounded edges (`8px` or `999px` for pills), and hover lift. Secondary uses transparent bg with subtle border.
- **Cards**: Deep blue surfaces (`#141c2f`) with `14px` border radius, subtle borders. 
- **KPI Cards**: Feature top accent border gradients (e.g., Emerald, Sky, Purple) corresponding to their metric type.
- **Badges/Chips**: Pill-shaped (`999px`), using translucent backgrounds (`rgba(..., 0.15)`) with solid colored text for a glowing effect.
- **Navigation**: Collapsible sidebar (`260px` to `72px`) with hover states that reveal an active accent bar.

## Layout & Responsiveness
- **Grid System**: 4-column layout on large desktops, breaking down to 2 columns on tablets, and 1 column on mobile (`max-width: 768px`).
- **Mobile Drawer**: Sidebar transitions into an off-canvas drawer with a blurred backdrop on mobile devices.
- **Spacing**: Generous padding (`24px` to `32px` on cards) to allow data to breathe.

## Do's and Don'ts
- Do use translucent dim colors (`--accent-color-dim`) for badge backgrounds to create a "glowing neon" effect on the dark theme.
- Do maintain high contrast for data visualization colors against the dark background.
- Do utilize smooth micro-animations (`transform 0.2s ease-out`) on interactive elements.
- Don't use flat white backgrounds; stick to the deep navy/slate spectrum.
- Don't clutter the UI with solid bright colors; use accents deliberately for data states or CTAs.
