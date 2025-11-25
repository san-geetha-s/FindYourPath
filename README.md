
# 🌟 **FindYourPath – Personalized Career Learning & Soft Skill Growth App**

FindYourPath is a personalized learning-path application that guides users through:

✔️ Career-specific resources
✔️ Step-by-step progress tracking
✔️ A powerful soft-skills training program
✔️ Reflection-based growth
✔️ Auto-generated completion certificates

The goal is not only to teach skills, but to **transform users through structured learning + emotional growth**.

---

# 🚀 **Features**

### 🎯 **1. Personalized Learning Path**

* User selects any career (Developer, Social Worker, Teacher, Designer, etc.)
* The app fetches:

  * Audiobooks
  * YouTube playlists
  * Courses
  * Articles
* Each resource has checkboxes for progress tracking.
* 100% completion unlocks soft-skills program.

---

### 🌱 **2. Soft Skills Training Program**

Your app includes:

* 15–20 **highly meaningful, actionable tasks**
* 5 career-specific tasks
* “Mark as Completed” progress system
* Automatic unlocking sequence
* Deep reflection writing option

---

### 🎉 **3. Congratulations Page**

After completing soft skills:

* Confetti animation
* Reflection submission
* Achievements card (task count, streak, career)
* Auto-generated downloadable certificate
* Share achievement button
* “Start New Journey” navigation

---

### 🎓 **4. Auto-Generated Certificate**

* Fully dynamic
* Adds:

  * User’s name
  * Selected career
  * Completion date
* Uses:

  * `pdf-lib`
  * Custom Canva-designed PNG background
* Certificate is downloaded through `/api/generateCertificate`

---

### 🔐 **5. Firebase Authentication + Firestore**

* Phone number login
* Auto-syncs:

  * User name
  * User career
  * Learning progress

---

### ✨ **6. Animated Splash Loader (Framer Motion)**

* Custom branded splash animation
* Smooth fade-in transitions
* Premium mobile-app feel

---

# 🛠️ **Tech Stack**

### **Frontend**

* Next.js 15 (App Router)
* React 18
* TailwindCSS
* Framer Motion
* LocalStorage for client-side progress

### **Backend**

* Next.js API Routes
* Firebase Auth
* Firebase Firestore

### **Certificate Generation**

* `pdf-lib`
* Custom certificate template PNG (placed in `/public/certificate-template.png`)

---

# 📁 **Folder Structure**

```
find-your-path/
│
├── app/
│   ├── learning-path/
│   ├── soft-skills/
│   ├── congratulations/
│   ├── api/
│   │   └── generateCertificate/
│   └── components/
│       ├── SplashLoader.jsx
│       └── ...
│
├── lib/
│   └── firebase.js
│
├── public/
│   └── certificate-template.png
│
├── package.json
├── README.md
└── tailwind.config.js
```

---

# ⚙️ **Environment Variables**

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
```

---

# 🧪 **How Certificate API Works**

### 1️⃣ Client calls:

```js
const res = await fetch("/api/generateCertificate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, career }),
});
```

### 2️⃣ API Route:

* Loads `certificate-template.png`
* Draws name, career, date at exact coordinates
* Returns a downloadable PDF Blob

---

# 🎨 **Custom Certificate Template**

 created a Canva certificate with placeholders:

* **“name here”**
* **“[Course Title]”**
* **“[Date]”**

After uploading to `/public/`, the API replaces these fields automatically.

---

# 🔄 **Splash Loader Integration**

In every page needing loading state:

```jsx
if (loading) return <SplashLoader appName="FindYourPath" />;
```

---

# 💡 **Future Improvements**

* Email certificate directly to user
* Add premium subscription
* Add profile dashboard
* Add personality test → suggest careers
* Add habit tracking section

---

# ❤️ **Why This App Is Special**

This is not just a learning app.

This app:

* builds identity
* builds confidence
* builds emotional strength
* helps users transform

