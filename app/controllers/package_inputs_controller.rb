class PackageInputsController < ApplicationController
  def index
    @package_inputs = PackageInput.all
    render json: @package_inputs
  end

  def create
    @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                 .find_by(package_input_tag: params['package_input_tag'])
    if @package_input
      render json: @package_input, except: %i[agency_id publisher_id buy_method_id inventory_type_id],
             include: %i[agency publisher buy_method inventory_type placement_inputs], status: 200
    else
      @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                   .create!(permitted_params)
      render json: @package_input, except: %i[agency_id publisher_id buy_method_id inventory_type_id],
             include: %i[agency publisher buy_method inventory_type placement_inputs], status: 201
    end
  end

  def show
    @package_input = PackageInput.includes(:placement_inputs, :agency, :publisher, :buy_method, :inventory_type)
                                 .find_by(package_input_tag: params[:id])
    if @package_input
      render json: @package_input,
             except: %i[agency_id publisher_id buy_method_id inventory_type_id],
             include: %i[agency publisher buy_method inventory_type placement_inputs],
             status: 200
    else
      head :no_content
    end
  end

  private

  def permitted_params
    params.permit(:agency_id, :publisher_id, :buy_method_id,
                  :inventory_type_id, :campaign_input_id,
                  :custom, :package_input_tag)
  end
end
