import { Link } from "wouter";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-blog text-2xl text-primary mr-3"></i>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BlogAI
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Create AI-enhanced content with smart suggestions, improved readability, and trending topic discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/new-post" className="text-muted-foreground hover:text-primary transition-colors">
                  New Post
                </Link>
              </li>
              <li>
                <Link href="/my-posts" className="text-muted-foreground hover:text-primary transition-colors">
                  My Posts
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="#"
                className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="#"
                className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} BlogAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
