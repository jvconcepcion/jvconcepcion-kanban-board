# My Kanban Board

## Description
This project is a fully functional, interactive Kanban board built with Next.js and TypeScript, designed to meet the specifications of the technical assessment. It features robust drag-and-drop functionality, state persistence to local storage, search and filtering, and several custom enhancements.

## Approach and Key Technical Decisions
The primary goal was to build a clean, maintainable, and robust application by making deliberate technical choices.

- Framework: Next.js with the Pages Router was chosen. Its file-based routing and built-in API routes (pages/api) provided a straightforward and efficient way to set up the mocked API endpoint required by the assessment.
- Language: TypeScript was used throughout the project to ensure type safety, which helps prevent common errors, improves code quality, and provides a superior developer experience with autocompletion and static analysis.
- Styling: Tailwind CSS was used exclusively for styling. This utility-first approach allowed for rapid UI development and made implementing a responsive, mobile-first design straightforward and maintainable.
- Drag & Drop: @dnd-kit was selected for all drag-and-drop interactions. It was chosen for being a modern, lightweight, and highly performant library. Its deep customization options for sensors and collision detection strategies (pointerWithin) were crucial for achieving a smooth, intuitive, Trello-like user experience.
- Project Structure: A clear, top-level folder structure (/components, /store, /types) was implemented. This approach maintains clarity and simplicity, which is ideal for the scale of this project, avoiding unnecessary nesting.

## State Management: Why Zustand?
**Zustand** was chosen as the state management library for this project.
The core challenge of this application is managing client-side UI state—the positions of tickets, the current theme, search terms, etc. While React Query is an excellent library, it is specifically designed for managing server state (caching, re-fetching, and synchronizing data with an API).

Since this project only loads initial data once from a mock API and then handles all subsequent state changes locally, Zustand was the ideal choice for several reasons:

- Simplicity: Its API is minimal and intuitive, feeling much like a global useState hook. This makes it very easy to grasp and use without extensive boilerplate.
- Lightweight: It has a very small bundle size and adds minimal complexity to the project.
- Perfect Fit for Client State: It excels at managing shared state that lives entirely within the application, which is exactly what this Kanban board required.
- Built-in Middleware: The persist middleware made saving the entire board state to local storage incredibly simple and declarative.

## **Twist** Feature

- **Dark Mode Toggle**: A theme switcher was added to the header, allowing users to toggle between a light and a dark mode. This is a common accessibility and user preference feature that enhances the usability of the application in different lighting conditions.
- **WIP (Work-In-Progress) Limits**: Each column has a configurable limit on the number of tickets it can contain. If a user attempts to drag a ticket into a column that is already full, the move is prevented and the user is notified. This mimics a core concept in Agile and Kanban methodologies designed to prevent bottlenecks and improve workflow.

## How to Run the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/jvconcepcion/jvconcepcion-kanban-board.git
   cd jvconcepcion-kanban-board
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app should now be running at `http://localhost:3000`.

## How to Run the Tests
Unit tests have been added for the core application logic using the industry-standard Jest testing framework with React Testing Library. The tests focus on validating the actions within the Zustand store, including:

- Ticket movement between columns.
- Ticket reordering within the same column.
- State updates from the search filter.

1. **To run the test**
```sh
npm install
```