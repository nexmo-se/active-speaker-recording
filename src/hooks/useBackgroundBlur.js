import * as VideoEffects from '@vonage/video-effects';

import { useCallback, useRef } from 'react';

const { isSupported, BackgroundBlurEffect } = VideoEffects;

export default function useBackgroundBlur() {
  const backgroundBlur = useRef(null);
  const localMediaTrack = useRef(null);
  const getUserMedia = useCallback(async () => {
    try {
      const track = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      localMediaTrack.current = track;
      // return track;
    } catch (e) {
      console.log('OT get user media error ' + e);
    }
  }, []);

  const startBackgroundBlur = async () => {
    await getUserMedia();
    backgroundBlur.current = new BackgroundBlurEffect({
      assetsPath: process.env.REACT_APP_ASSETS_PATH
    });
    await backgroundBlur.current.loadModel();
    const outputStream = backgroundBlur.current.startEffect(
      localMediaTrack.current
    );
    return outputStream;
  };

  const destroyTracks = () => {
    if (localMediaTrack.current) {
      localMediaTrack.current.getTracks().forEach((t) => t.stop());
    }
  };

  /* const isVideoEffectSupported = () => {
    console.log('isVideoEffectSupported', isSupported);
    return isSupported;
  }; */

  return {
    startBackgroundBlur,
    destroyTracks,
    isSupported
  };
}
