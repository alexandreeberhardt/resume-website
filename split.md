Role: Senior React Developer
Context: I am building a CV Generator using React, TailwindCSS, and dnd-kit. Currently, my App.tsx renders all sections (Personal, Education, Experience, etc.) at once on a single dashboard, which is overwhelming for the user.

Task: Refactor `App.tsx` to implement a Multi-Step Wizard flow (Stepper) to improve UX.

Current Code Provided:
- `App.tsx` (Current monolithic component)
- `types.ts` (Data structures)

Requirements:

1. State Management:
   - Introduce a `currentStep` state (number) to track progress.
   - Keep the main `data` state (ResumeData) at the top level so data persists between steps.

2. Flow Structure:
   - Step 0 (Landing Page): Show ONLY the `PersonalSection` component.
   - Steps 1 to N: Iterate through the dynamic sections (Education, Experience, Projects, etc.) one by one. The user should focus on one section type at a time.
   - Final Step (Review & Export): Show the "Dashboard" view (similar to the current existing layout). This is the ONLY place where the `DndContext` (drag and drop reordering) and the "Generate PDF" button should appear.

3. Navigation Controls:
   - Add a fixed footer or navigation bar containing:
     - "Back" button (hidden on Step 0).
     - "Continue" / "Next" button.
     - On the Final Step, show the "Generate PDF" button.

4. UI Improvements:
   - Add a Progress Bar at the top indicating how far along the user is.
   - The design should be clean and focused.

5. Technical Constraints:
   - Reuse the existing `updateSection`, `addSection`, `deleteSection` functions.
   - Ensure the `handleGenerate` and `handleImport` functions still work.
   - Use Lucide-react icons where appropriate.

Please provide the full refactored code for `App.tsx`.
