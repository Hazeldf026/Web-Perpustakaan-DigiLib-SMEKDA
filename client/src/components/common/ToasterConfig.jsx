import { Toaster, ToastBar, toast } from 'react-hot-toast';

const ToasterConfig = () => {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{ 
        duration: 3000,
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center gap-2">
              {icon}
              <div className="text-sm font-bold text-gray-700">{message}</div>
              
              {/* Tombol X (Close) */}
              {t.type !== 'loading' && (
                <button 
                  onClick={() => toast.dismiss(t.id)} 
                  className="ml-3 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default ToasterConfig;