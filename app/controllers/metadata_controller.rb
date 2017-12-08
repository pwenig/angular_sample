class MetadataController < ApplicationController
  def index
    @metadata = MetadataService.fetch_data
    # Add user agency to metadata object
    @metadata['agency'] = current_user.agency
    render json: @metadata
  end
end
