# Contributing to Chigma

Thank you for your interest in contributing to **Chigma**!

## Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Shezan-op/chigma.git
   cd chigma
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Test Suite**:
   ```bash
   npm test
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Architecture Guidelines
- **Offline & Local-First**: All state, vector nodes, tokens, and files must function 100% in the browser runtime with zero cloud dependencies.
- **Deterministic Vectors**: Render graphical elements through clean, sub-pixel accurate native SVG nodes.
- **Design Tokens**: Adhere to the design system in `DESIGN_SYSTEM.md` and 8px spacing grid.
- **Testing**: Add Vitest tests in `src/tests/` for every new engine, tool, or export module.
