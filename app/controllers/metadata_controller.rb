class MetadataController < ApplicationController
  def index
    @metadata = MetadataService.fetch_data
    render json: @metadata
  end
end
