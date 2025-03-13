defmodule GetsupWeb.ChatController do
  use GetsupWeb, :controller

  def create(conn, _params) do
    room_code = :rand.uniform(90000) + 10000
    redirect(conn, to: "/chat/#{room_code}")
  end

  def index(conn, %{"id"=>id} = _params) do
    render(conn, :index, id: id)
  end
end
