class CustomFailure < Devise::FailureApp
  # Redirect errors back to index page.
  def redirect_url
    root_path
  end

  def respond
    if http_auth?
      http_auth
    else
      redirect
    end
  end
end
