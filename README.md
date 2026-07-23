# AI Resume & Portfolio Builder

**Live Demo:** [https://atspilot.netlify.app/](https://atspilot.netlify.app/)

A modern, single-page web application that lets users fill out a step-by-step form in plain English and instantly generates a professional resume (with multiple templates, PDF download) and a personal portfolio webpage — all from the same data.

## Features

- **Step-by-Step Builder:** Easy-to-use form to collect your personal info, experience, education, and skills.
- **Instant Resume Generation:** Preview your professional resume in real-time.
- **Multiple Templates:** Choose from different design templates to suit your style.
- **PDF Download:** Export your resume as a clean, properly formatted PDF using `html2pdf.js`.
- **Portfolio Generation:** Instantly turn your resume data into a beautiful personal portfolio webpage.
- **Client-Side Only:** Fast, secure, and private. All data is saved locally in your browser's `localStorage` — no backend required.
- **Modern Design:** Built with a dark-mode-first approach, glassmorphism effects, and smooth animations.

## Tech Stack

This project is built using modern web standards without heavy frameworks:

- **Structure:** HTML5 (Semantic and SEO-friendly)
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, CSS Grid, Keyframe Animations)
- **Logic:** Vanilla JavaScript (ES Modules, DOM Manipulation)
- **PDF Generation:** [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Fonts:** Google Fonts (Inter & Space Grotesk)
- **Icons:** Lucide Icons

## Getting Started

Since this is a client-side only application without any build steps, getting started is incredibly simple!

### Prerequisites

All you need is a modern web browser.

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/resume-builder.git
   ```
2. Navigate to the project directory:
   ```bash
   cd resume-builder
   ```
3. Open `index.html` in your favorite web browser. You can just double-click the file, or use a local server (like Live Server in VS Code) for a better development experience:
   ```bash
   # If using python
   python -m http.server 8000
   
   # Or using npx
   npx serve .
   ```

## Architecture

The application is structured as a Single Page Application (SPA) where different "pages" (Landing, Form, Resume, Portfolio) are shown or hidden using JavaScript.

```
Resume Builder/
├── index.html              # Single HTML entry point
├── css/                    # Stylesheets broken down by component
│   ├── variables.css       # Design tokens (colors, fonts, etc.)
│   ├── base.css            # Reset and global styles
│   ├── landing.css         
│   ├── form.css            
│   ├── resume.css          
│   ├── portfolio.css       
│   └── responsive.css      
└── js/                     # Application logic
    ├── app.js              # Main controller and routing
    ├── form.js             # Form handling and validation
    ├── resume.js           # Resume rendering
    ├── portfolio.js        # Portfolio rendering
    ├── pdf.js              # PDF export functionality
    ├── ai.js               # Content suggestions
    └── storage.js          # localStorage management
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/resume-builder/issues).

## License

This project is open source and available under the [MIT License](LICENSE).
