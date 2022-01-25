import { useRouteMatch } from 'react-router-dom';
import React, { useState, useRef } from 'react';

export default function useIsRecorder() {
  const isRecorder = React.useEffect(() => {
    //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
    let match = useRouteMatch('/room/recorder/:roomName');
  }, []);

  return {
    isRecorder,
  };
}
