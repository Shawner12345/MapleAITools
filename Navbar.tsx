import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, Settings, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/firebase';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setActiveComponent: (component: string | null) => void;
  onAuthClick: () => void;
}

interface NavLinkProps {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
  >
    {children}
  </a>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="block text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
  >
    {children}
  </a>
);

const Navbar: React.FC<NavbarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  setActiveComponent,
  onAuthClick
}) => {
  const { user } = useAuth();
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Create 20 snowflakes with random positions
    const flakes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random position across width (%)
      delay: Math.random() * 3 // Random delay for natural effect
    }));
    setSnowflakes(flakes);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setActiveComponent(null); // Redirect to homepage
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="nav-container w-full">
        {/* Snowfall Effect */}
        <div className="snowfall">
          {snowflakes.map(flake => (
            <div
              key={flake.id}
              className="snowflake"
              style={{
                left: `${flake.left}%`,
                animation: `fall 3s linear infinite`,
                animationDelay: `${flake.delay}s`
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Mobile Container */}
        <div className="md:hidden container mx-auto px-4">
          <div className="flex justify-between items-center h-[100px]">
            <div className="flex items-center">
              <div 
                onClick={() => setActiveComponent(null)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img 
                  src="https://i.postimg.cc/kgn7v4bK/Blitzen-AI-Logo-proto-transparent.png"
                  alt="Blitzen AI" 
                  className="h-16 object-contain"
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Container - Full Width */}
        <div className="hidden md:block w-full px-8">
          <div className="flex justify-between items-center h-[100px]">
            <div className="flex items-center">
              <div 
                onClick={() => setActiveComponent(null)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img 
                  src="https://i.postimg.cc/kgn7v4bK/Blitzen-AI-Logo-proto-transparent.png"
                  alt="Blitzen AI" 
                  className="h-16 object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveComponent('GiftIdeas')}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Gift className="w-5 h-5" />
                Try Free
              </button>
              <NavLink onClick={() => setActiveComponent('Pricing')}>Pricing</NavLink>
              <NavLink onClick={() => setActiveComponent('Contact')}>Contact</NavLink>
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveComponent('Profile')}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <span className="text-gray-600">
                      {user.displayName || user.email}
                    </span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <MobileNavLink onClick={() => {
              setActiveComponent('GiftIdeas');
              setIsMenuOpen(false);
            }}>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Try Free
              </div>
            </MobileNavLink>
            <MobileNavLink onClick={() => {
              setActiveComponent('Pricing');
              setIsMenuOpen(false);
            }}>
              Pricing
            </MobileNavLink>
            <MobileNavLink onClick={() => {
              setActiveComponent('Contact');
              setIsMenuOpen(false);
            }}>
              Contact
            </MobileNavLink>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setActiveComponent('Profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors py-2"
                >
                  <Settings className="w-5 h-5" />
                  {user.displayName || user.email}
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors py-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;