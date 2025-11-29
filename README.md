# CRM Solar House

A comprehensive Customer Relationship Management (CRM) system designed for Solar House operations. This application is built with modern web technologies to streamline administrative tasks, manage products, generate quotations, and handle file organization efficiently.

## 🚀 Features

- **Admin Dashboard**: Centralized hub for monitoring and managing system activities.
- **Product Management**: Create, update, and manage solar products and inventory.
- **Quotation System**: Generate professional quotations for clients (integrated with PDF generation).
- **File Management**: Organize and manage important documents and files.
- **Conditions Management**: Manage terms and conditions or specific operational parameters.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Database**: MySQL (via `mysql2`)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📦 Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **MySQL**: A running MySQL database instance.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd crmsolarhouse
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Configuration:**

    Create a `.env.local` file in the root directory and configure your database connection and other environment variables.

    ```env
    # Example .env.local
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=crmsolarhouse
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
crmsolarhouse/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin panel routes (Dashboard, Products, Quotations, etc.)
│   │   ├── api/            # API routes for backend logic
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Home page
│   ├── components/         # Reusable UI components
│   ├── lib/                # Library code (e.g., database connections)
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── .env.local              # Environment variables (not committed)
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
