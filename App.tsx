import React, { useState, useEffect } from 'react';
import { Gift, Utensils, Heart, Sparkles, Gamepad2, Snowflake, PenLine, Film, Wallet } from 'lucide-react';
import ToolCard from './components/ToolCard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GiftIdeas from './components/GiftIdeas';
import MealPlanner from './components/MealPlanner';
import BudgetPlanner from './components/BudgetPlanner';
import ElfIdeas from './components/ElfIdeas';
import KidsActivities from './components/KidsActivities';
import DateNightIdeas from './components/DateNightIdeas';
import PoemWriter from './components/CardWriter';
import MoviePlanner from './components/MoviePlanner';
import DecoratingIdeas from './components/DecoratingIdeas';
import Pricing from './components/Pricing';
import AuthModal from './components/Auth/AuthModal';
import ProfilePage from './components/Profile/ProfilePage';
import EmailVerification from './components/EmailVerification';
import ContactForm from './components/ContactForm';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { UserPlanProvider } from './contexts/UserPlanContext';
import { useAuth } from './contexts/AuthContext';

const tools = [
  {
    icon: <Gift className="w-8 h-8 text-red-600" />,
    title: "AI Gift Ideas",
    description: "Get personalized gift suggestions based on your loved ones' interests and preferences.",
    comingSoon: false,
    component: "GiftIdeas",
    toolType: "gift"
  },
  {
    icon: <Film className="w-8 h-8 text-red-500" />,
    title: "Movie Night Planner",
    description: "Get personalized Christmas movie recommendations and themed snack suggestions.",
    comingSoon: false,
    component: "MoviePlanner",
    toolType: "movie"
  },
  {
    icon: <Heart className="w-8 h-8 text-red-600" />,
    title: "Date Night Ideas",
    description: "Discover romantic Christmas date ideas tailored to your interests and location.",
    comingSoon: false,
    component: "DateNightIdeas",
    toolType: "date"
  },
  {
    icon: <Utensils className="w-8 h-8 text-green-600" />,
    title: "Christmas Meal Planner",
    description: "Plan your perfect Christmas feast with AI-generated menu suggestions and recipes.",
    comingSoon: false,
    component: "MealPlanner",
    toolType: "meal"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    title: "Elf on the Shelf",
    description: "Creative and fun hiding spots for your Elf on the Shelf to surprise your kids.",
    comingSoon: false,
    component: "ElfIdeas",
    toolType: "elf"
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-blue-500" />,
    title: "Kids Activities",
    description: "Fun Christmas activities and crafts to keep your little ones entertained.",
    comingSoon: false,
    component: "KidsActivities",
    toolType: "activity"
  },
  {
    icon: <Snowflake className="w-8 h-8 text-green-600" />,
    title: "Decorating Ideas",
    description: "Transform your home with AI-generated Christmas decoration suggestions.",
    comingSoon: false,
    component: "DecoratingIdeas",
    toolType: "decoration"
  },
  {
    icon: <PenLine className="w-8 h-8 text-purple-600" />,
    title: "Christmas Poem Writer",
    description: "Create festive Christmas poems with AI-powered verse generation.",
    comingSoon: false,
    component: "PoemWriter",
    toolType: "poem"
  },
  {
    icon: <Wallet className="w-8 h-8 text-emerald-600" />,
    title: "Budget Planner",
    description: "Stay on track with your holiday spending using our AI-powered budget planning tool.",
    comingSoon: false,
    component: "BudgetPlanner",
    toolType: "budget"
  }
];

const ToolsGrid: React.FC<{ setActiveComponent: (component: string | null) => void }> = ({ setActiveComponent }) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {tools.map((tool, index) => (
        <div key={index} onClick={() => tool.component && setActiveComponent(tool.component)}>
          <ToolCard {...tool} />
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (activeComponent) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeComponent]);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'GiftIdeas':
        return <GiftIdeas />;
      case 'MealPlanner':
        return <MealPlanner />;
      case 'DateNightIdeas':
        return <DateNightIdeas />;
      case 'ElfIdeas':
        return <ElfIdeas />;
      case 'KidsActivities':
        return <KidsActivities />;
      case 'BudgetPlanner':
        return <BudgetPlanner />;
      case 'PoemWriter':
        return <PoemWriter />;
      case 'MoviePlanner':
        return <MoviePlanner />;
      case 'DecoratingIdeas':
        return <DecoratingIdeas />;
      case 'Pricing':
        return <Pricing setActiveComponent={setActiveComponent} />;
      case 'Profile':
        return <ProfilePage />;
      case 'Contact':
        return <ContactForm />;
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <UserPlanProvider>
        <ActivityProvider>
          <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
            <Navbar 
              isMenuOpen={isMenuOpen} 
              setIsMenuOpen={setIsMenuOpen} 
              setActiveComponent={setActiveComponent}
              onAuthClick={() => setShowAuthModal(true)}
            />
            
            <main className="container mx-auto px-4 pt-32">
              {user && !user.emailVerified && <EmailVerification user={user} />}
              
              {!activeComponent && <Hero setActiveComponent={setActiveComponent} />}
              
              {activeComponent ? (
                <div className="mt-6">
                  <button
                    onClick={() => setActiveComponent(null)}
                    className="mb-6 text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    ← Back to Tools
                  </button>
                  {renderActiveComponent()}
                </div>
              ) : (
                <ToolsGrid setActiveComponent={setActiveComponent} />
              )}

              {!activeComponent && (
                <section className="mt-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Make This Christmas Special</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Our AI-powered tools are here to help you create unforgettable Christmas memories. 
                    From perfect gifts to magical moments, we've got everything you need to make this 
                    holiday season truly special.
                  </p>
                </section>
              )}
            </main>

            <footer className="bg-red-900 text-white py-8 mt-20">
              <div className="container mx-auto px-4 text-center">
                <p className="mb-2">© 2024 Christmas AI Helper</p>
                <p className="text-red-200">Spreading Christmas joy with a little help from AI</p>
                <button
                  onClick={() => setActiveComponent('Contact')}
                  className="mt-4 text-white hover:text-red-200 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </footer>

            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </ActivityProvider>
      </UserPlanProvider>
    </AuthProvider>
  );
}

export default App;