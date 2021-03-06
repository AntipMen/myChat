import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import "./index.css";
import { Pending } from "../../../helpers";
import { actionSaveMes } from "../../../actions";
import { store } from "../../../reducers";
import { LeftNavigation } from "../ChatList";
import "emoji-mart/css/emoji-mart.css";
import { CNewMessage } from "./messageInput";
import { Messages } from "./messageList";

const socket = io("http://chat.fs.a-level.com.ua/");

if (localStorage.authToken) socket.emit("jwt", localStorage.authToken);

socket.on("jwt_ok", (data) => console.log(data));
socket.on("jwt_fail", (error) => console.log(error));
socket.on("msg", (message, media) =>
  store.dispatch(actionSaveMes(message, media))
);

const MessagesList = ({
  chats,
  match: {
    params: { _id },
  },
  auth,
}) => {
  const messagesRef = useRef(null);
  const chatList = chats[_id] && chats[_id].messages;
  useEffect(() => {
    messagesRef.current && messagesRef.current.scrollTo(0, 999999);
  }, [chatList]);
  return chats[_id] ? (
    <>
      <main className="main-block">
        <LeftNavigation />
        <div className="block-chat">
          <div className="block-chat-main">
            <Messages
              blockRef={messagesRef}
              messages={chats[_id].messages}
              members={chats[_id].members}
              auth={auth}
              id={_id}
            />
            <CNewMessage />
          </div>
        </div>
      </main>
    </>
  ) : (
    <Pending />
  );
};

export const CMessagesList = connect((state) => ({
  chats: state.chats,
  auth: state.auth.data && state.auth.data.sub,
}))(MessagesList);
