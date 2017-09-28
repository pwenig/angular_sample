require 'rails_helper'

RSpec.describe Network, type: :model do

  it 'creates a network' do 
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    expect(network.name).to include('Comedy Central')
  end 
end