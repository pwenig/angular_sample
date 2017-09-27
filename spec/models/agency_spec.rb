require 'rails_helper'

RSpec.describe Agency, type: :model do
  it 'creates an agency' do
    agency = Agency.create(name: 'Sterling Cooper', abbrev: 'sc')
    expect(agency.name).to include('Sterling Cooper')
    expect(agency.abbrev).to include('sc')
  end
end
