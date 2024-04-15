class HomeController < ApplicationController
  #CSRF対策を無効化
  skip_before_action :verify_authenticity_token
  def top
    @path=$path
  end

  def create
    image = params[:image][:picture]
    File.binwrite("app/assets/images/test3.jpg", image.read)
    $path = "test3.jpg"

    redirect_to '/home'
  end

end
