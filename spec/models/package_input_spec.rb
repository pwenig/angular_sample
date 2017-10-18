require 'rails_helper'

RSpec.describe PackageInput, type: :model do
  it 'should belong to a campaign input' do
    should belong_to(:campaign_input)
  end

  it 'should belong to an agency' do
    should belong_to(:agency)
  end

  it 'should belong to a publisher' do
    should belong_to(:publisher)
  end

  it 'should belong to a buy method' do
    should belong_to(:buy_method)
  end

  it 'should belong to an inventory type' do
    should belong_to(:inventory_type)
  end

  it 'should create a package input' do
    # Create the campaign input
    network = Network.create!(name: 'Comedy Central', abbrev: 'CCL')
    campaign_input = CampaignInput.create!(
      network: network,
      program: Program.create!(name: 'Clusterfest', abbrev: 'CLTF', network_id: network.id),
      campaign_type: CampaignType.create!(name: 'Binge', abbrev: 'BG'),
      season: Season.create!(name: 'S00', abbrev: 's00'),
      custom: 'xx',
      start_month: '01',
      start_day: '21',
      start_year: 2017,
      end_day: '21',
      end_month: '02',
      end_year: 2017,
      campaign_input_tag: 'CCL_ CLTF_ S00_ BG_ xx_ 20170121-20170221'
    )
    package_input = PackageInput.create!(
      campaign_input: campaign_input,
      agency: Agency.create!(name: 'Sterling Cooper', abbrev: 'sc'),
      publisher: Publisher.create!(name: 'ABC', abbrev: 'ABCX'),
      buy_method: BuyMethod.create!(name: 'CPA', abbrev: 'CPA'),
      inventory_type: InventoryType.create!(name: 'Partner Social Distribution', abbrev: 'PSD'),
      custom: 'xx',
      package_input_tag: 'CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx'
    )
    expect(package_input.agency.name).to include('Sterling Cooper')
    expect(package_input.publisher.name).to include('ABC')
    expect(package_input.buy_method.name).to include('CPA')
    expect(package_input.inventory_type.name).to include('Partner Social Distribution')
    expect(package_input.custom).to include('xx')
    expect(package_input.package_input_tag).to include('CCL_CLTF_S00_SC_ABCX_CPA_PSD_xx')
  end
end
