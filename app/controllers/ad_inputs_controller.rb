class AdInputsController < ApplicationController
  def create
    @ad_input = AdInput.find_by(ad_input_tag: params[:ad_input_tag])
    if @ad_input
      render json: @ad_input, status: 200
    else
      @ad_input = AdInput.create!(permitted_params)
      render json: @ad_input, status: 201
    end
  end

  def show
    @ad_input = AdInput.find_by(ad_input_tag: params[:id])
    if @ad_input
      render json: @ad_input, status: 200
    else
      head :no_content
    end
  end

  private

  def permitted_params
    params.permit(:placement_input_id, :creative_group_id, :custom, :ad_input_tag)
  end
end
