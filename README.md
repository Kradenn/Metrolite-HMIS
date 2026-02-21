
# UltraHub HMIS - System Documentation
**Version:** 3.2.0  
**Framework:** React 19 (TypeScript)  
**Styling:** Tailwind CSS  

---

## 1. Executive Summary
UltraHub HMIS is a high-density, enterprise-grade Hospital Management Information System designed for modern healthcare facilities. It unifies clinical workflows, revenue cycle management, supply chain, and administrative controls into a single, modular interface. The application prioritizes speed, data density, and keyboard accessibility for power users.

## 2. Technical Architecture

### 2.1 Core Stack
*   **Frontend Engine:** React 19 (Functional Components, Hooks).
*   **Language:** TypeScript (Strict typing for Interfaces: `Patient`, `User`, `Bill`, etc.).
*   **Routing:** React Router v7 (`HashRouter` implementation for static deployment compatibility).
*   **Styling:** Tailwind CSS (Utility-first, with custom configuration for `slate` and `indigo` themes).
*   **AI Integration:** Google Gemini API (via `@google/genai` SDK) for clinical scribing, audits, and predictive analytics.
*   **Icons:** FontAwesome 6.

### 2.2 Global State Management (Context API)
The application avoids Redux/Zustand in favor of React Context for lightweight state propagation:
1.  **`UserContext`**: Manages authentication, active user profile, theme (Dark/Light), and branch context.
2.  **`PatientContext`**: The core clinical session state. Stores the currently selected `activePatient` object, allowing seamless switching between Triage, Consultation, and Billing without losing patient context.
3.  **`ModuleContext`**: A robust Feature Flag system. Controls the visibility of modules (Clinical, ERP, HR) and sub-modules via `GlobalModuleState`. Configuration is persisted to `localStorage`.
4.  **`NotificationContext`**: Global toast notification system for success/error alerts.
5.  **`HospitalContext`**: Stores global facility metadata (Name, Address, Logo).
6.  **`SecurityContext`**: Manages RBAC (Role-Based Access Control) and Privilege Matrices.

---

## 3. Directory Structure & Key Files

```text
/
├── index.html              # Entry point (Tailwind CDN, Font imports)
├── index.tsx               # App bootstrapper & Context Providers
├── App.tsx                 # Main Route Definitions
├── components/
│   ├── Layout.tsx          # Main Shell (Sidebar + TopNav + Content Area)
│   ├── Sidebar.tsx         # Dynamic navigation based on ModuleContext
│   ├── TopNav.tsx          # Global search, User profile, Notifications
│   ├── QueueModal.tsx      # Standardized patient movement modal
│   ├── PatientSelector.tsx # Global patient lookup modal
│   └── DictationButton.tsx # AI Voice-to-Text component
├── context/                # Context API definitions (see section 2.2)
├── modules/
│   ├── Dashboard.tsx       # Main Landing (Widgets, Shortcuts, Todos)
│   ├── Clinical/           # OPD, IPD, Triage, Consultation, Nursing
│   ├── Billing/            # Invoices, Receipts, Gate Pass
│   ├── Pharmacy/           # POS, Dispensing, Direct Sales
│   ├── Diagnostics/        # Lab, Radiology, Theatre
│   ├── HR/                 # Employee mgmt, Payroll, Rosters
│   ├── Inventory/          # Stock, Procurement, LPOs
│   └── Configurations/     # System settings, Module toggles
└── services/
    └── geminiService.ts    # AI API wrappers
```

---

## 4. Key Functional Modules

### 4.1 Clinical Suite
*   **OPD & IPD Management:** Real-time census views, bed management, and admission/discharge workflows.
*   **Consultation:** SOAP note interface with AI-assisted clinical decision support (CDS) and smart order sets.
*   **Nursing Station:** Vitals tracking, Input/Output monitoring, and eMAR (Electronic Medication Administration Record).
*   **Triage:** Acuity scoring (1-5) and vital signs history.

### 4.2 Revenue Cycle (Billing)
*   **Invoicing:** Generation of bills linked to price lists and payer schemes (Insurance/Cash).
*   **Smart Africa Integration:** Placeholder for biometric insurance verification.
*   **KRA eTIMS:** Tax compliance module with AI auditing capabilities.

### 4.3 Diagnostics
*   **Laboratory:** Test ordering, result entry with reference ranges, and verification queues.
*   **Radiology:** DICOM node configuration, request management, and reporting.
*   **Theatre:** Surgery scheduling, WHO Safety Checklist digitization, and operative notes.

### 4.4 Supply Chain
*   **Pharmacy:** Point of Sale (POS), prescription dispensing, and stock level monitoring.
*   **Procurement:** Supplier management, LPO generation, and Goods Received Notes (GRN).
*   **Inventory:** Multi-store management, stock takes, and internal consumption logs.

---

## 5. AI Features (Gemini Integration)
The system leverages Google's Gemini models (specifically `gemini-3-flash-preview`) for:
1.  **Clinical Scribe:** Converts dictated notes into structured medical text.
2.  **Clinical Audit:** Analyzes billing items against diagnosis to detect missed revenue or compliance risks.
3.  **Inventory Intelligence:** Analyzes consumption patterns to suggest reorder levels.
4.  **Telehealth Summary:** Summarizes virtual patient encounters.

**Configuration:**
AI features require a valid API Key in `process.env.API_KEY`. The system handles API failures gracefully with fallback UI states.

---

## 6. UI/UX Standards
*   **Modals:** Consistent "Inpatient Hub" styling for all popups (dark headers, rounded corners).
*   **Data Grids:** High-density tables with sticky headers and row actions.
*   **Navigation:** Hierarchical sidebar with search filtering.
*   **Responsiveness:** Collapsible sidebar and fluid grids for tablet/desktop usage.

---

## 7. Security Model
*   **Authentication:** Mock implementation supports Standard, OTP, and Biometric flows.
*   **Authorization:** Granular privilege mapping to Roles.
*   **Audit Trails:** User actions (Login, Bill Finalization, Medical Record Updates) are logged.

---

## 8. Deployment & Setup
1.  Ensure `Node.js` is installed.
2.  Set `process.env.API_KEY` with a valid Google Gemini API Key.
3.  Run via a React development server (e.g., Vite or CRA).
4.  The application expects a DOM element with `id="root"`.

```bash
# Example Build Command
npm install
npm run build
```
