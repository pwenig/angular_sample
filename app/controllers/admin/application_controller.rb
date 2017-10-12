# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    before_action :authenticate_admin
    before_action :default_params

    def authenticate_admin
      return unless current_user.try(:admin) != true
      flash[:alert] = 'You are not authorized to access this page.'
      redirect_to(root_path)
    end

    # Sorts the admin collections by name.
    def default_params
      params[:order] ||= 'name'
      params[:direction] ||= 'asc'
    end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
