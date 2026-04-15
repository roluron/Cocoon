# COCOON — Claude Code Build Plan

> A transformative self-renewal app. Not wellness. Not productivity. Metamorphosis.
> The app that wants you to leave.

---

## TABLE OF CONTENTS

1. [Philosophy & Design DNA](#1-philosophy--design-dna)
2. [Tech Stack](#2-tech-stack)
3. [Build Order (Phases)](#3-build-order-phases)
4. [Screen-by-Screen Specification](#4-screen-by-screen-specification)
5. [Data Architecture](#5-data-architecture)
6. [Algorithm: The Composite State](#6-algorithm-the-composite-state)
7. [Audio System](#7-audio-system)
8. [Wisdom Engine](#8-wisdom-engine)
8.1. [Resurfacing Engine](#81-resurfacing-engine-your-own-words)
8.2. [Presence Guardian](#82-presence-guardian-anti-addiction-system)
9. [Animation & Interaction Spec](#9-animation--interaction-spec)
10. [Weekly Summary](#10-weekly-summary)
11. [Vivarium (Future Phase)](#11-vivarium-future-phase)
12. [File Structure](#12-file-structure)

---

## 1. PHILOSOPHY & DESIGN DNA

### What Cocoon Is NOT
- Not a meditation app (no timers, no guided sessions)
- Not a habit tracker with checkboxes
- Not a mood journal with smiley faces
- Not a productivity tool
- Not religious or preachy

### What Cocoon IS
- A living mirror that reflects your inner state
- A patient companion for personal transformation
- A space where sadness is valid, not a problem to fix
- Invisible technology serving visible human change
- **The app that wants you to leave.** Cocoon's ultimate success metric is éclosion: the user no longer needs it. Every other wellness app optimizes for engagement. Cocoon optimizes for graduation.

### The Anti-Addiction Contract
Cocoon is built on a radical premise: the best version of this app is the one you eventually stop opening. This is not a retention problem. This IS the product.

Concrete guardrails:
- **Session awareness**: After 10 minutes of continuous use, a gentle message fades in: "You've been here a while. The world outside is waiting too." No lock-out. No timer. Just a whisper.
- **Daily ceiling**: After the 3rd mood check-in in a day, the check-in button softens and says "You've already checked in today. Trust what you felt." Still tappable, but discouraged.
- **No pull-to-refresh dopamine**: No feed. No new content to scroll. The app is the same calm room every time you enter it.
- **No push notifications by default**: Ritual reminders are opt-in during onboarding. No re-engagement notifications. Ever. If the user stops opening Cocoon, that might be the transformation working.
- **Éclosion = the app celebrating your departure**: When a butterfly emerges, the message isn't "start a new cycle!" It's "You did something real. Come back if you need to. Or don't. Both are beautiful."

### Design Principles
1. **Breathe**: Every screen should feel like taking a breath. Generous whitespace. No visual noise.
2. **Respect**: Never pathologize. Never use red for "bad." Never celebrate with confetti.
3. **Depth**: Layers revealed over time, not all at once. The app grows with the user.
4. **Warmth**: Organic, living, soft. Not clinical. Not corporate.
5. **Gravity**: This matters. Treat the user's inner life with the seriousness it deserves.

### Visual Language
- **Color palette**: Muted, organic, shifting. Think deep ocean, twilight sky, forest shadow, amber warmth. NO neon. NO pure white backgrounds. Always tinted, always alive.
- **Base palette** (CSS variables):
  - `--cocoon-void`: `#0a0a0f` (deepest background, near-black with blue undertone)
  - `--cocoon-deep`: `#12121a` (card/surface background)
  - `--cocoon-surface`: `#1a1a24` (elevated surfaces)
  - `--cocoon-mist`: `#2a2a36` (borders, subtle dividers)
  - `--cocoon-ash`: `#6b6b7b` (secondary text)
  - `--cocoon-pearl`: `#c8c8d4` (primary text)
  - `--cocoon-light`: `#e8e8f0` (headings, emphasis)
  - `--cocoon-glow`: dynamic, based on mood state (see mood colors below)
- **Mood color mapping** (these shift the `--cocoon-glow` and ambient gradients):
  - Serene: `#4a7c8a` (soft teal)
  - Melancholy: `#3d3d6b` (deep indigo)
  - Restless: `#8a6a3d` (amber)
  - Energized: `#6b8a4a` (moss green)
  - Heavy: `#4a3d5c` (muted purple)
  - Light: `#8a8a6b` (warm sage)
  - Creative: `#6b4a7c` (dusty violet)
  - Peaceful: `#3d6b6b` (deep cyan)
- **Typography**:
  - Display/Headings: `"Cormorant Garamond"` — elegant, serif, literary weight
  - Body: `"Outfit"` — clean, geometric sans-serif, modern but warm
  - Accent/Labels: `"JetBrains Mono"` — monospace for data points, scores, timestamps
  - Wisdom quotes: `"Cormorant Garamond"` italic
- **Borders & shapes**: Rounded (16px radius for cards, 24px for modals). No hard edges anywhere.
- **Shadows**: Soft, layered, using mood color. `box-shadow: 0 8px 32px rgba(glow-color, 0.08)`
- **Noise texture**: Subtle grain overlay (CSS `background-image` with SVG noise) on all backgrounds. Opacity 0.03. This prevents the "flat digital" feel.

---

## 2. TECH STACK

```
Framework:      React 18+ (functional components, hooks only)
Styling:        Tailwind CSS + CSS custom properties for dynamic theming
Animation:      Framer Motion (spring physics, layout animations, gestures)
State:          React Context + useReducer (no Redux, keep it light)
Storage:        localStorage for prototype / IndexedDB for production
Audio:          Tone.js (generative audio synthesis)
Charts:         Recharts (for weekly summary mood wave)
Icons:          Lucide React
Font loading:   Google Fonts via CDN (@import in CSS)
Build:          Vite
```

### Why This Stack
- Framer Motion gives us the organic, physics-based feel Cocoon needs (spring animations, drag gestures, layout transitions)
- Tone.js enables true generative audio, not just mp3 playback
- Tailwind keeps styling consistent while CSS variables handle the dynamic mood theming
- No heavy state management — the app's state is simple and local

---

## 3. BUILD ORDER (PHASES)

### PHASE 1: The Soul (Build This First)
> If this doesn't feel magical, nothing else matters.

1. App shell with bottom navigation (4 tabs)
2. Onboarding flow (7 screens)
3. Home screen with mood check-in (3-stage flow: mood → breathe → journal invite)
4. Mood state management + color theming
5. Basic journal (quick pulse + guided reflection + free write)
6. 21-day prompt arc (Repair Protocol progression for guided reflections)
7. Static wisdom quotes (contextual display)
8. Resurfacing engine ("your own words from a lighter day")
9. Presence Guardian (anti-addiction session awareness)

### PHASE 2: The Rhythm
7. Ritual engine (morning/evening routines)
8. Ritual builder in onboarding
9. Notification scheduling logic
10. Habit completion tracking
11. Streak and consistency calculation

### PHASE 3: The Voice
12. Generative audio engine (Tone.js)
13. Five audio modes (Wake, Focus, Create, Move, Rest)
14. Mood-reactive audio parameters
15. Audio player UI (minimal, ambient)

### PHASE 4: The Mirror
16. Weekly summary screen
17. Mood wave visualization
18. Cocoon progression animation (simple CSS, not 3D)
19. Metamorphosis phases (Dormancy → Emergence)
20. Cycle history / butterfly collection

### PHASE 5: The Glow (Final Polish)
21. Orb visualization on home screen (CSS/SVG, animated gradients)
22. Ambient background animations (subtle, GPU-friendly)
23. Screen transitions and micro-interactions
24. Haptic feedback patterns (if native wrapper)
25. Vivarium (social layer, future)

---

## 4. SCREEN-BY-SCREEN SPECIFICATION

### 4.1 ONBOARDING (7 Screens)

**Design**: Full-screen, dark background. One question per screen. Large typography. Answers are tappable cards, not form inputs. Transition between screens: slow crossfade (600ms) with slight upward drift.

**Screen 1: Welcome**
- Visual: Subtle pulsing gradient in center of screen (CSS radial-gradient animation)
- Text: "Before anything changes outside, something stirs within." (Cormorant Garamond, italic, 24px)
- Below: "Begin" button, pill-shaped, subtle glow border
- Animation: Text fades in over 1.5s, button appears after 2s delay

**Screen 2: "What brought you here?"**
- Title: "What brought you here?" (Cormorant Garamond, 28px)
- Subtitle: "There are no wrong answers." (Outfit, 14px, --cocoon-ash)
- Options (tappable cards, single select):
  - "I feel stuck"
  - "I want to grow"
  - "I'm searching for something"
  - "I'm hurting"
- Card style: --cocoon-deep background, 1px --cocoon-mist border, 16px radius. On select: border shifts to --cocoon-glow with soft glow shadow. Slight scale(1.02) on tap.

**Screen 3: "Where does your energy go?"**
- Title: "Where does your energy go?"
- Subtitle: "Most of it. Be honest."
- Options (single select):
  - "Into others"
  - "Into work"
  - "Into surviving"
  - "I don't know anymore"

**Screen 4: "What matters most right now?"**
- Title: "What matters to you right now?"
- Options (multi-select, max 2):
  - "Creative expression"
  - "Inner peace"
  - "Discipline & structure"
  - "Connection with others"
  - "Understanding myself"

**Screen 5: "How do you feel, right now?"**
- Title: "Close your eyes for a moment. How do you feel?"
- This is the first mood capture. Display 8 mood options as soft circular buttons arranged in a flowing layout (not a grid):
  - Serene / Melancholy / Restless / Energized / Heavy / Light / Creative / Peaceful
- Each option shows its associated color as a subtle fill
- On selection: the entire screen background slowly transitions to that mood's color palette over 2s
- Below: "This is your starting point." (appears after selection, Outfit, 14px)
- "Enter Cocoon" button appears after 1.5s delay

**Screen 6: "The 21 Days" (Story Moment)**
- This is NOT a question screen. It's a narrative pause.
- Visual: The ambient gradient from Screen 5 (the user's first mood color) stays as background, slowly breathing
- Text appears in stages, each line fading in with a 1.5s delay between them:
  - Line 1: "Change isn't magic." (Cormorant Garamond, 24px, --cocoon-light)
  - Line 2: "Your brain builds new pathways through repetition." (Outfit, 16px, --cocoon-pearl, appears after 1.5s)
  - Line 3: "Neuroscience shows this takes around 21 days." (Outfit, 16px, --cocoon-pearl, appears after 3s)
  - Line 4: "Not because of willpower. Because of biology." (Outfit, 16px, --cocoon-pearl, appears after 4.5s)
  - Line 5: "Some days will feel easy. Some won't." (Outfit, 16px, --cocoon-ash, appears after 6s)
  - Line 6: "Both are part of it." (Cormorant Garamond, 20px, --cocoon-light, appears after 7.5s)
- "Continue" button fades in after all text has appeared (after 9s)
- NO skip button. This moment needs to land. But the user can tap anywhere to accelerate the sequence.
- Design note: This screen sets the contract. The user is being told upfront: this is a 21-day commitment minimum. It's honest. It respects their intelligence. And the science framing removes the "woo" factor.

**Screen 7: "Your Morning" (Ritual Setup)**
- Title: "Let's shape your morning."
- Question 1: "How much time do you have?" — Slider or 3 options: "15 minutes" / "30 minutes" / "1 hour+"
- Question 2: "Do you drink coffee or tea?" — "Coffee" / "Tea" / "Neither"
- Question 3: "Can you access sunlight in the morning?" — "Yes" / "Not easily"
- Based on answers, Cocoon generates a suggested morning ritual (see Ritual Engine spec)
- Show the generated ritual as a scrollable list of gentle steps
- "This feels right" / "Adjust later" buttons

### 4.2 HOME SCREEN

**Layout (top to bottom):**

1. **Top bar**: Time of day greeting + user's name (if provided)
   - "Good morning" / "Good afternoon" / "Good evening"
   - Small, Outfit, 14px, --cocoon-ash
   - Right side: settings gear icon (Lucide)

2. **Cocoon State Card** (center, dominant element)
   - Large card (full width, 60vh height), --cocoon-deep background
   - Center: Large ambient gradient circle (CSS only, 200px diameter)
     - Colors shift based on current mood state
     - Gentle pulse animation (scale 0.95 to 1.05, 4s ease-in-out infinite)
     - NOTE FOR PHASE 5: This becomes the full orb. For now, keep it as a simple radial gradient with soft edges.
   - Below gradient: Current mood word (e.g., "Melancholy") in Cormorant Garamond, 20px
   - Below that: Current metamorphosis phase ("Stirring" / "Unraveling" / etc.) in JetBrains Mono, 12px, --cocoon-ash
   - Bottom of card: "How are you now?" tap target (subtle, underlined text link style)

3. **Today's Rituals** (horizontal scrollable)
   - Title: "Today" (Outfit, 16px semibold)
   - Horizontal scroll of small ritual cards (120px wide, 80px tall)
   - Each card: icon + label + completion state (soft checkmark or empty circle)
   - Completed cards get a soft glow in mood color

4. **Wisdom Fragment** (at bottom, if contextually triggered)
   - A single line of wisdom, Cormorant Garamond italic, 16px
   - Attribution below in JetBrains Mono, 11px
   - Appears based on Wisdom Engine rules (not always visible)

**Mood Check-in Flow** (triggered by "How are you now?" or daily prompt):

This is the emotional core of the app. It is NOT a modal that pops up and closes. It is a full-screen takeover with three stages:

**Stage 1: Mood Selection**
- Full screen takeover (Framer Motion, slide up with spring)
- Dark background, 8 mood options displayed as flowing buttons (same as onboarding)
- Below: optional one-sentence text input ("In a few words..." placeholder)
- On mood selection: smooth transition to Stage 2

**Stage 2: The Breathing Space (decompression chamber)**
- Screen settles into the selected mood's color palette (2s transition)
- Center: a breathing circle appears
  - CSS-only: a soft gradient circle that expands and contracts
  - Rhythm: 4 seconds expand, 4 seconds contract (natural breath pace)
  - No instructions. No "breathe in / breathe out" text. Just the circle moving.
  - The user naturally syncs their breathing. This is felt, not taught.
- The mood word sits quietly below the circle (Cormorant Garamond, 18px, low opacity)
- This stage lasts a minimum of 2-3 breath cycles (~16-24 seconds)
- Then Stage 3 fades in gently

**Stage 3: The Invitation**
- Below the breathing circle, text fades in: "Feel like writing today?" (Outfit, 16px, --cocoon-pearl)
- Two responses:
  - "Yes" — soft pill button, mood-colored border. Tapping transitions to Journal screen with the guided reflection or free write ready.
  - "Not today" — plain text link, --cocoon-ash, very subtle. Tapping gently fades everything and returns to home screen.
- If the user taps anywhere on the background (outside both options), it behaves like "Not today"
- NO guilt messaging. NO streak counters for journaling. NO "you've skipped 3 days" warnings.
- "Not today" is a complete, valid, respected answer.

**Important**: The breathing space is the secret weapon of this app. It creates a decompression chamber between naming a feeling and deciding what to do about it. Most apps rush past this. Cocoon sits with you.

### 4.3 JOURNAL SCREEN (Tab 2)

**Layout:**

1. **Header**: "Journal" (Cormorant Garamond, 24px)
   - Subtitle: contextual, changes based on streak: "Day 12 of your cycle" (JetBrains Mono, 12px)

2. **Quick Pulse** (always at top if not yet done today)
   - Card with: "One word for today."
   - Single text input, large font (Cormorant Garamond, 32px), center-aligned
   - On submit: gentle ripple animation, card collapses with "Noted." message

3. **Guided Reflection** (appears 2-3x per week, contextual)
   - Card with a prompt generated by the Wisdom Engine based on mood patterns
   - Example: "You've felt restless three days in a row. What's pulling at you?"
   - Multi-line text area (Outfit, 16px), --cocoon-deep background
   - "Reflect" submit button
   - Character limit: 500 characters. Show count subtly.

4. **Free Journal** (always available)
   - Tap to expand to full screen
   - Minimal: just a text area with date stamp
   - Cormorant Garamond, 18px, --cocoon-pearl on --cocoon-void
   - No toolbar, no formatting options. Pure writing.
   - Auto-saves every 5 seconds
   - "Done" button top-right to collapse back

5. **Past Entries** (scrollable below)
   - Cards showing date + quick pulse word + first line of any journal entry
   - Mood color dot next to each date
   - Tappable to expand and read (read-only)

### 4.4 RITUALS SCREEN (Tab 3)

**Layout:**

1. **Header**: "Rituals" (Cormorant Garamond, 24px)
   - Toggle: "Morning" / "Evening" (pill-style segmented control)

2. **Active Ritual List**
   - Vertical scrollable list of ritual cards
   - Each card:
     - Icon (Lucide) + Title (Outfit, 16px)
     - Subtitle/description (Outfit, 13px, --cocoon-ash)
     - Time suggestion: "6:30 AM" (JetBrains Mono, 12px)
     - Completion toggle: circular tap target, left side
     - When completed: gentle checkmark animation (Framer Motion, spring), card gets mood-color left border
   - Cards are reorderable via drag (Framer Motion drag gesture)

3. **Ritual Categories** (Huberman-inspired, but not branded):
   Morning rituals pool:
   - "Hydrate" (glass of water with pinch of salt)
   - "Sunlight" (10 min outdoor light exposure)
   - "Breathwork" (2 min box breathing or cyclic sighing)
   - "Movement" (10-30 min, any form)
   - "Journal" (morning reflection)
   - "Delay caffeine" (wait 90 min after waking)
   - "Cold exposure" (cold shower, 1-3 min)
   - "Intention" (set one intention for the day)

   Evening rituals pool:
   - "Screen sunset" (no screens 1hr before bed)
   - "Reflect" (what went well today)
   - "Gratitude" (3 things)
   - "Body scan" (5 min progressive relaxation)
   - "Tomorrow's intention" (one thing for tomorrow)
   - "Dim lights" (reduce light exposure)

4. **Add Ritual** (bottom)
   - "+ Add a ritual" button
   - Opens a sheet with available rituals from the pool
   - Custom ritual creation: title + time + optional description

5. **Streak Indicator** (subtle, bottom of screen)
   - "12 days flowing" (JetBrains Mono, 12px, --cocoon-ash)
   - No fireworks. No badges. Just a quiet acknowledgment.

### 4.5 SOUNDSCAPE SCREEN (Tab 4)

**Layout:**

1. **Full-screen ambient background** (gradient based on selected mode + mood)
2. **Mode selector** (center): 5 circular buttons in a gentle arc:
   - Wake (sunrise icon) — morning activation, philosophical whispers
   - Focus (target icon) — deep work, concentration
   - Create (feather icon) — creative flow, open
   - Move (wind icon) — physical energy, rhythm
   - Rest (moon icon) — unwinding, sleep preparation

3. **Now Playing** (below mode selector):
   - Mode name in Cormorant Garamond, 20px
   - Descriptive subtitle: "Generative ambient for deep focus" (Outfit, 13px, --cocoon-ash)
   - Play/Pause button (large, center, circular, 64px)
   - Duration timer (JetBrains Mono, 14px): optional, user can set 15/30/60/∞ min

4. **Mood Influence** (subtle indicator):
   - Small text: "Tuned to: Melancholy" showing current mood influence on audio
   - The audio parameters shift based on the user's current mood state

5. **Volume + fade controls** (bottom):
   - Volume slider (minimal)
   - "Fade to silence" toggle (for sleep mode, gradual 20-min fadeout)

### 4.6 WEEKLY SUMMARY (Modal/Overlay — appears Sunday evening)

**Layout (single scrollable screen):**

1. **Header**: "Your Week" (Cormorant Garamond, 28px)
   - Date range below (JetBrains Mono, 12px)

2. **Mood Wave** (Recharts area chart)
   - 7-day mood plotted as a gentle wave
   - Y-axis: emotional direction (not labeled numerically, just visually)
   - Fill: gradient using the week's dominant mood color
   - No axis labels. No grid. Just the wave. Minimal and beautiful.
   - Dots at each day, hoverable/tappable to see the mood word

3. **Insights** (2-3 max)
   - Cards with observations:
   - "You journaled 5 out of 7 days. Your mood lifted on journaling days."
   - "Your most common state this week: Restless."
   - "You completed 85% of your morning rituals."
   - Style: Outfit, 14px, with a small icon per insight

4. **Cocoon Progress**
   - Visual: Simple illustration/CSS animation of a cocoon
   - Phase label: "Stirring — Week 2"
   - Progress indicator: not a bar, but a visual metaphor
     - Dormancy: cocoon is dim, still
     - Stirring: subtle pulse
     - Unraveling: threads loosening (CSS animation)
     - Reforming: glow intensifying
     - Emergence: wings visible through translucent shell
   - NOTE: Keep this simple in early phases. A well-styled card with the phase name and a small CSS animated element is enough. No 3D. No WebGL.

5. **Wisdom of the Week**
   - One longer quote, selected for the user's current phase
   - Cormorant Garamond italic, 18px, centered

6. **Close**: "Continue your journey" button at bottom

---

## 5. DATA ARCHITECTURE

### 5.1 User Profile
```typescript
interface UserProfile {
  id: string;
  name?: string;
  createdAt: string; // ISO date
  onboarding: {
    motivation: 'stuck' | 'grow' | 'searching' | 'hurting';
    energyDirection: 'others' | 'work' | 'surviving' | 'unknown';
    priorities: string[]; // max 2 from: creative, peace, discipline, connection, self
    morningTime: '15min' | '30min' | '60min';
    caffeine: 'coffee' | 'tea' | 'neither';
    sunlightAccess: boolean;
  };
  currentCycle: Cycle;
  completedCycles: Cycle[];
  settings: {
    notificationsEnabled: boolean;
    morningNotificationTime: string; // "06:30"
    eveningNotificationTime: string; // "21:00"
    weeklyReviewDay: 'sunday'; // fixed for now
  };
}
```

### 5.2 Cycle (The Cocoon)
```typescript
interface Cycle {
  id: string;
  intention: string; // free text, set by user
  startDate: string;
  phase: 'dormancy' | 'stirring' | 'unraveling' | 'reforming' | 'emergence';
  phaseHistory: { phase: string; enteredAt: string }[];
  dominantColor: string; // hex, computed from mood history
  ecloseDate?: string; // set when butterfly emerges
  ecloseAcknowledged: boolean; // user confirmed transformation
  postEclosionChoice?: 'new-cycle' | 'resting'; // what user chose after éclosion
}

// dayInCycle is computed: Math.floor((now - startDate) / 86400000) + 1
// Repair Protocol prompt phase is derived from dayInCycle:
//   Days 1-4:   'entry'       (maps to cocoon: dormancy)
//   Days 5-9:   'sensory'     (maps to cocoon: stirring)
//   Days 10-14: 'agency'      (maps to cocoon: unraveling)
//   Days 15-18: 'reflection'  (maps to cocoon: reforming)
//   Days 19-21: 'proof'       (maps to cocoon: approaching emergence)
//   Days 22+:   cycle through all phases again, weighted toward agency/reflection
```

### 5.3 Mood Entry
```typescript
interface MoodEntry {
  id: string;
  timestamp: string;
  mood: 'serene' | 'melancholy' | 'restless' | 'energized' | 'heavy' | 'light' | 'creative' | 'peaceful';
  note?: string; // optional one-liner
  source: 'check-in' | 'journal-derived'; // journal sentiment analysis (future)
}
```

### 5.4 Journal Entry
```typescript
interface JournalEntry {
  id: string;
  date: string;
  quickPulse?: string; // single word
  guidedReflection?: {
    prompt: string;
    promptPhase: 'entry' | 'sensory' | 'agency' | 'reflection' | 'proof'; // Repair Protocol phase
    response: string;
  };
  freeWrite?: string;
  sentimentScore?: number; // -1 to 1, computed later
  moodAtTime: string; // mood state when entry was written
  isResurfaceable: boolean; // true if moodAtTime valence > 0.3
  lastResurfacedAt?: string; // ISO date, null if never resurfaced
}
```

### 5.5 Presence State
```typescript
interface PresenceState {
  sessionStartTime: string; // ISO timestamp, set when app opens/resumes
  checkInsToday: number; // count of mood check-ins today (resets at midnight)
  lastGentleNudge?: string; // ISO timestamp of last nudge shown
  appOpensToday: number; // count of app opens today
}
```

### 5.6 Ritual
```typescript
interface Ritual {
  id: string;
  title: string;
  description?: string;
  icon: string; // Lucide icon name
  timeOfDay: 'morning' | 'evening';
  suggestedTime?: string; // "06:30"
  isCustom: boolean;
  order: number;
}

interface RitualCompletion {
  ritualId: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO timestamp
}
```

### 5.7 Weekly Summary
```typescript
interface WeeklySummary {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  moodArc: MoodEntry[]; // 7 days of mood data
  ritualCompletionRate: number; // 0-1
  journalDaysCount: number;
  insights: string[]; // generated observations
  phase: string; // cocoon phase at end of week
  wisdomQuote: { text: string; author: string };
}
```

---

## 6. ALGORITHM: THE COMPOSITE STATE

### Phase Transition Logic

The cocoon phase advances based on sustained engagement, not daily scores.

```
DORMANCY → STIRRING
  Trigger: 3+ days of mood check-ins AND 1+ journal entry
  Minimum time: 3 days

STIRRING → UNRAVELING
  Trigger: 7+ days active AND 50%+ ritual completion rate AND 3+ journal entries
  Minimum time: 7 days from start

UNRAVELING → REFORMING
  Trigger: 14+ days active AND 60%+ ritual completion AND mood shows directional shift
  (directional shift = 3+ consecutive check-ins trending toward lighter states OR
   user's dominant mood has changed from baseline)
  Minimum time: 14 days from start

REFORMING → EMERGENCE
  Trigger: 21+ days active AND 70%+ ritual completion AND sustained mood shift AND
           user acknowledges transformation (Cocoon asks: "Do you feel something has changed?")
  Minimum time: 21 days from start
```

### Mood Direction Computation

```javascript
// Mood weights for computing emotional direction
const MOOD_VALENCE = {
  peaceful: 0.8,
  serene: 0.7,
  light: 0.6,
  creative: 0.5,
  energized: 0.4,
  restless: -0.2,
  melancholy: -0.4,
  heavy: -0.6,
};

// Directional shift: compare last 3 days average vs first 3 days of cycle
function computeDirection(moodEntries: MoodEntry[]): 'descending' | 'still' | 'ascending' {
  if (moodEntries.length < 6) return 'still';
  const first3 = average(moodEntries.slice(0, 3).map(e => MOOD_VALENCE[e.mood]));
  const last3 = average(moodEntries.slice(-3).map(e => MOOD_VALENCE[e.mood]));
  const delta = last3 - first3;
  if (delta > 0.15) return 'ascending';
  if (delta < -0.15) return 'descending';
  return 'still';
}
```

### Dominant Color Computation

The app's ambient color (--cocoon-glow) is always the most recent mood color. But the cycle's `dominantColor` is the most frequent mood over the entire cycle, used for the butterfly's color when éclosion happens.

---

## 7. AUDIO SYSTEM (Phase 3)

### Tone.js Generative Architecture

Each mode creates a layered soundscape using Tone.js synthesizers:

```
Layer 1: Pad (sustained, evolving chords)
  - Synth: Tone.PolySynth with slow attack/release
  - Notes change every 8-16 bars
  - Filter cutoff modulated by LFO

Layer 2: Texture (ambient noise/grain)
  - Tone.Noise filtered through bandpass
  - Volume and filter react to mood

Layer 3: Pulse (rhythmic element, optional)
  - Subtle clock/heartbeat for Focus and Move modes
  - Absent in Rest and Wake modes

Layer 4: Whisper (voice fragments, Wake mode only)
  - Pre-recorded short phrases (future: TTS)
  - Triggered randomly every 2-5 minutes
  - Heavy reverb + low-pass filter (feels like a thought, not a voice)
```

### Mode Parameters

| Mode   | Tempo (BPM) | Key       | Pad Character    | Texture Level | Pulse | Whispers |
|--------|-------------|-----------|------------------|---------------|-------|----------|
| Wake   | 60-70       | C major   | Warm, rising     | Low           | No    | Yes      |
| Focus  | 72-80       | D minor   | Deep, steady     | Medium        | Yes   | No       |
| Create | 65-75       | Eb major  | Open, floating   | High          | No    | No       |
| Move   | 90-110      | A minor   | Driving, bright  | Medium        | Yes   | No       |
| Rest   | 50-60       | F major   | Soft, descending | Very low      | No    | No       |

### Mood Influence on Audio
- Melancholy: lower filter cutoff, more reverb, slower LFO
- Energized: brighter harmonics, slight tempo increase
- Heavy: deeper bass frequencies, slower pad movement
- Serene: wider stereo field, crystal-like high harmonics
- Creative: more unpredictable note choices, slight dissonance allowed

---

## 8. WISDOM ENGINE

### Quote Database Structure
```typescript
interface WisdomFragment {
  id: string;
  text: string;
  author: string;
  tradition: 'jungian' | 'eastern' | 'stoic' | 'existential' | 'poetic' | 'scientific';
  themes: string[]; // e.g., ['change', 'suffering', 'self', 'time', 'courage']
  intensity: 'gentle' | 'medium' | 'profound';
  bestForPhases: string[]; // which cocoon phases this suits
  bestForMoods: string[]; // which mood states this resonates with
}
```

### Contextual Display Rules
Wisdom appears on the Home screen ONLY when one of these conditions is met:
1. User's mood has shifted (different from yesterday) — select a quote themed around "change" or "impermanence"
2. User has a 5+ day streak — select a quote themed around "discipline" or "patience"
3. User has been in the same mood for 4+ days — select a quote themed around "acceptance" or "stillness"
4. User just entered a new cocoon phase — select a quote matching that phase
5. It's the user's first session of the day — 30% chance of showing a "morning" themed quote
6. If none of the above: no quote shown. Silence is also a message.

### Sample Quotes (Seed Database — 50+ needed)

```json
[
  {
    "text": "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    "author": "Carl Jung",
    "tradition": "jungian",
    "themes": ["self", "awareness", "change"],
    "intensity": "profound",
    "bestForPhases": ["unraveling", "reforming"],
    "bestForMoods": ["restless", "heavy"]
  },
  {
    "text": "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    "author": "Alan Watts",
    "tradition": "eastern",
    "themes": ["change", "acceptance", "flow"],
    "intensity": "medium",
    "bestForPhases": ["stirring", "unraveling"],
    "bestForMoods": ["restless", "melancholy"]
  },
  {
    "text": "No tree can grow to heaven unless its roots reach down to hell.",
    "author": "Carl Jung",
    "tradition": "jungian",
    "themes": ["growth", "shadow", "depth"],
    "intensity": "profound",
    "bestForPhases": ["unraveling"],
    "bestForMoods": ["heavy", "melancholy"]
  },
  {
    "text": "The impediment to action advances action. What stands in the way becomes the way.",
    "author": "Marcus Aurelius",
    "tradition": "stoic",
    "themes": ["courage", "obstacle", "growth"],
    "intensity": "medium",
    "bestForPhases": ["reforming"],
    "bestForMoods": ["restless", "heavy"]
  },
  {
    "text": "You are the sky. Everything else is just the weather.",
    "author": "Pema Chödrön",
    "tradition": "eastern",
    "themes": ["self", "impermanence", "peace"],
    "intensity": "gentle",
    "bestForPhases": ["stirring", "reforming"],
    "bestForMoods": ["serene", "peaceful"]
  },
  {
    "text": "Muddy water is best cleared by leaving it alone.",
    "author": "Alan Watts",
    "tradition": "eastern",
    "themes": ["patience", "stillness", "acceptance"],
    "intensity": "gentle",
    "bestForPhases": ["dormancy", "stirring"],
    "bestForMoods": ["restless", "heavy"]
  },
  {
    "text": "He who has a why to live can bear almost any how.",
    "author": "Friedrich Nietzsche",
    "tradition": "existential",
    "themes": ["purpose", "suffering", "courage"],
    "intensity": "profound",
    "bestForPhases": ["unraveling", "reforming"],
    "bestForMoods": ["heavy", "melancholy"]
  },
  {
    "text": "The wound is the place where the light enters you.",
    "author": "Rumi",
    "tradition": "eastern",
    "themes": ["suffering", "growth", "healing"],
    "intensity": "profound",
    "bestForPhases": ["unraveling"],
    "bestForMoods": ["heavy", "melancholy", "restless"]
  },
  {
    "text": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "author": "Aristotle",
    "tradition": "stoic",
    "themes": ["discipline", "habit", "growth"],
    "intensity": "medium",
    "bestForPhases": ["stirring", "reforming"],
    "bestForMoods": ["energized", "creative"]
  },
  {
    "text": "In the middle of difficulty lies opportunity.",
    "author": "Albert Einstein",
    "tradition": "scientific",
    "themes": ["obstacle", "change", "perspective"],
    "intensity": "gentle",
    "bestForPhases": ["unraveling"],
    "bestForMoods": ["restless", "heavy"]
  }
]
```

### Guided Reflection Prompt Generation

Prompts follow a 21-day progression inspired by the Repair Protocol framework. The cycle has 5 emotional phases that map to the cocoon's metamorphosis. Prompts are selected based on BOTH the user's current day-in-cycle AND their mood patterns.

#### The 21-Day Prompt Arc (Repair Protocol Mapping)

**Days 1-4: ENTRY (Cocoon phase: Dormancy)**
Warm, grounding, low-pressure. The user just arrived. Don't push.
- "What does your body feel like right now? Not your mind. Your body."
- "If today had a color, what would it be?"
- "What's one small thing you did for yourself today?"
- "What sound would describe your week so far?"

**Days 5-9: SENSORY (Cocoon phase: Stirring)**
Go deeper. Invite vulnerability. Start connecting feelings to patterns.
- "What's something you've been avoiding thinking about?"
- "When was the last time you felt fully present? What were you doing?"
- "What would you say to yourself from five years ago?"
- "What emotion do you feel most often but rarely name out loud?"
- "Describe a moment this week that surprised you, even slightly."

**Days 10-14: AGENCY (Cocoon phase: Unraveling)**
Shadow territory. Honest confrontation with what's holding them back. This is where most people want to quit. The prompts acknowledge that.
- "What story do you keep telling yourself that might not be true?"
- "What are you holding onto that no longer serves you?"
- "If you could change one pattern in your life tomorrow, what would it be?"
- "This is the hard part. Most people stop here. Why are you still here?"
- "What would your life look like if you weren't afraid?"

**Days 15-18: REFLECTION (Cocoon phase: Reforming)**
Meaning-making. Connecting dots. The user starts seeing their own arc.
- "Read your first journal entry. What do you notice about that person?"
- "What has shifted since you started? It can be small."
- "Who in your life would notice the change you're making?"
- "What would you tell someone just starting this journey?"

**Days 19-21: PROOF (Cocoon phase: approaching Emergence)**
The user claims their transformation. Agency. Choice. Self-authorship.
- "Write one sentence about who you are becoming."
- "What will you carry forward from these 21 days?"
- "You've been here {X} days. You chose this every single time. What does that tell you about yourself?"

#### Pattern-Based Override Prompts
These override the day-based progression when a specific mood pattern is detected:

| Pattern Detected | Prompt |
|---|---|
| Same mood 4+ days | "You've been feeling {mood} for several days. What does this state need from you?" |
| Mood shifted from heavy to light | "Something shifted. Can you name what changed?" |
| High ritual completion + low mood | "You're showing up for your rituals even when it's hard. What keeps you going?" |
| Low ritual completion + good mood | "You've been feeling good without your rituals. What's carrying you?" |
| First day of new phase | "You've entered {phase}. What does this feel like?" |
| 7-day streak | "A week of consistency. What's different about this time?" |
| After 3+ days of no journal | "It's been a few days since you wrote. Is there something waiting to be said?" |
| **YOUR OWN WORDS trigger** (see Resurfacing Engine below) | Surfaces the user's own past writing instead of a prompt (see Section 8.1) |

---

## 8.1 RESURFACING ENGINE (Your Own Words)

### Philosophy
The most powerful thing Cocoon can show you is not a Jung quote. It's something YOU wrote on a good day, surfaced on a bad one. Your own proof that you've felt differently before. That lighter states aren't theoretical. They're historical. You've been there.

### How It Works

**Indexing**: Every journal entry (quick pulse, guided reflection, free write) is stored with its associated mood valence. Entries written on days with positive mood states (serene, light, peaceful, creative, energized) are flagged as "resurfaceable."

**Triggering**: The resurfacing engine activates when ALL of these conditions are met:
1. User checks in with a low-valence mood (heavy, melancholy) for 2+ consecutive days
2. There exists at least one resurfaceable entry from a previous period (minimum 5 days old, to avoid trivial recency)
3. The entry hasn't been resurfaced in the last 14 days (prevent repetition fatigue)

**Presentation**: When triggered, the resurfacing appears instead of the normal guided reflection prompt on the Journal screen:

```
Card design:
- Background: slightly warmer than standard --cocoon-deep (add 5% warmth)
- Top: "From a lighter day" (JetBrains Mono, 11px, --cocoon-ash)
- Center: The user's own words (Cormorant Garamond italic, 18px, --cocoon-pearl)
- Bottom: Date of original entry + mood color dot
- Below card: "You wrote this. You've felt this before." (Outfit, 13px, --cocoon-ash)
```

**Critical design rules:**
- NEVER frame this as "look how far you've come!" That's toxic positivity.
- NEVER imply the user should feel the same way now. The framing is: "This is also you. This is also real."
- The card is dismissable. No forced engagement.
- Maximum one resurfacing per week. Rarity makes it powerful.

### Data Model Addition
```typescript
interface JournalEntry {
  id: string;
  date: string;
  quickPulse?: string;
  guidedReflection?: {
    prompt: string;
    response: string;
  };
  freeWrite?: string;
  sentimentScore?: number; // -1 to 1
  moodAtTime: string; // mood when entry was written
  isResurfaceable: boolean; // true if moodAtTime valence > 0.3
  lastResurfacedAt?: string; // ISO date, null if never resurfaced
}
```

### Selection Algorithm
```javascript
function selectResurfacing(entries: JournalEntry[], currentMood: string): JournalEntry | null {
  // Only trigger on low-valence days
  if (MOOD_VALENCE[currentMood] > -0.2) return null;

  const candidates = entries.filter(e =>
    e.isResurfaceable &&
    daysSince(e.date) >= 5 && // not too recent
    (!e.lastResurfacedAt || daysSince(e.lastResurfacedAt) >= 14) && // not recently shown
    (e.freeWrite?.length > 20 || e.guidedReflection?.response?.length > 20) // has substance
  );

  if (candidates.length === 0) return null;

  // Prefer entries with the highest mood valence at time of writing
  // (the brightest moments are the most powerful to resurface)
  candidates.sort((a, b) =>
    MOOD_VALENCE[b.moodAtTime] - MOOD_VALENCE[a.moodAtTime]
  );

  return candidates[0];
}
```

---

## 8.2 PRESENCE GUARDIAN (Anti-Addiction System)

### Overview
The Presence Guardian is not a feature. It's a philosophy embedded into every screen. The app watches how long you've been inside and gently suggests the outside world when appropriate.

### Implementation

**Session Timer** (runs silently in AppContext):
```typescript
interface PresenceState {
  sessionStartTime: string; // ISO timestamp, set when app opens
  totalSessionMinutes: number; // computed from start
  checkInsToday: number; // count of mood check-ins today
  lastGentleNudge?: string; // ISO timestamp of last nudge
}
```

**Nudge Rules:**

| Condition | Message | Display Method |
|---|---|---|
| 10+ minutes continuous session | "You've been here a while. The world outside is also part of the journey." | Subtle text, fades in at bottom of current screen. Dismissable by scrolling or tapping. |
| 15+ minutes continuous session | "Maybe step outside for a moment. Cocoon will be here when you return." | Same style, slightly more prominent. |
| 3rd mood check-in in same day | "You've already checked in today. Trust what you felt." | Replaces the "How are you now?" text on home screen. Check-in still accessible but one extra tap away. |
| User opens app more than 5 times in a day | "You keep coming back today. Is something on your mind?" | Appears as a gentle prompt, leading to free journal (not a barrier). |

**Design rules:**
- Nudges are NEVER modals, NEVER pop-ups, NEVER blocking. They are ambient text that appears within the existing screen layout.
- Nudges use --cocoon-ash color (subtle, not alarming).
- Nudges are always dismissable with a single tap or scroll.
- No nudge appears more than once per session.
- The timer resets when the app goes to background for 5+ minutes.
- NEVER lock the user out. NEVER show a countdown. NEVER use language like "time's up." The user is always free. The nudge is a suggestion from a friend, not a parent.

### Éclosion Anti-Retention Message

When a butterfly emerges (cycle complete), the celebration screen includes:

```
[Butterfly animation, the user's colors, slow and sacred]

"Something real happened here."

"You can begin a new cycle whenever you're ready.
Or not. You don't need this app to keep growing.
What you built inside yourself is yours now."

[Two buttons:]
"Begin a new cycle" (pill button, mood-colored border)
"I'm good for now" (plain text link, equal visual weight to the cycle button)
```

If the user taps "I'm good for now," the app returns to a quiet home screen with their butterfly visible but no active cocoon. No re-engagement prompt. No "are you sure?" The app genuinely means it.

---

## 9. ANIMATION & INTERACTION SPEC

### Global Transitions
- **Page transitions**: Framer Motion `AnimatePresence` with fade + slight Y-axis shift (20px up, 300ms, spring)
- **Tab switching**: Crossfade only, no slide. 200ms duration.
- **Modal entry**: Slide up from bottom with spring physics (`damping: 25, stiffness: 300`)
- **Modal exit**: Slide down, slightly faster (`duration: 0.2s`)

### Mood Check-in
- Mood option buttons: on hover/tap, scale(1.05) + glow shadow appears (200ms)
- On selection: selected button pulses once (scale 1.0 → 1.1 → 1.0, 400ms)
- Unselected buttons fade to 0.3 opacity
- Background color transition: 2000ms ease, CSS transition on `--cocoon-glow`

### Ritual Completion
- Toggle circle: on tap, fills with mood color from center outward (300ms)
- Checkmark draws itself (SVG stroke-dashoffset animation, 400ms)
- Card gets a soft left border in mood color (appearing via width animation, 200ms)

### Journal
- Quick pulse submit: text ripples outward and fades (CSS animation, 600ms)
- Free journal expand: card grows to full screen (Framer Motion layout animation)

### Cocoon Progress (Weekly Summary)
- CSS-only animation. Keyframe-based.
- Dormancy: gentle opacity pulse (0.6 → 1.0 → 0.6, 4s infinite)
- Stirring: slight scale pulse added (0.98 → 1.02)
- Unraveling: subtle rotate added (0deg → 2deg → -2deg → 0deg, 6s)
- Reforming: glow intensifies (box-shadow grows, 4s)
- Emergence: clip-path reveal of "wing" shapes from behind cocoon silhouette

### Breathing Circle (Mood Check-in Stage 2)
```css
.breathing-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--cocoon-glow),
    rgba(var(--cocoon-glow-rgb), 0.2) 60%,
    transparent 80%
  );
  filter: blur(20px);
  animation: breath 8s ease-in-out infinite;
}

@keyframes breath {
  0%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.0);
    opacity: 0.8;
  }
}
```
- 4 seconds expand (0% → 50%), 4 seconds contract (50% → 100%)
- No labels. No "inhale/exhale" text. The circle IS the breath.
- After 2-3 full cycles, the "Feel like writing today?" text fades in below (opacity 0 → 1, 1.5s ease)

### Home Screen Gradient (The Proto-Orb)
```css
.ambient-gradient {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    var(--cocoon-glow),
    transparent 70%
  );
  filter: blur(30px);
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.9; }
}
```

---

## 10. WEEKLY SUMMARY

### Insight Generation Algorithm

```javascript
function generateInsights(week: WeeklySummaryData): string[] {
  const insights = [];

  // Mood correlation with journaling
  const journalDays = week.journalEntries.map(e => e.date);
  const moodOnJournalDays = week.moodEntries.filter(m => journalDays.includes(m.date));
  const moodOnNonJournalDays = week.moodEntries.filter(m => !journalDays.includes(m.date));
  if (avgValence(moodOnJournalDays) > avgValence(moodOnNonJournalDays) + 0.1) {
    insights.push(`You journaled ${journalDays.length} days this week. Your mood was lighter on those days.`);
  }

  // Ritual completion rate
  const rate = week.ritualCompletionRate;
  if (rate >= 0.8) {
    insights.push(`You completed ${Math.round(rate * 100)}% of your rituals. Your consistency is building something.`);
  } else if (rate < 0.4) {
    insights.push(`A quieter week for rituals. Sometimes rest is the ritual.`);
  }

  // Dominant mood
  const dominant = mostFrequent(week.moodEntries.map(e => e.mood));
  insights.push(`Your most present state this week: ${dominant}.`);

  // Mood direction
  const direction = computeDirection(week.moodEntries);
  if (direction === 'ascending') {
    insights.push(`Your emotional direction is shifting upward. Something is moving.`);
  }

  return insights.slice(0, 3); // max 3 insights
}
```

### Mood Wave Chart Spec (Recharts)
```jsx
<AreaChart data={weekMoods} width={340} height={160}>
  <defs>
    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={dominantMoodColor} stopOpacity={0.4} />
      <stop offset="100%" stopColor={dominantMoodColor} stopOpacity={0.05} />
    </linearGradient>
  </defs>
  <Area
    type="monotone"
    dataKey="valence"
    stroke={dominantMoodColor}
    strokeWidth={2}
    fill="url(#moodGradient)"
    dot={{ r: 4, fill: dominantMoodColor }}
  />
  <XAxis dataKey="day" hide />
  <YAxis hide />
</AreaChart>
```

---

## 11. VIVARIUM (Future Phase — Architecture Only)

### Concept
A social garden where you see your own butterflies (completed cycles) and friends' cocoons/butterflies.

### Data Model (plan ahead)
```typescript
interface VivariumProfile {
  userId: string;
  displayName: string;
  butterflies: {
    cycleId: string;
    intention: string; // "Found creative flow"
    color: string; // dominant cycle color
    ecloseDate: string;
  }[];
  activeCocoon?: {
    phase: string;
    dayCount: number;
    // NO mood data, NO journal data exposed
  };
  isVisible: boolean; // opt-in only
}

interface WarmthSignal {
  fromUserId: string;
  toUserId: string;
  timestamp: string;
  // No message. Just a glow.
}
```

### UI Notes
- Grid of floating elements (butterflies drift, cocoons pulse)
- Tap a friend's butterfly to see their intention label
- Tap a friend's cocoon to send "warmth" (single tap, no confirmation needed)
- Warmth received: the user's cocoon glows slightly warmer for 24 hours
- No feed. No comments. No metrics comparison.

---

## 12. FILE STRUCTURE

```
cocoon/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                    # Global styles, CSS variables, noise texture, fonts
│   │
│   ├── context/
│   │   ├── AppContext.jsx           # Main app state (user, mood, phase)
│   │   ├── ThemeContext.jsx         # Dynamic mood-based theming
│   │   └── AudioContext.jsx         # Audio engine state (Phase 3)
│   │
│   ├── hooks/
│   │   ├── useMood.js              # Mood check-in logic, history
│   │   ├── useRituals.js           # Ritual management, completion
│   │   ├── useJournal.js           # Journal entries CRUD
│   │   ├── useCycle.js             # Cocoon phase transitions
│   │   ├── useWisdom.js            # Quote selection engine
│   │   ├── useResurfacing.js       # "Your own words" resurfacing engine
│   │   ├── usePresenceGuardian.js  # Anti-addiction session awareness
│   │   ├── usePromptArc.js         # 21-day Repair Protocol prompt progression
│   │   ├── useWeeklySummary.js     # Summary computation
│   │   └── useAudio.js             # Tone.js controls (Phase 3)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx        # Main layout wrapper with bottom nav
│   │   │   ├── BottomNav.jsx       # Tab navigation (4 tabs)
│   │   │   └── ScreenTransition.jsx # AnimatePresence wrapper
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.jsx  # Orchestrates 7 onboarding screens
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── QuestionScreen.jsx  # Reusable single/multi-select question
│   │   │   ├── MoodSelectScreen.jsx # First mood capture
│   │   │   ├── TwentyOneDaysScreen.jsx # The neuroscience story moment
│   │   │   └── RitualSetupScreen.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── CocoonStateCard.jsx # The main visual (gradient → orb in Phase 5)
│   │   │   ├── MoodCheckinFlow.jsx # Full-screen 3-stage flow (mood → breathe → journal invite)
│   │   │   ├── BreathingCircle.jsx # CSS breathing animation, used in check-in and standalone
│   │   │   ├── TodayRituals.jsx    # Horizontal scroll ritual preview
│   │   │   └── WisdomFragment.jsx  # Contextual quote display
│   │   │
│   │   ├── journal/
│   │   │   ├── JournalScreen.jsx
│   │   │   ├── QuickPulse.jsx
│   │   │   ├── GuidedReflection.jsx
│   │   │   ├── ResurfacingCard.jsx  # "Your own words from a lighter day"
│   │   │   ├── FreeJournal.jsx
│   │   │   └── PastEntries.jsx
│   │   │
│   │   ├── rituals/
│   │   │   ├── RitualsScreen.jsx
│   │   │   ├── RitualCard.jsx
│   │   │   ├── RitualToggle.jsx    # Animated completion toggle
│   │   │   └── AddRitualSheet.jsx
│   │   │
│   │   ├── soundscape/
│   │   │   ├── SoundscapeScreen.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   └── AudioPlayer.jsx
│   │   │
│   │   ├── summary/
│   │   │   ├── WeeklySummary.jsx
│   │   │   ├── MoodWaveChart.jsx
│   │   │   ├── InsightCard.jsx
│   │   │   └── CocoonProgress.jsx  # Phase visualization
│   │   │
│   │   └── shared/
│   │       ├── GlowButton.jsx      # Primary action button with mood glow
│   │       ├── MoodOption.jsx      # Reusable mood selector button
│   │       ├── NoiseOverlay.jsx    # SVG grain texture overlay
│   │       ├── PresenceNudge.jsx   # Anti-addiction gentle nudge messages
│   │       └── FadeIn.jsx          # Simple Framer Motion fade wrapper
│   │
│   ├── data/
│   │   ├── wisdom.json             # Quote database
│   │   ├── rituals.json            # Default ritual pool
│   │   ├── moods.json              # Mood definitions + colors + valence
│   │   └── promptArc.json          # 21-day Repair Protocol prompt progression
│   │
│   ├── utils/
│   │   ├── storage.js              # localStorage/IndexedDB abstraction
│   │   ├── moodAlgorithm.js        # Valence computation, direction detection
│   │   ├── phaseTransition.js      # Cocoon phase logic
│   │   ├── insightGenerator.js     # Weekly insight generation
│   │   ├── wisdomSelector.js       # Contextual quote selection
│   │   ├── resurfacingSelector.js  # "Your own words" selection algorithm
│   │   └── promptArc.js            # 21-day Repair Protocol prompt progression logic
│   │
│   └── audio/                      # Phase 3
│       ├── engine.js               # Tone.js initialization
│       ├── modes/
│       │   ├── wake.js
│       │   ├── focus.js
│       │   ├── create.js
│       │   ├── move.js
│       │   └── rest.js
│       └── moodModifier.js         # Mood-reactive audio parameter shifts
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## CLAUDE CODE INSTRUCTIONS

When building this app, follow this exact sequence:

### Step 1: Project Setup
- Initialize Vite + React project
- Install: `framer-motion`, `recharts`, `lucide-react`
- Configure Tailwind with custom theme extending the Cocoon palette
- Set up CSS variables in index.css (all --cocoon-* variables)
- Add Google Fonts: Cormorant Garamond (400, 400i, 600), Outfit (300, 400, 600), JetBrains Mono (400)
- Add the noise texture SVG as a CSS pseudo-element on body

### Step 2: Data Layer
- Create all data files (wisdom.json, rituals.json, moods.json, promptArc.json)
- promptArc.json contains the full 21-day Repair Protocol prompt progression (5 phases, ~21 prompts)
- Build storage utility with get/set/clear
- Build AppContext with initial state structure matching the TypeScript interfaces above
- Build ThemeContext that updates CSS variables based on current mood
- Include PresenceState in AppContext (session timer, check-in count, nudge tracking)

### Step 3: App Shell
- Build AppShell with BottomNav (4 tabs: Home, Journal, Rituals, Soundscape)
- Tab icons: Home (circle icon), Journal (feather), Rituals (sunrise), Sound (headphones)
- Active tab: mood-colored indicator
- AnimatePresence for screen transitions

### Step 4: Onboarding
- Build all 7 onboarding screens following the spec exactly
- The "21 Days" screen (Screen 6) must have staggered text reveal with proper timing
- Store responses in AppContext
- Generate initial ritual list based on morning time/caffeine/sunlight answers
- Set initial mood and color theme
- Persist onboarding completion flag

### Step 5: Home Screen
- Build all home screen components
- The CocoonStateCard should start as a simple CSS gradient circle (the proto-orb)
- Build the 3-stage MoodCheckinFlow: mood selection → breathing space → journal invitation
- The BreathingCircle must use pure CSS (scale animation, 4s in / 4s out, ease-in-out)
- The "Feel like writing today?" appears after 2-3 breath cycles (~16-24s) with a gentle fade
- "Not today" is respected with zero guilt messaging
- Wire up WisdomFragment with contextual display rules
- Build Presence Guardian: session timer starts on app open, nudge messages appear at 10min/15min thresholds
- Nudges are ambient text within the existing layout, NEVER modals or pop-ups
- After 3rd daily check-in, soften the check-in button with "Trust what you felt" message

### Step 6: Journal
- Build all journal components
- Quick pulse with animation
- Guided reflection with 21-day prompt arc logic: select prompt based on day-in-cycle AND mood pattern overrides
- Day-in-cycle determines the Repair Protocol phase (Entry/Sensory/Agency/Reflection/Proof)
- Pattern overrides take priority when detected (e.g., same mood 4+ days overrides the day-based prompt)
- Build ResurfacingCard: "Your own words from a lighter day" display
- Resurfacing triggers when 2+ consecutive low-valence days + resurfaceable entry exists (5+ days old)
- Maximum one resurfacing per week. Framing is "This is also you" not "Look how far you've come"
- Free journal with auto-save
- Store moodAtTime and isResurfaceable flag on every journal entry
- Past entries list with mood color indicators

### Step 7: Rituals
- Build ritual cards with completion toggle animation
- Morning/evening toggle
- Drag-to-reorder (Framer Motion)
- Add ritual sheet with pool selection
- Streak calculation

### Step 8: Weekly Summary
- Build summary overlay
- Mood wave chart (Recharts)
- Insight generation
- Cocoon phase visualization (CSS-only)

### Step 9: Soundscape (Simplified for prototype)
- Mode selector UI (the 5 modes)
- For prototype: use Tone.js to generate simple ambient pads
- Wire mood state to audio parameters
- Play/pause/timer controls

### Step 10: Polish
- Review all animations match spec
- Ensure color transitions are smooth everywhere
- Test all state persistence
- Add phase transition logic
- Test full user journey from onboarding to weekly summary

---

## CRITICAL DO-NOTs FOR CLAUDE CODE

1. **DO NOT** use 3D/WebGL/Three.js for the orb. Use CSS gradients and blur. The orb comes last and should be purely CSS/SVG.
2. **DO NOT** add a dashboard or analytics view. This is not a data app.
3. **DO NOT** use bright colors, neon, or high-contrast elements. Everything is muted, organic, soft.
4. **DO NOT** add gamification language ("points", "level up", "achievement"). Use "phase", "cycle", "emergence".
5. **DO NOT** use toast notifications or snackbars. State changes are ambient (color shifts, subtle animations).
6. **DO NOT** add social features yet. The Vivarium is a future phase.
7. **DO NOT** use red for any negative state. Heavy moods use deep purple/indigo, not red.
8. **DO NOT** overcrowd screens. If in doubt, remove something.
9. **DO NOT** use confetti, fireworks, or celebratory animations. Even éclosion should feel sacred, not rewarding.
10. **DO NOT** build navigation drawers, hamburger menus, or settings pages beyond a simple gear icon modal.
11. **DO NOT** add push notifications for re-engagement. EVER. Ritual reminders are opt-in only. If a user stops opening the app, that might be the transformation working. No "we miss you" messages.
12. **DO NOT** use modals or pop-ups for the Presence Guardian nudges. They are ambient text within the existing layout, styled in --cocoon-ash, dismissable with a single tap.
13. **DO NOT** frame resurfaced journal entries with toxic positivity ("look how far you've come!", "you're doing great!"). The framing is neutral: "From a lighter day" and "This is also you."
14. **DO NOT** make the "Begin a new cycle" button visually dominant over "I'm good for now" after éclosion. Both options deserve equal visual weight. The app genuinely wants either choice.
