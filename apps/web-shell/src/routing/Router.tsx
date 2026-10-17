import React, { useEffect, useState } from 'react';
import { routes } from './routes.config';
import { RouteGuard } from './RouteGuard';

export function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const matchedRoute = routes.find(route => {
    if (route.exact) return route.path === currentPath;
    return currentPath.startsWith(route.path);
  }) || routes[0]; // Fallbacks to root if no path matches

  return (
    <RouteGuard 
      component={matchedRoute.component} 
      requiredRoles={matchedRoute.requiredRoles} 
    />
  );
}