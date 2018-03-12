class PlacementInputsController < ApplicationController
  def create
    @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
                                               :targeting_type_2, :targeting_type_3, :targeting_type_4,
                                               :episode_start, :episode_end)
                                     .find_by(placement_input_tag: params['placement_input_tag'])
    if @placement_input
      render json: [@placement_input, {status: 200}], include: [:ad_type, :ad_inputs, :tactic, :device, :ad_type, :targeting_type_1, :targeting_type_2,
                       :targeting_type_3, :targeting_type_4, :episode_start, :episode_end,
                       package_input: { include: [:campaign_input] }], status: 200
    else
      @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
                                                 :targeting_type_2, :targeting_type_3, :targeting_type_4,
                                                 :episode_start, :episode_end).create!(permitted_params)
      render json: [@placement_input, {status: 201}], include: [:ad_type, :ad_inputs, :tactic, :device, :ad_type, :targeting_type_1, :targeting_type_2,
                       :targeting_type_3, :targeting_type_4, :episode_start, :episode_end,
                       package_input: { include: [:campaign_input] }], status: 201
    end
  end

  def show
    @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type,
                                               :targeting_type_1, :targeting_type_2, :targeting_type_3,
                                               :targeting_type_4, :episode_start, :episode_end)
                                     .find_by(placement_input_tag: params[:id])
    if @placement_input
      render json: @placement_input, except: %i[ad_type_id tactic_id device_id ad_type_id
                                                targeting_type_1_id targeting_type_2_id targeting_type_3_id
                                                targeting_type_4_id episode_start_id episode_end_id],
             include: [:ad_type, :ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
                       :targeting_type_2, :targeting_type_3, :targeting_type_4, :episode_start, :episode_end,
                       package_input: { include: [:campaign_input] }],
             status: 200
    else
      head :no_content
    end
  end

  def update 
    ActiveRecord::Base.transaction do 
      # Update the creative namestrings
      params['creativeParams'].each do |creative|
        current_creative = CreativeInput.find(creative['id'])
        if current_creative
          current_creative.update_attribute(:creative_input_tag, creative['creative_input_tag'])
        end 
      end 
      # Update the ad namestrings
      params['adParams'].each do |ad|
        current_ad = AdInput.find(ad['id'])
        if current_ad
          current_ad.update_attribute(:ad_input_tag, ad['ad_input_tag'])
        end 
      end 
      @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
          :targeting_type_2, :targeting_type_3, :targeting_type_4,
          :episode_start, :episode_end).find(params[:id])
      if @placement_input
        if @placement_input.update!(permitted_params)
          render json: @placement_input, include: [:ad_type, :tactic, :device, :ad_type, :targeting_type_1, :targeting_type_2,
                       :targeting_type_3, :targeting_type_4, :episode_start, :episode_end, ad_inputs: {include: [:creative_group, {creative_inputs: {include: [:creative_message, :abtest_label, :video_length] }}]}], status: 200 
        else 
          head :no_content
         end 
      else
        head :no_content
      end 
    end 
  end 

  def destroy
    @placement_input = PlacementInput.find(params['id'])
    if @placement_input
      @placement_input.delete
      render json: @placement_input, status: 200
    else 
      head :no_content
    end 
  end 

  private

  def permitted_params
    params.permit(:package_input_id, :tentpole_details, :tactic_id,
                  :device_id, :ad_type_id, :width, :height,
                  :targeting_type_1_id, :targeting_type_2_id,
                  :targeting_type_3_id, :targeting_type_4_id,
                  :episode_start_id, :episode_end_id,
                  :placement_input_tag, :audience_type)
  end
end
