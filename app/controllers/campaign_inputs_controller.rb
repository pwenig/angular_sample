class CampaignInputsController < ApplicationController
  def index
    # Only get the pacakges that belong to the current user's agency or where the agency has not yet been set.
    # This only returns campaigns that have pacakge_inputs
    @campaign_inputs = CampaignInput.includes(:package_inputs)
                                    .where(package_inputs: { agency_id: current_user.agency.id })
                                    .or(CampaignInput.includes(:package_inputs)
                                    .where(package_inputs: {agency_id: nil}))
    render json: @campaign_inputs, include: [:network, :season, :program, :campaign_type, { package_inputs:
    { include: [:publisher, :agency, :inventory_type, :buy_method, { placement_inputs: { include: [:episode_start, :episode_end, :tactic, :device, :targeting_type_1, :targeting_type_2,
    :targeting_type_3, :targeting_type_4, :ad_type,
    { ad_inputs: { include: [:creative_group, {creative_inputs: {include: [:creative_message, :abtest_label, :video_length]} } ] } } ]} }] } }], status: 200
  end

  def create
    @campaign_input = CampaignInput.includes(:package_inputs, :network, :program, :season, :campaign_type)
                                   .find_by(campaign_input_tag: params['campaign_input_tag'])
    if @campaign_input
      render json: [@campaign_input, {status: 200}], except: %i[network_id program_id season_id],
             include: %i[network season program package_inputs campaign_type], status: 200
    else
      @campaign_input = CampaignInput.includes(:package_inputs, :network, :program, :season, :campaign_type)
                                     .create!(permitted_params)
      render json: [@campaign_input, {status: 201}], except: %i[network_id program_id season_id],
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

  def update
    ActiveRecord::Base.transaction do 
      # Update the creative namestring
      params['creativeParams'].each do |creative|
        current_creative = CreativeInput.find(creative['id'])
        if current_creative
          current_creative.update_attribute(:creative_input_tag, creative['creative_input_tag'])
        end
      end 
      # Update the ad namestring
      params['adParams'].each do |ad|
        current_ad = AdInput.find(ad['id'])
        if current_ad
          current_ad.update_attribute(:ad_input_tag, ad['ad_input_tag'])
        end 
      end 
      # Update the placement namestring
      params['placementParams'].each do |placement|
        current_placement = PlacementInput.find(placement['id'])
        if current_placement
          current_placement.update_attribute(:placement_input_tag, placement['placement_input_tag'])
        end 
      end
      # Update the package namestring
      params['packageParams'].each do |package|
        current_package = PackageInput.find(package['id'])
        if current_package
          current_package.update_attribute(:package_input_tag, package['package_input_tag'])
        end 
      end 
      # Update the campaign
      @campaign_input = CampaignInput.includes(:package_inputs).find(params[:id])
      if @campaign_input
        if @campaign_input.update!(permitted_params)
          render json: @campaign_input, include: [:network, :season, :program, :campaign_type, { package_inputs:
            { include: [:publisher, :agency, :inventory_type, :buy_method, { placement_inputs: { include: [:episode_start, :episode_end, :tactic, :device, :targeting_type_1, :targeting_type_2,
            :targeting_type_3, :targeting_type_4, :ad_type,
            { ad_inputs: { include: [:creative_group, {creative_inputs: {include: [:creative_message, :abtest_label, :video_length]} } ] } } ]} }] } }], status: 200
        else 
          head :no_content
        end
      else
        head :no_content
      end 
    end 
  end 

  def destroy
    @campaign_input = CampaignInput.find(params['id'])
    if @campaign_input
      @campaign_input.delete
      render json: @campaign_input, status: 200
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
