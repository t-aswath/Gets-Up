defmodule GetsupWeb.RoomChannel do
  use GetsupWeb, :channel

  @impl true
  def join("room:" <> _room_code, _payload, socket) do
    {:ok, socket}
  end

  # def join("room:" <> _private_room_id, _payload, _socket) do
  #   {:error, %{reason: "unauthorized"}}
  # end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # @impl true
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", %{"body" => body}, socket) do
    broadcast!(socket, "shout", %{body: body})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  # defp authorized?(_payload) do
  #   true
  # end
end
