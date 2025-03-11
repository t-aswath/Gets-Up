defmodule GetsupWeb.ChatController do
  use GetsupWeb, :controller

  def index(conn, _params) do
    render(conn, :index)
  end
end
