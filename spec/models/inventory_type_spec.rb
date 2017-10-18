require 'rails_helper'

RSpec.describe InventoryType, type: :model do
  subject { InventoryType.new(abbrev: 'PSD') }

  it 'should create an inventory type' do
    inventory_type = InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD')
    expect(inventory_type.name).to include('Partner Social Distribution')
    expect(inventory_type.abbrev).to include('PSD')
  end

  it 'should validate :abbrev required' do
    should validate_presence_of :abbrev
  end

  it 'should validate :name required' do
    should validate_presence_of :name
  end

  it 'should validate :name uniqueness' do
    should validate_uniqueness_of :name
  end
end
