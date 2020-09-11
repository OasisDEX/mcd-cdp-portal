import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as CrossIcon } from 'images/video-close-cross.svg';
import Player from '@vimeo/player';
import { Box } from '@makerdao/ui-components-core';

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

  @media (min-width: 853px) {
    /* max video width */
    .close-button-container {
      margin-top: 75px;
    }
  }
`;

const VimeoPlayer = ({ showVideo, id, onCloseVideo }) => {
  useEffect(() => {
    const iframe = document.querySelector('#dai-video');
    if (!showVideo || !iframe) {
      return;
    }
    const player = new Player(iframe);
    player.setVolume(0.3);
    player.on('ended', onCloseVideo);
    return () => {
      player.off('ended');
    };
  }, [showVideo, onCloseVideo]);

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
            <Video
              id="dai-video"
              className="video"
              src={`https://player.vimeo.com/video/${id}?portrait=0&byline=0&autoplay=1&controls=1`}
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            />
          </div>
        </AspectRatio>
      )}
    </VimeoPlayerStyle>
  );
};

export default VimeoPlayer;
