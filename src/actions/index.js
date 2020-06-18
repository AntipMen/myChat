import { actionFetch } from "../reducers/PromiseReducer";
import { GQL } from "../graphQL";

export const actionAuthLogin = (token) => ({ type: "AUTH_LOGIN", token });
export const actionAuthLogout = () => ({ type: "AUTH_LOGOUT" });

export const actionSearch = (query) => ({ type: "SEARCH", query });
export const actionSearchResult = (result) => ({
  type: "SEARCH_RESULT",
  result,
});
export const actionCleanResult = () => ({ type: "CLEAN_RESULT" });

export const actionPending = (key, promise) => {
  return {
    status: "PENDING",
    payload: null,
    error: null,
    type: "PROMISE",
    key,
    promise,
  };
};

export const actionResolved = (key, payload) => {
  return { status: "RESOLVED", payload, error: null, type: "PROMISE", key };
};

export const actionRejected = (key, error) => {
  return {
    status: "REJECTED",
    payload: null,
    error: error,
    type: "PROMISE",
    key,
  };
};

export const actionCleanPromise = () => ({ type: "AUTH_LOGOUT" });

export const actionSaveChat = (payload) => ({ type: "SAVE_CHATS", payload });
export const actionSaveMes = (message) => ({
  type: "SAVE_MESSAGE",
  message,
});

export const actionInvalidPassword = ({ message }) => ({
  type: "INVALID_PASSWORD",
  message,
});

export const actionInvalidLogin = ({ message }) => ({
  type: "INVALID_LOGIN",
  message,
});

export const actionReplyMessage = (chatId, replyMessage) => ({
  type: "REPLY_MESSAGE",
  chatId,
  replyMessage,
});

export const actionForwardMessage = (forwardMessage) => ({
  type: "FORWARD_MESSAGE",
  forwardMessage,
});

export const actionCleanMessage = () => ({ type: "CLEAN_MESSAGE" });

export const actionMediaMessage = (media) => ({
  type: "MEDIA_MESSAGE",
  media,
});

export const actionErrorMessage = () => ({ type: "ERROR_MESSAGE" });

export const actionChangeAvatar = (avatar) => ({
  type: "CHANGE_AVATAR",
  avatar,
});

export const actionEditMessage = (editMessage) => ({
  type: "EDIT_MESSAGE",
  editMessage,
});

export const actionSaveUsers = (users) => ({ type: "SAVE_USERS", users });
export const actionUserChange = (avatar, userId) => ({
  type: "USER_CHANGE",
  avatar,
  userId,
});

export const actionDeleteMessage = (chatId, messageId) => ({
  type: "DELETE_MESSAGE",
  chatId,
  messageId,
});

export function actionChatList(store) {
  const id = store.auth.data.sub.id;
  let owner = JSON.stringify([{ "members._id": id }, { sort: [{ _id: -1 }] }]);
  return actionPending(
    "chats",
    GQL(
      `query ChatF($owner: String){
        ChatFind(query: $owner) {
          _id
          avatar {
            url
          }
          owner {
            login
          }
          title
          members {
            login
            _id
          }
          messages {
            _id
            createdAt
            text
            replies {
              _id
              createdAt
              text
            }
            replyTo {
              _id
              createdAt
              text
              owner{
                login
                _id
            }
            }
            forwarded {
              _id
              createdAt
              text
              owner {
                login
              }
            }
            forwardWith {
              _id
              createdAt
              text
              owner {
                login
              }
            }
            media {
              url
              _id
              originalFileName
              type
            }
            chat {
              title
            }
            owner {
              login
              avatar {
                url
                _id
              }
            }
          }
        }
      }`,
      { owner: owner }
    )
  );
}

export function actionCreateMessage(value, id) {
  return actionPending(
    "newmessage",
    GQL(
      `mutation CreateMessage($text: String){
              MessageUpsert (message: {
              text: $text
              chat: {
              _id: \"${id}\"
              }
              }){
              _id
              text
              media {
                url
                _id
              }
              owner {
              login
              }
              }
              }`,
      { text: value }
    )
  );
}

export function actionMedia(value, mediaId, chatId) {
  return actionPending(
    "newmesmedia",
    GQL(
      `mutation CreateMessageMedia{
                MessageUpsert (message: {
                text: \"${value}\"
                media: [{
                    _id: \"${mediaId}\"
                      }]
                chat: {
                _id: \"${chatId}\"
                }
                }){
                _id
                text
                media {
                  url
                  _id
                  originalFileName
                  type
                }
                owner {
                login
                }
                }
                }`
    )
  );
}

export function actionCreateNewChat(userId, auth, chatName) {
  return actionPending(
    "newchat",
    GQL(
      `mutation CreateNewChat{
            ChatUpsert(chat: {
              title:  \"${chatName}\"
                 members: [
                 {
                  _id:  \"${userId._id}\"
                },
                  {
                    _id: \"${auth}\"
                  }
                ]
            }) {
              _id
              createdAt
              title
              members {
                login
              }
            }
          }`
    )
  );
}

export function actionAllUsers() {
  return actionPending(
    "users",
    GQL(
      `query user{
            UserFind(query: "[{}]"){
              _id
              login
              nick
              avatar {
                _id
                url
              }
                }
          }
          `
    )
  );
}

export function actionAddMembers(chatId, newUser, members) {
  let allusers = [...members, newUser];

  var newMembers = [];
  for (var i = 0; i < allusers.length; ++i) {
    newMembers[i] = { _id: allusers[i] };
  }
  return actionPending(
    "updatechat",
    GQL(
      `mutation NewMembers($membersList:[UserInput]){
            ChatUpsert(chat: {
            _id:  \"${chatId}\"
            members: $membersList
            }) {
              _id
              createdAt
              title
              media {
                url
                _id
              }
              members {
                login
                _id
              }
            }
          }`,
      { membersList: newMembers }
    )
  );
}

export function actionReply(value, chatId, messageId) {
  return actionPending(
    "replymes",
    GQL(
      `mutation MessageReply{
            MessageUpsert(message: {
              chat: {
                _id: \"${chatId}\"
              }
                text: \"${value}\"
              replyTo: {
                _id: \"${messageId}\"
              
              }
            }
            ) {
              _id
              createdAt
              text
              media {
                url
                _id
                originalFileName
                type
              }
            }
          }`
    )
  );
}

export function actionForward(value, chatId, messageId) {
  return actionPending(
    "forward",
    GQL(
      `mutation MessagrForward{
            MessageUpsert(message: {
              chat:{
                _id: \"${chatId}\"
              }
              text: \"${value}\"
              forwarded: {
                _id: \"${messageId}\"
              }
            }) {
              _id
              createdAt
              text
              media {
                url
                _id
                originalFileName
                type
              }
              owner {
                login
              }
            }
          }`
    )
  );
}

export function actionEdit(value, messageId) {
  debugger;
  return actionPending(
    "edit",
    GQL(
      ` mutation EditMessage{
            MessageUpsert(message:{ 
              _id: \"${messageId}\"
              text: \"${value}\"
            }) 
            {
              _id
              text
              media {
              _id
              url
              type
            }
            }
          }`
    )
  );
}

export function actionChangeUser(mediaId, userId) {
  return actionPending(
    "changeuser",
    GQL(
      ` mutation UserChange{
        UserUpsert(user: {
          _id: \"${userId}\"
          avatar: {
            _id: \"${mediaId}\"
          }
        } ) {
          _id
          createdAt
          login
          nick
          avatar{
            _id
            url
          }
        }
      }`
    )
  );
}
