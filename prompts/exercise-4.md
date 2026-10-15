<!-- 🎛 Effort: medium, נקבע עם /effort -->

<!-- 🎯 מטרה  -->
Goal:
    קבצים מעל  10mb מציגים תגית קטנה "large" קטנה בעץ<!-- 💡 הסיבה -->
Why:
    מכיוון שקבצים גדולים נפתחים באיטיות ותופסים מקום בדיסק, כך שהמשתמש יכול להבחין בהם לפני שהוא לוחץ.
<!-- 📏 כלל עם סיבה (במקום CRITICAL / MUST) -->
Rules:
  Rules:
  תראה תגית קטנה "Large" כאשר הקובץ מעל 10 MB, כי קבצים גדולים איטיים לפתיחה
  ותופסים מקום, וככה המשתמשת רואה אותם לפני שהיא לוחצת.
  "מעל 10 MB" פירושו יותר מ-10 × 1024 × 1024 בתים.
  הסטייל יהיה רק דרך tokens.css כדי שתהיה אחידות.
<!-- 🚧 היקף -->
Scope:
    הפונקציה שבודקת אם קובץ גדול תהיה ב-src/lib, בלי React.
  לא להוסיף ספריות חדשות.
  אם תמצא באגים אחרים תכתוב אותם בשורת סיכום ואל תתקן אותם

<!-- ✅ בדיקה שאפשר להריץ (במקום double-check) -->
Done when:
    - יש טסטים לפונקציה החדשה ב-src/lib.
    - npm run check ירוק.
    - בדפדפן, כשלוחצים על קובץ טקסט גדול מ 10mb , מופיע בעץ תגית ״large"  לציין שהקובץ גדול



//Other bugs found (not fixed):
  - formatBytes divides by 1000 at each step but the badge uses 1024, so the size shown doesn't line up with the badge. A
    10,400,000-byte file shows as "10.4 MB" in the details pane but gets no badge.
  - In FolderItem, if loading a folder fails, the error stays and the folder retries the load every time it's opened, with no
    way to clear the error.//