require 'rails_helper'

RSpec.describe Program, type: :model do
  let(:network) { Network.create!(name: 'Comedy Central', abbrev: 'CCL') }
  subject { Program.new(abbrev: 'Foo', network: network) }

  it 'should belong to network' do
    # Using shoulda matchers for associations
    should belong_to(:network)
  end

  it 'should have many campaign inputs' do
    should have_many(:campaign_inputs)
  end

  it 'creates a program' do
    network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    program = Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id)
    expect(program.name).to include('Clusterfest')
    expect(program.network.name).to include('Comedy Central')
  end

  it 'creates a program with the same and on different networks' do
    network1 = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    network2 = Network.create!(name: 'Comedy Central Two', abbrev: 'CCL2')
    Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network1.id)
    program2 = Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network2.id)
    expect(program2.name).to include('Clusterfest')
  end

  it 'does not create a program with the same and on the same network' do
    network1 = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network1.id)
    program2 = Program.new(name: 'Clusterfest', abbrev: 'CLTF', network_id: network1.id)
    expect(program2).to_not be_valid
    expect(program2.errors[:name]).to include('has already been taken')
  end

  it 'should validate :abbrev required' do
    should validate_presence_of :abbrev
  end

  it 'should validate :name required' do
    should validate_presence_of :name
  end

  it 'should validate :name uniqueness' do
    should validate_uniqueness_of(:name).scoped_to(:network_id)
  end
end
