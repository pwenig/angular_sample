class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!

  protected

  def configure_permitted_parameters
    added_attrs = %i[username email password password_confirmation remember_me]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
    devise_parameter_sanitizer.permit :accept_invitation, keys: [:email]
  end

  def after_sign_in_path_for(_resource)
    # If the user is an admin, send them to the admin dashboard.
    if current_user && current_user.admin
      admin_root_path
    else
      root_path
    end
  end
end
