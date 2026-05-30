import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('wl_cookie_consent');
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('wl_cookie_consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      date: new Date().toISOString(),
    }));
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('wl_cookie_consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      date: new Date().toISOString(),
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Main banner */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            
            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="text-2xl flex-shrink-0">🍪</div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  We use cookies
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  WanderLog uses cookies to keep you logged in, remember your preferences, 
                  and improve your experience. By continuing to use our site, you agree to our use of cookies.{' '}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-primary underline hover:no-underline"
                  >
                    {showDetails ? 'Hide details' : 'Learn more'}
                  </button>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={handleNecessaryOnly}
                className="px-4 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Necessary only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-xl hover:bg-primary/80 transition-colors whitespace-nowrap"
              >
                Accept all
              </button>
            </div>
          </div>

          {/* Details section */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Necessary */}
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">Necessary</span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Always on</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Required for the site to work. Includes your login session (JWT token) stored in localStorage.
                  </p>
                </div>

                {/* Functional */}
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">Functional</span>
                    <span className="text-xs text-primary font-semibold bg-primary-light/40 px-2 py-0.5 rounded-full">Optional</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Remembers your preferences such as search filters, selected tabs, and UI settings.
                  </p>
                </div>

                {/* Analytics */}
                <div className="flex-1 bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">Analytics</span>
                    <span className="text-xs text-primary font-semibold bg-primary-light/40 px-2 py-0.5 rounded-full">Optional</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Helps us understand how users interact with the app to improve the experience.
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
