import React, { useEffect, useState } from 'react';

import cn from 'classnames';
import { EventEmitter } from 'eventemitter3';

const messageCenter = new EventEmitter();

export function Message() {
  const [messageContent, setMessageContent] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    messageCenter.on('message', ({ content }: { content: string }) => {
      if (timer) {
        window.clearTimeout(timer);
        setTimer(0);
      }
      setActive(true);
      setMessageContent(content);
      const t = setTimeout(() => {
        setActive(false);
      }, 1200);
      setTimer(t);
    });
  }, [timer]);
  return (
    <div className={cn('pm-message', active && 'active')}>{messageContent}</div>
  );
}

export function showMessage(content: React.ReactNode) {
  messageCenter.emit('message', { content });
}
