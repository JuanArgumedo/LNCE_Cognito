import { Link, useLocation } from "wouter";
import { useAuth } from "../contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold text-primary cursor-pointer">LNCE</h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-accent'
                  }`}>
                    Inicio
                  </a>
                </Link>
                <Link href="/news">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive('/news') ? 'text-primary' : 'text-gray-700 hover:text-accent'
                  }`}>
                    Noticias
                  </a>
                </Link>
                
                {isAuthenticated && user?.role === 'administrador' && (
                  <Link href="/admin">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive('/admin') ? 'text-primary' : 'text-gray-700 hover:text-accent'
                    }`}>
                      Gestión
                    </a>
                  </Link>
                )}
                
                {isAuthenticated && user?.role === 'comunidad' && (
                  <Link href="/community">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive('/community') ? 'text-primary' : 'text-gray-700 hover:text-accent'
                    }`}>
                      Gestión Comunidad
                    </a>
                  </Link>
                )}
                
                {isAuthenticated && (
                  <Link href="/monitoring">
                    <a className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive('/monitoring') ? 'text-primary' : 'text-gray-700 hover:text-accent'
                    }`}>
                      Monitoreo
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Bienvenido, {user?.name}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-primary text-white hover:bg-primary/90 transition-all duration-300" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
