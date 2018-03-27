class PackageInputsController < ApplicationController
  def index
    @package_inputs = PackageInput.all
    render json: @package_inputs
  end

  def create
    @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                 .find_by(package_input_tag: params['package_input_tag'])
    if @package_input
      render json: [@package_input, {status: 200}], except: %i[agency_id publisher_id buy_method_id inventory_type_id],
             include: %i[agency publisher buy_method inventory_type placement_inputs campaign_input], status: 200
    else
      @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                   .create!(permitted_params)
      render json: [@package_input, {status: 201}], include: %i[agency publisher buy_method inventory_type placement_inputs campaign_input], status: 201
    end
  end

  def show
    @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                 .find_by(package_input_tag: params[:id])
    if @package_input
      render json: @package_input,
             except: %i[agency_id publisher_id buy_method_id inventory_type_id],
             include: %i[agency publisher buy_method inventory_type placement_inputs campaign_input],
             status: 200
    else
      head :no_content
    end
  end

  def update
    ActiveRecord::Base.transaction do 
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
      # Update the package
      @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type).find(params[:id])
      if @package_input
        if @package_input.update!(permitted_params)
          render json: @package_input, include: [:agency, :publisher, :buy_method, :inventory_type, 
            :campaign_input, placement_inputs: { include: [:tactic, :device, :ad_type, ad_inputs: {include: [:creative_group, {creative_inputs: {include: [:creative_message, :abtest_label ] } } ] } ] } ],
            status: 200
        else
          head :no_content
        end
      else
        head :no_content 
      end 
    end 
  end

  def destroy
    @package_input = PackageInput.find(params['id'])
    if @package_input
      @package_input.delete
      render json: @package_input, status: 200
    else 
      head :no_content
    end 
  end 

  private

  def permitted_params
    params.permit(:agency_id, :publisher_id, :buy_method_id,
                  :inventory_type_id, :campaign_input_id,
                  :custom, :package_input_tag, :lock_version)
  end
end
