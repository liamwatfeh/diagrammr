# Diagrammr 3.0

A modern web application built with cutting-edge technologies for creating and managing diagrams.

## 🚀 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Frontend:** React 19
- **Styling:** Tailwind CSS 4
- **Database:** Supabase
- **Development:** ESLint for code quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (18.17 or later)
- npm, yarn, or pnpm package manager
- Git

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd diagrammr3.0
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your configuration values.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Development Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/          # Reusable React components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS modules
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
