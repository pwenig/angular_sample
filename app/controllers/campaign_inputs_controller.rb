class CampaignInputsController < ApplicationController
  def index
    @campaign_inputs = CampaignInput.all
    render json: @campaign_inputs
  end

  def create
    # Check to see if it already exists
    @campaign_input = CampaignInput.find_by(campaign_input_tag: params['campaign_input_tag'])
    if @campaign_input
      render json: @campaign_input, status: 200
    else
      @campaign_input = CampaignInput.create!(permitted_params)
      render json: @campaign_input, status: 201
    end
  end

  def show
    @campaign_input = CampaignInput.find_by(campaign_input_tag: params[:id])
    if @campaign_input
      render json: @campaign_input, status: 200
    else
      head :no_content
    end
  end

  private

  def permitted_params
    params.permit(:network_id, :program_id, :season_id, :campaign_type_id, :custom,
                  :start_month, :start_year, :start_day, :end_month, :end_year, :end_day,
                  :campaign_input_tag)
  end
end
