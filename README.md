<<<<<<< HEAD
<![CDATA[# 🏛️ University Department Dashboard

> A modern, role-based university department management system built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Features a full RBAC (Role-Based Access Control) login system with 5 distinct user roles, department CRUD operations, CSV import/export, and a polished glassmorphism UI.

---

## 📸 Key Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Authentication** | 5 distinct user roles with granular permissions |
| 🏢 **Department Management** | Full CRUD — Create, Read, Update, Delete departments |
| 📊 **Dashboard Analytics** | Faculty/student counts, programs, courses, research stats |
| 📥 **CSV Import/Export** | Bulk department data operations (Admin roles only) |
| 👥 **User Management** | View and manage department users |
| 🎨 **Modern UI** | Glassmorphism design, Framer Motion animations, responsive layout |
| 🔍 **Search & Filter** | Filter departments by status, building, and keyword |
| 📱 **Responsive Design** | Fully responsive — works on desktop, tablet, and mobile |

---

## 🔑 Login Credentials

All demo accounts use the **same password**: **`password123`**

| Role | Email | Password | Access Level |
|---|---|---|---|
| 🛡️ **Super Admin** | `superadmin@university.edu` | `password123` | Full system control — all CRUD + delete + import/export |
| 🏫 **University Admin** | `admin@university.edu` | `password123` | All departments CRUD + import/export |
| 👨‍🏫 **Department Head** | `head@university.edu` | `password123` | Edit own department (CS) only |
| 👩‍🔬 **Faculty** | `faculty@university.edu` | `password123` | Read-only access to own department (CS) |
| 🎓 **Student** | `student@university.edu` | `password123` | Basic read-only access to all departments |

> **💡 Tip:** On the login page, you can either type the credentials manually **or** click any of the **"Demo Quick Sign-In"** role buttons to auto-fill and log in instantly.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Action | Super Admin | University Admin | Department Head | Faculty | Student |
|---|:---:|:---:|:---:|:---:|:---:|
| View All Departments | ✅ | ✅ | ❌ (own only) | ❌ (own only) | ✅ |
| Create Department | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Department | ✅ (all) | ✅ (all) | ✅ (own only) | ❌ | ❌ |
| Delete Department | ✅ | ✅ | ❌ | ❌ | ❌ |
| Import/Export CSV | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Department Users | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) with TypeScript |
| **Build Tool** | [Vite 7](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **State Management** | React Context API + [TanStack React Query v5](https://tanstack.com/query) |
| **Animations** | [Framer Motion v12](https://www.framer.com/motion/) |
| **Charts** | [Recharts v2](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend API** | REST API at `https://university-dashboard-backend-9t0x.onrender.com` |

---

## 📁 Project Structure

```
src/
├── app/                          # App entry point & routing
│   ├── App.tsx                   # Root component with routes & ProtectedRoute
│   ├── App.css                   # Global app styles
│   └── main.tsx                  # React DOM render entry
│
├── components/                   # Shared reusable components
│   ├── layout/
│   │   ├── AppShell.tsx          # Main layout wrapper (sidebar + content)
│   │   └── Sidebar.tsx           # Navigation sidebar
│   └── ui/
│       ├── Badge.tsx             # Status badge component
│       ├── Button.tsx            # Reusable button component
│       ├── Card.tsx              # Card container component
│       ├── Field.tsx             # Form field component
│       └── Modal.tsx             # Modal dialog component
│
├── features/                     # Feature-based modules
│   ├── auth/                     # 🔐 Authentication module
│   │   ├── api/
│   │   │   └── auth.ts           # Login/logout API calls + mock fallback
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Auth state provider (user, token)
│   │   ├── pages/
│   │   │   └── LoginPage.tsx     # Login page with demo role quick sign-in
│   │   └── utils/
│   │       └── permissions.ts    # RBAC permission helper functions
│   │
│   ├── departments/              # 🏢 Department management module
│   │   ├── api/                  # Department API calls
│   │   ├── components/           # Department-specific UI components
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── DepartmentCard.tsx
│   │   │   ├── DepartmentForm.tsx
│   │   │   ├── DepartmentHeader.tsx
│   │   │   ├── DepartmentStats.tsx
│   │   │   ├── DepartmentTable.tsx
│   │   │   ├── DepartmentTabs.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── data/                 # Mock/seed department data
│   │   └── pages/                # Department page views
│   │       ├── DepartmentCreatePage.tsx
│   │       ├── DepartmentDetailsPage.tsx
│   │       ├── DepartmentEditPage.tsx
│   │       ├── DepartmentListPage.tsx
│   │       └── DepartmentUsersPage.tsx
│   │
│   └── users/                    # 👥 User management module
│       └── api/                  # User API calls
│
├── lib/
│   └── utils.ts                  # Shared utility functions
│
├── services/
│   └── api.ts                    # Base API configuration
│
├── types/                        # TypeScript type definitions
│   ├── department.ts             # Department types & filters
│   └── user.ts                   # User, UserRole & pagination types
│
├── index.css                     # Tailwind CSS imports & custom theme
├── index.html                    # HTML entry point
├── main.tsx                      # Alternate entry bootstrap
└── vite-env.d.ts                 # Vite environment types
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **yarn** / **pnpm**)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Xebia-Internship.git
cd Xebia-Internship-main

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be running at **http://localhost:5173/**

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## 🔌 Backend API

The frontend proxies all `/api` requests to the backend server:

```
https://university-dashboard-backend-9t0x.onrender.com
```

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/login` | `POST` | Authenticate user (email + password) |
| `/api/v1/departments` | `GET` | Fetch all departments |
| `/api/v1/departments/:id` | `GET` | Fetch single department details |
| `/api/v1/departments` | `POST` | Create a new department |
| `/api/v1/departments/:id` | `PUT` | Update a department |
| `/api/v1/departments/:id` | `DELETE` | Delete a department |

> **⚠️ Note:** If the backend server is cold (inactive on Render free tier), the first request may take 30–60 seconds to spin up. The app includes a **mock authentication fallback** that works offline — so you can still log in and explore the UI even if the backend is unavailable.

---

## 📄 Application Routes

| Route | Page | Auth Required |
|---|---|---|
| `/login` | Login Page | ❌ |
| `/departments` | Department List (Dashboard) | ✅ |
| `/departments/new` | Create New Department | ✅ (Admin+ only) |
| `/departments/:id` | Department Details | ✅ |
| `/departments/:id/edit` | Edit Department | ✅ (Admin/Head only) |
| `/departments/users` | Department Users List | ✅ |

---

## 🎨 Design Highlights

- **Glassmorphism UI** — Frosted-glass card effects with backdrop blur
- **Animated transitions** — Powered by Framer Motion for smooth page & component animations
- **Gradient accents** — Primary purple gradient (`#6C1D5F` → `#84117C`) for brand identity
- **Responsive sidebar** — Collapsible navigation with role-aware menu items
- **Interactive data tables** — Sortable, filterable department lists with card/table toggle views
- **Status indicators** — Color-coded active/inactive badges throughout the UI

---

## 🧪 Testing

A basic auth test script is included:

```bash
node test-auth.js
```

This sends a POST request to the backend login endpoint with `admin@university.edu` / `password123` to verify the API is responding.

---

## 📋 Scripts

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start Vite dev server with HMR |
| **Build** | `npm run build` | TypeScript check + production build |
| **Preview** | `npm run preview` | Preview the production build locally |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project was developed as part of the **Xebia Internship Program**.

---

<p align="center">
  Built with ❤️ using React + TypeScript + Vite
</p>
]]>
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
>>>>>>> 61f050716a10c44381a3fd29e857e9d359f4ac95
