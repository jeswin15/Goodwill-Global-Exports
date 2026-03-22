# Project Setup Guide

This guide provides step-by-step instructions to set up and run the **Rest Express** application on a new computer.

## 1. Prerequisites

Before starting, ensure the following software is installed on your computer:

*   **Node.js**: REQUIRED. Version 20 or higher is recommended.
    *   [Download Node.js here](https://nodejs.org/) (Choose the "LTS" version).
    *   To verify installation, open a terminal (Command Prompt or PowerShell) and run: `node -v`
*   **Git**: Required if you are cloning the repository.
    *   [Download Git here](https://git-scm.com/downloads).
*   **VS Code**: Recommended code editor.
    *   [Download VS Code here](https://code.visualstudio.com/).

## 2. Installation

1.  **Download the Project**:
    *   Clone the repository using Git:
        ```bash
        git clone <your-repository-url>
        ```
    *   **OR** Download and extract the ZIP file of the project code.

2.  **Open in Terminal**:
    *   Navigate to the project folder where `package.json` is located.
    *   Right-click inside the folder and select "Open in Terminal" (or use VS Code terminal).

3.  **Install Dependencies**:
    *   Run the following command to download all required packages:
        ```bash
        npm install
        ```

## 3. Configuration (Important!)

You need to set up environment variables for the email system to work.

1.  **Create the `.env` file**:
    *   In the root folder (same place as `package.json`), create a new file named `.env`.

2.  **Add Credentials**:
    *   Open `.env` in a text editor and paste the following:

    ```env
    # Application Port (Optional, defaults to 5000)
    PORT=5000

    # Email System Configuration (REQUIRED for forms to work)
    EMAIL_USER=jeswinalbert15@gmail.com
    EMAIL_PASS=your-16-digit-app-password
    
    # Database (Optional - App runs in memory mode without this)
    # DATABASE_URL=postgresql://user:password@localhost:5432/dbname
    ```

3.  **How to get the `EMAIL_PASS`**:
    *   **Do NOT use your regular Gmail password.**
    *   Go to your [Google Account Security settings](https://myaccount.google.com/security).
    *   Enable **2-Step Verification** if it isn't already.
    *   Search for **App Passwords**.
    *   Create a new App Password (name it "Website") and copy the 16-character code.
    *   Paste that code into `EMAIL_PASS` in your `.env` file.

## 4. Running the Application

1.  **Start the Development Server**:
    *   Run the command:
        ```bash
        npm run dev
        ```

2.  **Access the Website**:
    *   Open your browser and go to: [http://localhost:5000](http://localhost:5000)

## 5. Troubleshooting

*   **"DATABASE_URL not set" warning**:
    *   This is normal. The application will automatically switch to "Memory Mode" and work perfectly fine without a database.
    
*   **Email not sending?**:
    *   Check the terminal logs for error messages.
    *   Verify your `EMAIL_PASS` in `.env` is correct.
    *   Ensure you are using an **App Password**, not your login password.

*   **Port 5000 already in use?**:
    *   Change the `PORT` in your `.env` file to something else (e.g., `PORT=3000`) and restart.

## 6. Build for Production (Optional)

If you want to build the optimized version of the app:

1.  Run build command:
    ```bash
    npm run build
    ```
2.  Start production server:
    ```bash

## 7. Hosting Requirements (Tech Stack)

When checking with a hosting provider, ensure they support the following:

*   **Runtime**: **Node.js** (Version 20 or higher).
*   **Frontend**: **React** (v19) + **Vite** (Static site generation or Single Page App serving).
*   **Backend**: **Express.js** (v5).
*   **Database** (Optional): **PostgreSQL** (only if you want persistent data).
    *   *Note: The app runs fine without a database (using memory storage) for simple use cases.*
*   **Email**: **SMTP Support** (Outbound port 587 or 465 for Gmail/Outlook/etc).

## 8. Project Folder Structure

A quick overview of the main files and folders:

```
Pasted-Assets/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (buttons, inputs, etc.)
│   │   ├── hooks/          # Custom React hooks (e.g., use-toast)
│   │   ├── lib/            # Utility functions (e.g., queryClient)
│   │   ├── pages/          # Application pages (Home, Products, Contact, etc.)
│   │   ├── App.tsx         # Main application component & routing
│   │   └── main.tsx        # Entry point for React
│   └── index.html          # Main HTML file
│
├── server/                 # Backend (Express + Node.js)
│   ├── email.ts            # Email sending logic (Nodemailer config)
│   ├── index.ts            # Server entry point & usage
│   ├── routes.ts           # API endpoints (handle requests from frontend)
│   └── storage.ts          # Database interface (Memory or PostgreSQL)
│
├── shared/                 # Code shared between frontend & backend
│   └── schema.ts           # Database schema & type definitions
│
├── public/                 # Static assets (images, fonts, etc.)
├── .env                    # Environment variables (API keys, passwords)
├── package.json            # Project dependencies and scripts
## 9. Deployment (GitHub)

If the automatic push fails, you can manually push the code to your repository:

1.  **Open Terminal** in the project folder.
2.  **Run the following commands**:

    ```bash
    git remote set-url origin https://github.com/jeswin15/Pasted-Asserts.git
    git push -u origin main
    ```

3.  **Authentication**:
    *   If prompted, log in with your GitHub credentials.
    *   If you use 2FA, you might need a Personal Access Token instead of your password.

4.  **"Git is not recognized" Error?**:
    *   If you see this error, it means you need to restart your terminal or VS Code to reload the settings.
    *   **OR** try running this command instead:
        ```powershell
        & "C:\Program Files\Git\cmd\git.exe" push -u origin main
        ```

