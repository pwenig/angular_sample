class MetadataController < ApplicationController

  def index
    @metadata = MetadataService.get_data
    render json: @metadata
  end

end