class AdInputsController < ApplicationController
  def create
    @ad_input = AdInput.includes(:creative_inputs).find_by(ad_input_tag: params[:ad_input_tag])
    if @ad_input
      render json: [@ad_input, {status: 200}], except: %i[creative_group_id],
             include: [:creative_group, :creative_inputs, placement_input:
             { include: [package_input: { include: [:campaign_input] }] }], status: 200
    else
      @ad_input = AdInput.create!(permitted_params)
      render json: [@ad_input, {status: 201}], include: [:creative_group, :creative_inputs, placement_input: { include: [package_input:
             { include: [:campaign_input] }] }], status: 201
    end
  end

  def show
    @ad_input = AdInput.includes(:creative_inputs).find_by(ad_input_tag: params[:id])
    if @ad_input
      render json: @ad_input, except: %i[creative_group_id],
             include: [:creative_group, :creative_inputs, placement_input:
             { include: [package_input: { include: [:campaign_input] }] }], status: 200
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
      @ad_input = AdInput.includes(:creative_inputs).find(params[:id])
      if @ad_input 
        if @ad_input.update!(permitted_params)
          render json: @ad_input, include: [:placement_input, :creative_group,  creative_inputs: {include: [:creative_message, :abtest_label, :video_length] } ], status: 201
        else 
          head :no_content
        end 
      else 
        head :no_content
      end 
    end
  end 

  def destroy
    @ad_input = AdInput.find(params['id'])
    if @ad_input
      @ad_input.delete
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
