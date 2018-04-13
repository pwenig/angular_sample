require 'rails_helper'

RSpec.describe Request, type: :model do
  subject { Request.new(requestor: 'Test User') }

  it 'should create a request' do
    request = Request.create!(requestor: 'Test User', administrator: 'Admin User', brand: 'BET', dimension: 'Ad Type', dimension_value: 'New Type', status: 'Pending')
    expect(request.requestor).to include('Test User')
    expect(request.brand).to include('BET')
  end

  it 'should validate :brand required' do
    should validate_presence_of :brand
  end

  it 'should validate :dimension required' do
    should validate_presence_of :dimension
  end

  it 'should validate :dimension_value required' do
    should validate_presence_of :dimension_value
  end
end
