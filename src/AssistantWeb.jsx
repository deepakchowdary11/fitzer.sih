import React from 'react';

export default function AssistantWeb() {
  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0b1220' }}>
      <iframe
        title="AI Fitness Assistant Web"
        src="/assistant.html"
        style={{ border: 'none', width: '100%', height: '100%' }}
        allow="camera; microphone; clipboard-read; clipboard-write;"
      />
    </div>
  );
}


