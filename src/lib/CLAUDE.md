# src/lib conventions
<!-- מוסכמות שחשובות רק בתיקייה הזו -->

- Every exported function gets a test in a sibling *.test.ts file.
  <!-- לכל פונקציה טסט, בקובץ טסט שיושב לידה -->
- Keep functions pure: take everything they need as parameters
  (including "now" for time), and return a value instead of changing state.
  <!-- פונקציות "טהורות": מקבלות הכול כפרמטר ומחזירות תוצאה, ככה קל לבדוק -->
- Formatting helpers live in format.ts; file-detail helpers live in details.ts.
  <!-- מה יושב באיזה קובץ, כדי שלא ייצור קבצים חדשים סתם -->
- Sizes are numbers in bytes; turn them into text only in format.ts.
  <!-- גדלים תמיד בבתים, ורק format.ts הופך אותם לטקסט -->