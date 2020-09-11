import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as CrossIcon } from 'images/video-close-cross.svg';
import { ReactComponent as PlayIcon } from 'images/video-unpause-play.svg';
import Player from '@vimeo/player';
import { Box, Loader } from '@makerdao/ui-components-core';

// Keeps aspect ratio of div
// credit: https://dabblet.com/gist/2590942
const AspectRatio = (() => {
  const StretchyWrapper = styled(Box)`
    width: 100%;
    position: relative;

    & > div {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  `;

  return ({ ratio, style, children, ...props }) => (
    <StretchyWrapper
      style={{ paddingBottom: `${ratio * 100}%`, ...style }}
      {...props}
    >
      {children}
    </StretchyWrapper>
  );
})();

const VideoCloseButton = styled(CrossIcon)`
  width: 45px;
  height: 45px;
  fill: white;
  cursor: pointer;
  transition: fill 0.2s;

  &:hover {
    fill: #bebebe;
  }
`;

const Video = styled.iframe`
  height: 56vw;
  max-height: 480px;
  width: 100%;
`;
// todo: calculate button top margins based on video top-margins, instead of hard-coding
const VimeoPlayerStyle = styled(Box)`
  user-select: none;

  .close-button-container {
    width: 100%;
    max-width: 853px;
    margin: calc(40vh - 140px) auto;
  }

  .close-button {
    float: right;
  }

  .video-container {
    display: inline;
    margin-top: calc(40vh - 85px);
    height: 56vw;
    max-height: 480px;

    @media (min-width: 853px) {
      /* max video width */
      margin-top: 130px;
    }
  }

  .video-overlay {
    position: absolute;
    background-color: transparent;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 854px;
    left: 50%;
    transform: translateX(-50%);
  }

  .paused-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
      height: 16%;
      width: 100px;
    }
  }

  .loading-screen {
    width: 100%;
    max-width: 850px;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    top: 2px;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 853px) {
    /* max video width */
    .close-button-container {
      margin-top: 75px;
    }
  }
`;

const VimeoPlayer = ({ showVideo, id, onCloseVideo }) => {
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const iframe = document.querySelector('#dai-video');
    if (!showVideo || !iframe) {
      return;
    }
    const player = new Player(iframe);
    setIsLoaded(false);
    setIsPaused(false);
    setPlayer(player);
    player.setVolume(0.3);
    player.on('ended', onCloseVideo);
    player.on('play', () => setIsLoaded(true));
    return () => {
      player.off('ended');
      player.off('play');
    };
  }, [showVideo, onCloseVideo]);

  const togglePause = () => {
    if (!player) {
      return;
    }
    if (isPaused) {
      player.play().then(() => {
        setIsPaused(false);
      });
    } else {
      player.pause().then(() => {
        setIsPaused(true);
      });
    }
  };

  return (
    <VimeoPlayerStyle
      position="fixed"
      width="100%"
      height="100%"
      bg={showVideo ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)'}
      zIndex="1000"
      style={{
        pointerEvents: showVideo ? 'unset' : 'none',
        top: 0,
        left: 0
      }}
    >
      {!showVideo ? null : (
        <AspectRatio ratio={510 / 780}>
          <div className="close-button-container">
            <Box className="close-button" onClick={onCloseVideo}>
              <VideoCloseButton />
            </Box>
          </div>
          <div className="video-container">
            {isLoaded && (
              <div className="video-overlay" onClick={() => togglePause()}>
                {isPaused && (
                  <div className="paused-overlay">
                    <PlayIcon />
                  </div>
                )}
              </div>
            )}
            <Video
              id="dai-video"
              className="video"
              src={`https://player.vimeo.com/video/${id}?portrait=0&byline=0&autoplay=1&controls=1`}
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            />
            <div className="loading-screen">
              <Loader
                className="spinner"
                size="50px"
                color="white"
                bg="rgba(0, 0, 0, 0.7)"
              />
            </div>
          </div>
        </AspectRatio>
      )}
    </VimeoPlayerStyle>
  );
};

export default VimeoPlayer;
