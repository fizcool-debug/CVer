# CVer — ATS-Friendly CV Builder

CVer is a cross-platform desktop application built with **Electron**, **React**, and **Vite** that enables users to build high-scoring, ATS-friendly resumes in real-time. It features a Windows 11 Mica-style dark theme interface, responsive preview scaling, and native A4 PDF generation with selectable text.

---

## 🌟 Key Features

*   **Real-Time ATS Compatibility Engine**:
    *   **Proper Noun Keyword Matcher**: Dynamically parses target job descriptions for technical keywords and proper nouns (e.g., `React`, `TypeScript`, `Kubernetes`, `ServSafe`), compares them case-insensitively to your resume content, and displays missing keywords.
    *   **Action Verbs Check**: Scans achievements for strong lead verbs (e.g., *Engineered*, *Optimized*, *Spearheaded*) and flags passive language.
    *   **Metrics Validator**: Scans bullet points for quantitative values (percentages, dollar amounts, figures) to ensure business impact proof.
*   **Proportional A4 Live Preview**:
    *   A pixel-accurate simulation of the final printed page using a fixed A4 canvas ratio (`800px` x `1130px`).
    *   Resizes dynamically using a `ResizeObserver` and CSS `transform: scale(S)` to ensure text lines, margins, and layouts never shift or wrap differently under different window dimensions.
    *   No inner scrollbars inside the A4 canvas.
*   **Selectable PDF Exports**:
    *   Uses Electron's native Chrome printing engine (`webContents.printToPDF`) to produce searchable, selectable-text PDFs. ATS parsers read this natively, bypassing standard canvas-based export blockages.
*   **Frameless Fluent UI**:
    *   Windows 11 Mica backdrop integration (translucent visual theme).
    *   Dynamic frame configurations (translucent on Windows, solid flat fallback on Linux to guarantee zero compositor double-titlebar bugs).
    *   Custom Titlebar and window controls (minimize, maximize, close).

---

## 🚀 Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS recommended).

### Setup Steps
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/dietro/cver.git
    cd cver
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    This concurrently launches the Vite dev server and the Electron wrapper, starting the application in hot-reload mode.

---

## 📦 Packaging & Installation Guide

We provide a built-in automated script [package-all.sh](package-all.sh) to compile native installers for both Windows and Linux.

### 🐧 Linux (AppImage, deb, rpm)

#### 1. Compilation Prerequisites
If you are compiling native Debian (`.deb`) or RedHat/Fedora (`.rpm`) installers on Linux, you need to ensure system dependencies are met.

*   **On Fedora/CentOS/RHEL** (Required to compile the `.rpm` package):
    ```bash
    # Install compatibility library for the internal fpm compiler
    sudo dnf install libxcrypt-compat
    # Install native rpmbuild utility
    sudo dnf install rpm-build
    ```
*   **On Ubuntu/Debian** (Required to compile the `.deb` package):
    ```bash
    # Install packaging dependencies
    sudo apt-get install rpm
    ```

#### 2. Building the Installers
Compile the Linux target executables by running:
```bash
./package-all.sh
```
This outputs the compiled files to the `dist-electron/` folder:
*   `cver-1.0.0.x86_64.rpm` (Native Fedora/RedHat installer)
*   `cver_1.0.0_amd64.deb` (Native Debian/Ubuntu installer)
*   `CVer-1.0.0.AppImage` (Portable standalone executable)

#### 3. Installation
*   **On Fedora Linux**:
    ```bash
    sudo dnf install dist-electron/cver-1.0.0.x86_64.rpm
    ```
*   **On Debian/Ubuntu/Mint**:
    ```bash
    sudo dpkg -i dist-electron/cver_1.0.0_amd64.deb
    ```
*   **Portable Running**:
    Right-click `CVer-1.0.0.AppImage`, select *Properties* -> *Permissions* -> *Allow executing file as program*, then double-click to run.

---

## 🪟 Windows (NSIS Setup Wizard)

#### 1. Building the Installer
If you are on Windows, or packaging using a Wine configuration on Linux, compile the installer by running:
```bash
./package-all.sh --win
```
This generates the Windows setup executable inside `dist-electron/`:
*   `CVer Setup 1.0.0.exe`

#### 2. Installation
Double-click `CVer Setup 1.0.0.exe`. The setup wizard will launch:
1.  Click **Next** and choose your installation directory.
2.  The wizard will install CVer, register the program in your system, and automatically add:
    *   A **Desktop Shortcut**
    *   A **Start Menu Shortcut**

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

