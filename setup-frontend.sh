#!/bin/bash

# SolGalaxy Frontend Setup Script

echo "🚀 Starting SolGalaxy Frontend Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js $(node -v) found"

# Navigate to app directory
cd app

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "⚙️  Creating .env.local file..."
    cat > .env.local << EOF
VITE_APP_RPC_URL=https://api.devnet.solana.com
VITE_APP_API_URL=http://localhost:8080/api
EOF
    echo "✓ .env.local created"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Start the development server:"
echo "     npm run dev"
echo ""
echo "  2. Open http://localhost:3000 in your browser"
echo ""
echo "  3. Connect your Solana wallet (Phantom, Solflare, or Torus)"
echo ""
echo "  4. Start exploring NFTs!"
echo ""
echo "🔗 Available commands:"
echo "  npm run dev       - Start development server"
echo "  npm run build     - Build for production"
echo "  npm run preview   - Preview production build"
echo "  npm run lint      - Run ESLint"
echo ""
