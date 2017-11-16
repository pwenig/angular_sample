class RequestsController < ApplicationController
  def new
    dimensions = []
    models = ActiveRecord::Base.connection.tables
    models.each do |model|
      next if %w[schema_migrations ar_internal_metadata
                 users networks ad_inputs campaign_inputs placement_inputs
                 package_inputs creative_inputs].include?(model)
      model.sub!('_', ' ')
      dimensions << model.capitalize.singularize
      # end
    end
    @sorted_dimensions = dimensions.sort_by { |f| f.class == Array ? f.first : f }
    @sorted_dimensions << 'If Other, indicate in the Feedback/Additional Information Section'
  end

  def create
    params['request']['email'] = current_user.email
    # Send email to the current_user/requestor
    RequestMailer.request_email(current_user.email, current_user.email, params['request']).deliver!
    # Send email to each of the admins
    User.where(admin: true).each do |user|
      RequestMailer.request_email(user.email, current_user.email, params['request']).deliver!
    end
    flash[:notice] = 'Naming request sent'
    redirect_to root_path
  end
end
