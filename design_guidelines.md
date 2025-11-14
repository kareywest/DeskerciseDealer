# Design Guidelines: Deskercise Dealer

## Design Approach

**Selected Approach**: Reference-Based with Gamification Influence

Drawing inspiration from playful productivity apps like Duolingo and Headspace, combined with card-game interfaces. The design should feel inviting and energetic while maintaining professional credibility for workplace use.

**Core Principles**:
- Playful professionalism: Fun without being childish
- Card-game metaphor drives all interactions
- Clear, encouraging visual hierarchy
- Immediate visual feedback for all actions

---

## Typography

**Font Strategy**: Use Google Fonts with distinct personality

**Primary Font** (Headings/Buttons): Fredoka or Poppins
- Card titles: text-2xl to text-3xl, font-semibold
- Exercise names: text-xl, font-medium
- Button text: text-base, font-semibold

**Secondary Font** (Body/Instructions): Inter or DM Sans
- Exercise descriptions: text-base, font-normal, leading-relaxed
- Settings text: text-sm
- Timer displays: text-4xl to text-6xl, font-bold (tabular numbers)

**Hierarchy Rules**:
- H1 (Welcome): text-4xl md:text-5xl, font-bold
- H2 (Section headers): text-2xl md:text-3xl, font-semibold
- Body: text-base, line-height 1.6
- Small print: text-sm, opacity-75

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16

**Common Patterns**:
- Card padding: p-8
- Section spacing: py-16 md:py-24
- Element gaps: gap-4 for tight grouping, gap-8 for section breaks
- Button padding: px-8 py-4
- Container max-width: max-w-4xl for main content area

**Grid Strategy**:
- Single-column mobile-first
- Settings/history: 2-column layout on md: breakpoint
- Card deck: Centered single column always (max-w-md mx-auto)

---

## Component Library

### Welcome Screen
- Full-viewport hero section (min-h-screen)
- Centered content with max-w-2xl
- Large friendly headline + subtext
- Illustrated preview of card deck (stacked cards visual)
- Primary CTA button (large, prominent)
- Quick settings preview cards in 2-column grid below hero

### Card Deck Interface
**Main Deck View**:
- Centered card stack visual (3-5 stacked cards with offset shadow effect)
- Large "Draw Card" button below deck
- Settings icon (top-right corner)
- Current streak/stats bar (top of screen, subtle)

**Exercise Card**:
- Card container: rounded-3xl, shadow-2xl, max-w-md
- Aspect ratio: roughly 3:4 portrait orientation
- Top section: Large emoji/SVG illustration (h-32 to h-40)
- Middle: Exercise name (heading) + description
- Bottom: Action buttons (4 buttons in 2x2 grid or horizontal row)
- Card back design for flip animation (app logo/pattern)

### Settings Panel
- Slide-in panel from right (w-96 on desktop, full-width mobile)
- Section headers with dividers
- Radio button groups for difficulty (large, card-style options)
- Slider for interval selection with time preview
- Toggle switches for notifications
- Save button (sticky bottom)

### Timer/Notification
- Floating notification badge (top-right, animated entrance)
- Countdown timer in large typography
- Dismiss/Snooze options
- Desktop: Toast notification style
- Mobile: Full-screen takeover option

### History/Stats View
- Scrollable list of completed exercises
- Each item: small card with exercise name, timestamp, emoji
- Filters: Today/Week/All time tabs
- Stats summary cards: Total exercises, streak, favorite type

---

## Animations & Interactions

**Card Animations** (Essential to experience):
- **Draw**: Card slides up from deck with slight rotation (300ms ease-out)
- **Flip**: 3D flip animation when revealing exercise (400ms)
- **Shuffle**: Subtle deck reorganization before draw (200ms)
- **Skip**: Card swipes left/right off screen (250ms)
- **Repeat**: Gentle bounce/pulse effect (150ms)

**Button States**:
- Hover: Slight lift (translateY -2px) + shadow increase
- Active: Scale down (0.98) + shadow decrease
- Focus: Prominent outline for accessibility

**Transitions**:
- Panel slides: 300ms ease-in-out
- Fade ins: 200ms for new content
- Scale animations: Use sparingly for emphasis

---

## Images

**Placement**:
- **Welcome Hero**: Large hero image showing happy office worker stretching at desk (or illustrated equivalent). Full-width background with overlay for text readability
- **Card Illustrations**: Each exercise card includes emoji OR simple SVG illustration at top (not photographs)
- **Empty States**: Friendly illustration when no exercises in history

**Hero Image Specifications**:
- Full-width background treatment
- Subtle gradient overlay for text contrast
- Image shows relatable office environment
- Buttons on hero have backdrop-blur-md background

---

## Accessibility

- WCAG AA compliant contrast ratios throughout
- Clear focus indicators on all interactive elements
- Screen reader labels for icon-only buttons
- Keyboard navigation: Tab through cards, Spacebar to draw
- Reduced motion support: Disable animations when prefers-reduced-motion
- Large touch targets: minimum 44x44px for all buttons

---

**Responsive Breakpoints**:
- Mobile: < 640px (single column, full-width cards)
- Tablet: 640px - 1024px (comfortable card sizing)
- Desktop: > 1024px (max-w constraints, optimal card presentation)