<!-- 🎛 Dial effort: medium, נקבע עם /effort medium לפני ההרצה -->

<!-- 📄 Data first -->
<data>
    @src/components/DetailPane.tsx
    @src/lib/details.ts
</data>

<!-- 🎭 Give a role -->
<role>
  עכשיו אתה מפתח React + TypeScript
</role>

<!-- 🧾 Brief once -->
<brief>
    המשתמש יראה את מספר שורות הטקסט שיש בקובץ כדי שיוכל לזהות מה אורך הקובץ
    קבצי בטקסט הם: 
    .txt (קובץ טקסט רגיל)
    .html, .htm (קובץ דף אינטרנט)
    .css (קובץ עיצוב אתרים)
    .js (קובץ JavaScript)
    .ts (קובץ TypeScript)
    .py (קובץ Python)
    .json (קובץ נתונים)
    .xml (קובץ נתונים מבני)
    .yaml, .yml (קובץ הגדרות ותצורות)
    .csv (קובץ נתונים טבלאיים מופרדים בפסיקים)
    .md (קובץ Markdown לתיעוד)
    .log (קובץ יומן רישום אירועים)
    .ini, .cfg, .conf (קבצי הגדרות מערכת ותוכנה)
    .env (קובץ משתני סביבה)
    .sql (קובץ שאילתות ובסיסי נתונים)
    .sh, .bat (קבצי סקריפט והפעלה)
    - הפונקציה שסופרת שורות תהיה ב-src/lib/details.ts, בלי React.
    - בלי ספריות חדשות. לא לשנות את שאר הפרטים שכבר מוצגים.
    - בקבצים שהם לא טקסט (למשל תמונות), לא מציגים שורות בכלל.
    - אם תמצא באגים אחרים, ציין אותם בסיכום ואל תתקן אותם.
    Done when:
    - יש טסטים לפונקציה החדשה ב-src/lib, כולל כל הדוגמאות למטה.
    - npm run check ירוק.
    - בדפדפן, כשלוחצים על קובץ טקסט, מופיעה בחלונית הפרטים שורה כמו "Lines: 32".
</brief>

<!-- 📋 Multishot -->
<examples>
- קובץ ריק ""                → Lines: 0
- "שלום" (בלי ירידת שורה)    → Lines: 1
- "א\nב\nג"                  → Lines: 3
- "א\nב\nג\n" (ירידת שורה בסוף) → Lines: 3
- תמונה beach.jpg             → אין שורת Lines
</examples>

<!-- 🎯 Be specific + 🏷 XML structure: כל הפרומפט -->
<task>
להוסיף ספירת שורות לקבצי טקסט: פונקציה חדשה ב-src/lib/details.ts שסופרת שורות,
ושורה "Lines" ב-src/components/DetailPane.tsx.
</task>

//Bugs I found but didn't fix, as the brief asked
  1. An error never clears. In DetailPane.tsx, error isn't reset when you click a different file. After one file fails to
     load, every file after it shows the same error.
  2. The previous file stays on screen while the next one loads. loaded also isn't reset when you click a different file, so
     you see the old file's details until the new ones arrive, not "Loading…".
  3. .ts files show the wrong type. Their "Type" field says video/mp2t (the browser's guess) instead of something like
     TypeScript.//