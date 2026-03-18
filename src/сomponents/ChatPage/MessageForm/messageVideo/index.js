import React from "react";
import Linkify from 'linkify-react';
import MicrolinkCard from "@microlink/react";
import getUrls from "get-urls";
import "./index.css";

export const MessageVideo = ({ video }) => (
  <>
    {video !== null && video !== undefined ? (
      <video controls="controls" width="200px">
        <source
          src={`http://chat.fs.a-level.com.ua/${video[0].url}`}
          type="video/mp4"
        />
        <source
          src={`http://chat.fs.a-level.com.ua/${video[0].url}`}
          type="video/ogg"
        />
        <source
          src={`http://chat.fs.a-level.com.ua/${video[0].url}`}
          type="video/webm"
        />
      </video>
    ) : null}
  </>
);

export const LinkMessage = ({ message }) => {
  const parseURLs = (text) => {
    const urls = getUrls(text);
    if (!urls.size) {
      return;
    }

    const parsedUrls = Array.from(urls).map((url, idx) => (
      <MicrolinkCard url={url} key={idx} />
    ));
    return <>{parsedUrls}</>;
  };

  return (
    <div className="youtube">
      {message.text !== null ? (
        <Linkify>{parseURLs(message.text)}</Linkify>
      ) : null}
    </div>
  );
};
