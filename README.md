# DevEase - Your Go-To Toolbox for All Things Tech

A modern web application built with Next.js that provides a collection of essential development tools to streamline your workflow.

🌐 **[Visit DevEase](https://devease.app)**

![DevEase](src/app/cover.png?raw=true 'DevEase')

## 🚀 Features

- 💻 **Technical Features**
  - Server-side rendering with Next.js 14
  - Type safety with TypeScript
  - Responsive design with Tailwind CSS
  - Dark mode support
  - Google Analytics integration
  - Performance monitoring with Vercel Analytics

- 🛠️ **Development Tools**
  - JSON formatter with epoch timestamp tooltips (hover over numbers to see formatted timestamps)
  - SQL formatter
  - JWT decoder
  - Password generator
  - UUID generator
  - Base64 encoder/decoder
  - Epoch converter

## 🔧 Prerequisites

Before you begin, ensure you have installed:

- Node.js (version 18 or higher)
- npm, yarn, or pnpm
- Docker (optional, for containerized deployment)

## 🏗️ Installation

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/mgoyal98/dev-ease.git
cd dev-ease
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t dev-ease .
```

2. Run the container:

```bash
docker run -p 3000:3000 dev-ease
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── [categoryId]/      # Dynamic category routes
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── common/                # Shared utilities and constants
│   ├── constants/         # Application constants
│   ├── enums/            # TypeScript enums
│   ├── interfaces/       # TypeScript interfaces
│   └── utils/            # Utility functions
├── components/           # Reusable React components
└── tools/               # Individual tool implementations
```

## 🛠️ Development

This project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **Next.js** for the framework
- **Docker** for containerization
- **Vercel** for deployment

### Available Scripts

```bash
# Development
npm run dev         # Start development server

# Building
npm run build      # Create production build
npm run start      # Start production server

# Docker
docker build -t dev-ease .    # Build Docker image
docker run -p 3000:3000 dev-ease    # Run Docker container

# Code Quality
npm run lint       # Run ESLint
npm run format     # Run Prettier
```

## 🌟 Support

If you find this project helpful, please consider:

- Giving it a star on GitHub ⭐
- Sharing it with others 🗣️
- [Buying me a coffee ☕](https://razorpay.me/@mgoyal)

## 📫 Quick Links

- 🏠 [DevEase Website](https://devease.app)
- 💻 [GitHub Repository](https://github.com/mgoyal98/dev-ease)
- 🐛 [Issue Tracker](https://github.com/mgoyal98/dev-ease/issues)

## 📫 Contact

- Website: [devease.app](https://devease.app)
- GitHub: [@mgoyal98](https://github.com/mgoyal98)
- LinkedIn: [Madhur Goyal](https://linkedin.com/in/madhur-goyal)
- Personal Website: [mgoyal.com](https://mgoyal.com)

## Questions or Feedback?

If you have any questions, issues, or suggestions, feel free to open a GitHub [issue]<https://github.com/mgoyal98/dev-ease/issues>. Thank you for using DevEase!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
