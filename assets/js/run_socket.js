// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"

// And connect to the path in "lib/getsup_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/getsup_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/getsup_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/getsup_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
let channel = socket.channel(`room:${window.location.pathname.split("/").pop()}`, {})

let chatInput         = document.querySelector("#chat-input")
let messagesContainer = document.querySelector("#messages")

chatInput.addEventListener("keypress", event => {
  if(event.key === 'Enter' && chatInput.value !== ""){
    channel.push("shout", {body: chatInput.value})
    chatInput.value = ""
  }
})

channel.on("shout", payload => {
  let messagesContainer = document.getElementById("messages");

  let messageItem = document.createElement("div");
  messageItem.classList.add("message-container");

  let messageBubble = document.createElement("div");
  messageBubble.classList.add("message");

  // let isMyMessage = payload.sender === "me"; // Replace with actual user check
  messageBubble.classList.add(false ? "my-message" : "other-message");

  let messageText = document.createElement("p");
  messageText.innerText = payload.body;

  let messageTime = document.createElement("span");
  messageTime.classList.add("message-time");
  messageTime.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageBubble.appendChild(messageText);
  messageBubble.appendChild(messageTime);
  messageItem.appendChild(messageBubble);
  messagesContainer.appendChild(messageItem);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
