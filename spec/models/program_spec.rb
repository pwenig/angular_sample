require 'rails_helper'

RSpec.describe Program, type: :model do
  it 'should belong to network' do
    # Using shoulda matchers for associations
    should belong_to(:network)
  end

  it 'creates a program' do
    network = Network.create(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    expect(program.name).to include('Clusterfest')
    expect(program.network.name).to include('Comedy Central')
  end
end
