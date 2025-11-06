# ReadMeForge
<img width="1904" height="951" alt="Screenshot 2025-11-06 191813" src="https://github.com/user-attachments/assets/6c7bd3aa-1103-4b63-8d50-75a5dd759668" />
AI-Powered README Generation for Your GitHub Repositories.

## Overview

ReadMeForge is a web application that leverages artificial intelligence to automatically generate comprehensive and professional `README.md` files for your GitHub projects. Simply provide your repository URL, and the AI will analyze your codebase to create a well-structured README, saving you time and effort in documentation.

## Features

*   **AI-Powered Generation**: Automatically analyzes your GitHub repository content to generate a tailored `README.md`.
*   **GitHub Integration**: Easily fetch repository details and code snapshots.
*   **Interactive Preview**: View the generated README in both rendered Markdown and raw Markdown formats.
*   **Copy & Download**: Quickly copy the README content to your clipboard or download it as a `.md` file.
*   **Configurable API Keys**: Securely manage your Gemini API key and GitHub Personal Access Token (PAT) to avoid rate limits.
*   **Responsive Design**: A clean and intuitive user interface accessible on various devices.

## Technologies Used

ReadMeForge is built with a modern web stack, ensuring a robust and responsive user experience:

*   **Frontend**:
    *   **React**: A JavaScript library for building user interfaces.
    *   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    *   **Vite**: A fast build tool for modern web projects.
*   **Backend/API Integration**:
    *   **Google Gemini API**: Powers the AI-driven README generation.
    *   **GitHub API**: Used to fetch repository information and code.
*   **Deployment**:
    *   (Placeholder - e.g., Vercel, Netlify, Render)

## Getting Started

Follow these instructions to set up and run ReadMeForge locally for development or to understand its structure.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended)
*   **npm** or **Yarn** (package manager)
*   A **GitHub Account** (to generate a Personal Access Token)
*   A **Google Cloud Account** (to obtain a Gemini API Key)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ReadMeForge.git
    cd ReadMeForge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

ReadMeForge requires API keys to function correctly. You'll need to set these up as environment variables.

1.  **Create a `.env` file** in the root of your project directory:
    ```
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_GITHUB_PAT=your_github_personal_access_token_here
    ```

2.  **Obtain your Gemini API Key:**
    *   Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create a new API key for your project.

3.  **Generate a GitHub Personal Access Token (PAT):**
    *   Go to your GitHub settings: `Settings > Developer settings > Personal access tokens > Tokens (classic)`.
    *   Click "Generate new token (classic)".
    *   Give it a descriptive name (e.g., `ReadMeForge-PAT`).
    *   For scopes, select at least `repo` (to access public and private repos) or `public_repo` (for public repos only).
    *   Copy the generated token immediately, as you won't be able to see it again.

### Running the Application

Once configured, you can start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).


## Usage

Using ReadMeForge is straightforward:

1.  **Enter GitHub Repository URL**: On the homepage, paste the full URL of the GitHub repository you want to document (e.g., `https://github.com/facebook/react`).
2.  **Configure API Keys (if not already set)**: If you haven't configured your API keys in the `.env` file, the application will prompt you to enter them securely via the UI. These are stored locally in your browser's storage for convenience and security.
3.  **Generate README**: Click the "Generate README" button. The AI will analyze your repository and generate the content.
4.  **Review and Edit**: The generated README will appear in an interactive preview. You can switch between rendered Markdown and raw Markdown views.
5.  **Copy or Download**:
    *   Click "Copy to Clipboard" to easily paste the README into your GitHub repository.
    *   Click "Download .md" to save the README as a file to your local machine.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feedback, or need support, feel free to:

*   Open an issue on the [GitHub repository](https://github.com/your-username/ReadMeForge/issues).
*   (Optional: Add your email or a link to your personal website/social media)

<!-- END_OF_README -->
