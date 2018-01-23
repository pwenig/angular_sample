class CampaignInputsController < ApplicationController
  def index
    # Only get the pacakges that belong to the current user's agency or where the agency has not yet been set.
    # This only returns campaigns that have pacakge_inputs
    @campaign_inputs = CampaignInput.includes(:package_inputs)
                                    .where(package_inputs: { agency_id: current_user.agency.id })
                                    .or(CampaignInput.includes(:package_inputs)
                                    .where(package_inputs: {agency_id: nil}))
    render json: @campaign_inputs, include: [:network, :season, :program, { package_inputs:
    { include: [:publisher,:agency, :buy_method, { placement_inputs: { include: [:episode_start, :episode_end, :tactic, :device, :targeting_type_1, :targeting_type_2,
    :targeting_type_3, :targeting_type_4, :ad_type,
    { ad_inputs: { include: [:creative_group, {creative_inputs: {include: [:creative_message, :abtest_label, :video_length]} } ] } } ]} }] } }], status: 200
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
    # merge(user_id: current_user.id)
    params.permit(:network_id, :program_id, :season_id, :campaign_type_id, :custom,
                  :start_month, :start_year, :start_day, :end_month, :end_year, :end_day,
                  :campaign_input_tag)
  end
end
