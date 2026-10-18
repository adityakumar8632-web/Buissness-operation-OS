import React, { useEffect, useRef } from 'react';
import { getSandboxAttributes } from './sandbox.iframe';

interface PluginHostProps {
  pluginId: string;
  sourceUrl: string;
  title: string;
}

export const PluginHost: React.FC<PluginHostProps> = ({ pluginId, sourceUrl, title }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Host-side listener for SDK messages
    const handlePluginMessage = (event: MessageEvent) => {
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

      const { type, payload, messageId } = event.data;

      switch (type) {
        case 'GET_CONTEXT':
          // Safely return non-sensitive context
          event.source.postMessage({
            messageId,
            payload: { userId: 'current_user', theme: 'light' }
          }, { targetOrigin: '*' });
          break;
        case 'SHOW_TOAST':
          console.log(`[Plugin ${pluginId} Toast]:`, payload.message);
          event.source.postMessage({ messageId, payload: { success: true } }, { targetOrigin: '*' });
          break;
        default:
          event.source.postMessage({ messageId, error: 'Unsupported method' }, { targetOrigin: '*' });
      }
    };

    window.addEventListener('message', handlePluginMessage);
    return () => window.removeEventListener('message', handlePluginMessage);
  }, [pluginId]);

  return (
    <div className="plugin-container w-full h-full border rounded bg-gray-50 overflow-hidden">
      {/* Embed container rendering third-party micro-frontend apps inside the OS interface[cite: 3]. */}
      <iframe
        ref={iframeRef}
        src={sourceUrl}
        title={title}
        className="w-full h-full border-0"
        {...getSandboxAttributes()}
      />
    </div>
  );
};