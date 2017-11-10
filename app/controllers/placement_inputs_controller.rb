class PlacementInputsController < ApplicationController
  def create
    @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
                                               :targeting_type_2, :targeting_type_3, :targeting_type_4,
                                               :episode_start, :episode_end)
                                     .find_by(placement_input_tag: params['placement_input_tag'])
    if @placement_input
      render json: @placement_input, except: %i[ad_type_id tactic_id device_id ad_type_id targeting_type_1_id
                                                targeting_type_2_id targeting_type_3_id targeting_type_4_id
                                                episode_start_id episode_end_id],
             include: %i[ad_type ad_inputs tactic device ad_type targeting_type_1 targeting_type_2
                         targeting_type_3 targeting_type_4 episode_start episode_end], status: 200
    else
      @placement_input = PlacementInput.includes(:ad_inputs, :tactic, :device, :ad_type, :targeting_type_1,
                                                 :targeting_type_2, :targeting_type_3, :targeting_type_4,
                                                 :episode_start, :episode_end).create!(permitted_params)
      render json: @placement_input, except: %i[ad_type_id tactic_id device_id ad_type_id targeting_type_1_id
                                                targeting_type_2_id targeting_type_3_id targeting_type_4_id
                                                episode_start_id episode_end_id],
             include: %i[ad_type ad_inputs tactic device ad_type targeting_type_1 targeting_type_2
                         targeting_type_3 targeting_type_4 episode_start episode_end], status: 201
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
             include: %i[ad_type ad_inputs tactic device ad_type targeting_type_1
                         targeting_type_2 targeting_type_3 targeting_type_4 episode_start episode_end],
             status: 200
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
