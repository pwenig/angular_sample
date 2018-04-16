class RequestsController < ApplicationController

  before_action :admin_user, only: [:edit, :update]

  def index 
    params[:added] = 'true'
    params[:in_progress] = 'true'
    params[:did_not_include] = 'true'
    @requests = Request.all
  end

  def new
    dimensions = []
    models = ActiveRecord::Base.connection.tables
    models.each do |model|
      next if %w[schema_migrations ar_internal_metadata
                 users networks ad_inputs campaign_inputs placement_inputs
                 package_inputs creative_inputs campaigns].include?(model)
      model.sub!('_', ' ')
      dimensions << model.capitalize.singularize
    end
    @sorted_dimensions = dimensions.sort_by { |f| f.class == Array ? f.first : f }
    @sorted_dimensions << 'If Other, indicate in the Feedback/Additional Information Section'
  end

  def create
    # Store request
    create_request(params)
    params['request']['email'] = current_user.email
    # Send email to the current_user/requestor
    RequestMailer.request_email(current_user.email, current_user.email, params['request']).deliver!
    # Send email to each of the admins
    User.where(admin: true).each do |user|
      RequestMailer.request_email(user.email, current_user.email, params['request']).deliver!
    end
    flash[:notice] = 'Naming request sent'
  end

  def edit 
    @request = Request.find(params[:id])
  end 

  def update
    @request = Request.find(params[:id])
    @request.update_attribute(:administrator, current_user.email)
    @request.update_attributes!(request_params)
    redirect_to requests_path
  end 

  def create_request(params)
    @request = Request.create!(requestor:  params['request']['name'], 
      brand: params['request']['brand'], dimension: params['request']['dimension'], 
      dimension_value: params['request']['dimension_value'], 
      additional_info: params['request']['additional'],
      requestor_email: current_user.email )
    if @request
      redirect_to requests_path
    else
      flash[:notice] = "There was an error with the request."
      redirect_to new_request_path
    end 
  end 

  def filter
    sortParams = []
    if params[:did_not_include]
      sortParams << 'Did Not Include'
    end 
    if params[:in_progress]
      sortParams << 'In Progress'
    end 
    if params[:added]
      sortParams << 'Added'
    end
    if(sortParams.length > 0)
      @requests = Request.where('status in (?)', sortParams)
    else
      @requests = Request.where(status: nil)
    end 
    render action: "index"
  end

  def request_params
    params.require(:request).permit(:status, :additional_info, :comments)
  end 

  def admin_user
    if current_user.admin
    else
      redirect_to requests_path
    end 
  end 
end
