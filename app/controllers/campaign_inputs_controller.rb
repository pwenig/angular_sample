class CampaignInputsController < ApplicationController
  def index
    @campaign_inputs = CampaignInput.includes(:package_inputs).all
    render json: @campaign_inputs, include: [{ package_inputs:
    { include: { placement_inputs: { include:
    { ad_inputs: { include: :creative_inputs } } } } } }], status: 200
  end

  def create
    @campaign_input = CampaignInput.includes(:package_inputs, :network, :program, :season, :campaign_type)
                                   .find_by(campaign_input_tag: params['campaign_input_tag'])
    if @campaign_input
      render json: @campaign_input, except: %i[network_id program_id season_id],
             include: %i[network season program package_inputs campaign_type], status: 200
    else
      @campaign_input = CampaignInput.includes(:package_inputs, :network, :program, :season, :campaign_type)
                                     .create!(permitted_params)
      render json: @campaign_input, except: %i[network_id program_id season_id],
             include: %i[network season program package_inputs campaign_type], status: 201
    end
  end

  def show
    @campaign_input = CampaignInput.includes(:package_inputs, :network, :program, :season, :campaign_type)
                                   .find_by(campaign_input_tag: params[:id])
    if @campaign_input
      render json: @campaign_input,
             except: %i[network_id program_id season_id],
             include: %i[network season program package_inputs campaign_type],
             status: 200
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
